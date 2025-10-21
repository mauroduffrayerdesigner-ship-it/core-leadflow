import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Input validation schema
const SendMessageSchema = z.object({
  campanhaId: z.string().uuid('ID de campanha inválido'),
  leadId: z.string().uuid('ID de lead inválido'),
  conversationId: z.string().uuid('ID de conversa inválido').optional(),
  message: z.string().min(1, 'Mensagem não pode estar vazia').max(4096, 'Mensagem muito longa'),
  type: z.enum(['text', 'image', 'document']).default('text'),
  mediaUrl: z.string().url('URL de mídia inválida').optional()
})

// Rate limiting simples (em produção usar Redis ou KV)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

const checkRateLimit = (key: string, limit = 10): boolean => {
  const now = Date.now()
  const data = rateLimitMap.get(key)
  
  if (!data || data.resetAt < now) {
    rateLimitMap.set(key, { count: 1, resetAt: now + 60000 }) // 1 min
    return true
  }
  
  if (data.count >= limit) return false
  
  data.count++
  return true
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const body = await req.json()
    
    // Validação com Zod
    const validated = SendMessageSchema.parse(body)
    const { campanhaId, leadId, conversationId, message, type, mediaUrl } = validated
    
    // Rate limiting
    const rateLimitKey = `whatsapp_send_${campanhaId}`
    if (!checkRateLimit(rateLimitKey)) {
      return new Response(
        JSON.stringify({ error: 'Limite de mensagens atingido. Tente novamente em 1 minuto.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    console.log('[whatsapp-send-message] Processando envio:', { campanhaId, leadId })
    
    // Inicializar Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )
    
    // Buscar config
    const { data: config, error: configError } = await supabase
      .from('whatsapp_config')
      .select('*')
      .eq('campanha_id', campanhaId)
      .single()
    
    if (configError || !config) {
      console.error('[whatsapp-send-message] Config não encontrada:', configError)
      throw new Error('Configuração WhatsApp não encontrada')
    }
    
    // Buscar lead
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('nome, telefone, email')
      .eq('id', leadId)
      .single()
    
    if (leadError || !lead) {
      console.error('[whatsapp-send-message] Lead não encontrado:', leadError)
      throw new Error('Lead não encontrado')
    }
    
    if (!lead.telefone) {
      throw new Error('Lead sem telefone cadastrado')
    }
    
    // Enviar via API
    let result
    if (config.api_type === 'official') {
      result = await sendViaOfficial(config, lead.telefone, message, type, mediaUrl)
    } else {
      result = await sendViaVenom(config, lead.telefone, message, type, mediaUrl)
    }
    
    console.log('[whatsapp-send-message] Mensagem enviada:', result)
    
    // Criar/atualizar conversação
    let finalConversationId = conversationId
    if (!finalConversationId) {
      const { data: conv } = await supabase
        .from('whatsapp_conversations')
        .select('id')
        .eq('campanha_id', campanhaId)
        .eq('lead_id', leadId)
        .maybeSingle()
      
      if (conv) {
        finalConversationId = conv.id
      } else {
        const { data: newConv } = await supabase
          .from('whatsapp_conversations')
          .insert({
            campanha_id: campanhaId,
            lead_id: leadId,
            last_message_at: new Date().toISOString(),
            last_message_content: message,
            last_message_direction: 'outbound',
            total_messages: 1,
          })
          .select()
          .single()
        
        finalConversationId = newConv?.id
      }
    }
    
    // Salvar mensagem
    const { error: msgError } = await supabase
      .from('whatsapp_messages')
      .insert({
        campanha_id: campanhaId,
        lead_id: leadId,
        conversation_id: finalConversationId,
        content: message,
        type: type,
        media_url: mediaUrl,
        direction: 'outbound',
        status: 'sent',
        whatsapp_id: result.id,
        to_number: lead.telefone,
        timestamp: new Date().toISOString(),
      })
    
    if (msgError) {
      console.error('[whatsapp-send-message] Erro ao salvar mensagem:', msgError)
    }
    
    // Atualizar contadores da conversa
    if (finalConversationId) {
      await supabase.rpc('increment', {
        row_id: finalConversationId,
        x: 1
      }).catch(() => {
        // Fallback se RPC não existir
        supabase
          .from('whatsapp_conversations')
          .update({
            last_message_at: new Date().toISOString(),
            last_message_content: message,
            last_message_direction: 'outbound',
          })
          .eq('id', finalConversationId)
      })
    }
    
    return new Response(
      JSON.stringify({ success: true, messageId: result.id, conversationId: finalConversationId }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
    
  } catch (error: any) {
    console.error('[whatsapp-send-message] Erro:', error)
    
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ 
          error: 'Dados inválidos', 
          details: error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function sendViaOfficial(config: any, phone: string, message: string, type: string, mediaUrl?: string) {
  const url = `https://graph.facebook.com/v18.0/${config.phone_number_id}/messages`
  
  const body: any = {
    messaging_product: 'whatsapp',
    to: phone.replace(/\D/g, ''),
    type: type,
  }
  
  if (type === 'text') {
    body.text = { body: message }
  } else if (type === 'image' && mediaUrl) {
    body.image = { link: mediaUrl, caption: message }
  } else if (type === 'document' && mediaUrl) {
    body.document = { link: mediaUrl, caption: message }
  }
  
  console.log('[sendViaOfficial] Enviando para WhatsApp API:', { phone, type })
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.access_token_secret}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  
  if (!response.ok) {
    const errorData = await response.json()
    console.error('[sendViaOfficial] Erro da API WhatsApp:', errorData)
    throw new Error(`WhatsApp API error: ${JSON.stringify(errorData)}`)
  }
  
  const data = await response.json()
  return { id: data.messages[0].id }
}

async function sendViaVenom(config: any, phone: string, message: string, type: string, mediaUrl?: string) {
  if (!config.venom_webhook_url) {
    throw new Error('Venom webhook URL não configurada')
  }
  
  console.log('[sendViaVenom] Enviando via Venom:', { phone, type })
  
  const response = await fetch(config.venom_webhook_url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      session: config.venom_session_name,
      phone: phone,
      message: message,
      type: type,
      mediaUrl: mediaUrl,
    }),
  })
  
  if (!response.ok) {
    const errorData = await response.text()
    console.error('[sendViaVenom] Erro:', errorData)
    throw new Error(`Venom API error: ${errorData}`)
  }
  
  const data = await response.json()
  return { id: data.id || `venom_${Date.now()}` }
}