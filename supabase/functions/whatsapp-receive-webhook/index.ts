import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { createHmac } from "https://deno.land/std@0.190.0/node/crypto.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Verify WhatsApp webhook signature
function verifySignature(body: string, signature: string | null, secret: string): boolean {
  if (!signature || !secret) return false
  
  try {
    const expectedSignature = createHmac('sha256', secret)
      .update(body)
      .digest('hex')
    return `sha256=${expectedSignature}` === signature
  } catch (error) {
    console.error('Error verifying signature:', error)
    return false
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  // GET - Webhook verification (Meta WhatsApp)
  if (req.method === 'GET') {
    const url = new URL(req.url)
    const mode = url.searchParams.get('hub.mode')
    const token = url.searchParams.get('hub.verify_token')
    const challenge = url.searchParams.get('hub.challenge')
    
    console.log('[whatsapp-webhook] Verificação:', { mode, token })
    
    if (mode === 'subscribe' && token) {
      // Verificar token contra configuração do banco
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      const supabase = createClient(supabaseUrl, supabaseKey)
      
      const { data: configs } = await supabase
        .from('whatsapp_config')
        .select('webhook_verify_token')
        .eq('api_type', 'official')
        .not('webhook_verify_token', 'is', null)
      
      // Verificar se o token corresponde a alguma configuração
      const isValidToken = configs?.some(config => config.webhook_verify_token === token)
      
      if (!isValidToken) {
        console.error('Invalid verification token')
        return new Response('Invalid verification token', { 
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
        })
      }
      
      console.log('[whatsapp-webhook] Webhook verificado')
      return new Response(challenge, { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
      })
    }
    
    return new Response('Forbidden', { status: 403 })
  }

  // POST - Receber mensagens
  try {
    const rawBody = await req.text()
    console.log('[whatsapp-webhook] Payload recebido')
    
    // Inicializar Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )
    
    // Parsear payload
    const body = JSON.parse(rawBody)
    
    // Verificar assinatura HMAC do WhatsApp (para API oficial)
    const signature = req.headers.get('x-hub-signature-256')
    
    if (body.object === 'whatsapp_business_account') {
      // Buscar configuração para validar assinatura
      const { data: config } = await supabase
        .from('whatsapp_config')
        .select('webhook_verify_token')
        .eq('api_type', 'official')
        .limit(1)
        .single()
      
      if (config && !verifySignature(rawBody, signature, config.webhook_verify_token)) {
        console.error('Invalid webhook signature')
        return new Response(
          JSON.stringify({ error: 'Invalid signature' }), 
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }
    
    // Processar mensagens do WhatsApp Business API
    if (body.object === 'whatsapp_business_account') {
      for (const entry of body.entry || []) {
        for (const change of entry.changes || []) {
          if (change.field === 'messages') {
            const value = change.value
            
            // Processar mensagens recebidas
            for (const message of value.messages || []) {
              await processIncomingMessage(supabase, message, value)
            }
            
            // Processar status updates
            for (const status of value.statuses || []) {
              await processStatusUpdate(supabase, status)
            }
          }
        }
      }
    }
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
    
  } catch (error: any) {
    console.error('[whatsapp-webhook] Erro:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function processIncomingMessage(supabase: any, message: any, value: any) {
  console.log('[processIncomingMessage] Processando:', message)
  
  const fromNumber = message.from
  const messageId = message.id
  const timestamp = new Date(parseInt(message.timestamp) * 1000).toISOString()
  
  let content = ''
  let type = 'text'
  let mediaUrl = null
  
  // Extrair conteúdo baseado no tipo
  if (message.type === 'text') {
    content = message.text?.body || ''
  } else if (message.type === 'image') {
    type = 'image'
    mediaUrl = message.image?.id
    content = message.image?.caption || ''
  } else if (message.type === 'document') {
    type = 'document'
    mediaUrl = message.document?.id
    content = message.document?.caption || ''
  }
  
  // Buscar ou criar lead
  let lead = await findOrCreateLead(supabase, fromNumber, value)
  if (!lead) {
    console.error('[processIncomingMessage] Não foi possível encontrar/criar lead')
    return
  }
  
  // Buscar campanha (assumir primeira campanha ativa do cliente)
  const { data: campanha } = await supabase
    .from('campanhas')
    .select('id')
    .eq('cliente_id', lead.cliente_id)
    .eq('status', 'ativa')
    .limit(1)
    .single()
  
  if (!campanha) {
    console.error('[processIncomingMessage] Campanha não encontrada')
    return
  }
  
  // Buscar ou criar conversa
  let { data: conversation } = await supabase
    .from('whatsapp_conversations')
    .select('id')
    .eq('campanha_id', campanha.id)
    .eq('lead_id', lead.id)
    .maybeSingle()
  
  if (!conversation) {
    const { data: newConv } = await supabase
      .from('whatsapp_conversations')
      .insert({
        campanha_id: campanha.id,
        lead_id: lead.id,
        last_message_at: timestamp,
        last_message_content: content,
        last_message_direction: 'inbound',
        total_messages: 1,
        unread_count: 1,
      })
      .select()
      .single()
    
    conversation = newConv
  } else {
    // Atualizar conversa
    await supabase
      .from('whatsapp_conversations')
      .update({
        last_message_at: timestamp,
        last_message_content: content,
        last_message_direction: 'inbound',
        unread_count: supabase.rpc('increment', { row_id: conversation.id, x: 1 }),
      })
      .eq('id', conversation.id)
  }
  
  // Salvar mensagem
  await supabase
    .from('whatsapp_messages')
    .insert({
      campanha_id: campanha.id,
      lead_id: lead.id,
      conversation_id: conversation.id,
      whatsapp_id: messageId,
      content: content,
      type: type,
      media_url: mediaUrl,
      direction: 'inbound',
      status: 'received',
      from_number: fromNumber,
      timestamp: timestamp,
    })
  
  console.log('[processIncomingMessage] Mensagem salva com sucesso')
}

async function processStatusUpdate(supabase: any, status: any) {
  console.log('[processStatusUpdate] Processando:', status)
  
  const messageId = status.id
  const newStatus = status.status // sent, delivered, read, failed
  
  const updateData: any = {
    status: newStatus,
  }
  
  if (newStatus === 'delivered') {
    updateData.delivered_at = new Date().toISOString()
  } else if (newStatus === 'read') {
    updateData.read_at = new Date().toISOString()
  }
  
  await supabase
    .from('whatsapp_messages')
    .update(updateData)
    .eq('whatsapp_id', messageId)
  
  console.log('[processStatusUpdate] Status atualizado:', newStatus)
}

async function findOrCreateLead(supabase: any, phoneNumber: string, value: any) {
  // Limpar número de telefone
  const cleanPhone = phoneNumber.replace(/\D/g, '')
  
  // Buscar lead existente
  let { data: lead } = await supabase
    .from('leads')
    .select('*')
    .eq('telefone', phoneNumber)
    .maybeSingle()
  
  if (!lead) {
    // Buscar nome do contato se disponível
    const contactName = value.contacts?.[0]?.profile?.name || `Lead ${cleanPhone}`
    
    // Buscar primeira cliente ativa
    const { data: cliente } = await supabase
      .from('clientes')
      .select('id')
      .limit(1)
      .single()
    
    if (!cliente) {
      console.error('[findOrCreateLead] Cliente não encontrado')
      return null
    }
    
    // Criar novo lead
    const { data: newLead } = await supabase
      .from('leads')
      .insert({
        nome: contactName,
        telefone: phoneNumber,
        email: `${cleanPhone}@whatsapp.temp`,
        cliente_id: cliente.id,
        origem: 'whatsapp',
        status: 'novo',
      })
      .select()
      .single()
    
    lead = newLead
  }
  
  return lead
}