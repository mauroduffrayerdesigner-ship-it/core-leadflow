import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { campanhaId } = await req.json()
    
    if (!campanhaId) {
      throw new Error('campanhaId é obrigatório')
    }
    
    console.log('[whatsapp-test-connection] Testando conexão para campanha:', campanhaId)
    
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
      throw new Error('Configuração WhatsApp não encontrada')
    }
    
    let result
    if (config.api_type === 'official') {
      result = await testOfficialAPI(config)
    } else {
      result = await testVenomAPI(config)
    }
    
    // Atualizar status no banco
    await supabase
      .from('whatsapp_config')
      .update({
        status: result.success ? 'connected' : 'disconnected',
        last_connection: new Date().toISOString(),
      })
      .eq('id', config.id)
    
    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
    
  } catch (error: any) {
    console.error('[whatsapp-test-connection] Erro:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function testOfficialAPI(config: any) {
  try {
    // Testar chamada à API do WhatsApp Business
    const url = `https://graph.facebook.com/v18.0/${config.phone_number_id}`
    
    console.log('[testOfficialAPI] Testando Phone Number ID:', config.phone_number_id)
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${config.access_token_secret}`,
      },
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      console.error('[testOfficialAPI] Erro da API:', errorData)
      return {
        success: false,
        error: errorData.error?.message || 'Erro ao conectar com WhatsApp Business API',
        details: errorData,
      }
    }
    
    const data = await response.json()
    console.log('[testOfficialAPI] Conexão bem-sucedida:', data)
    
    return {
      success: true,
      message: 'Conexão estabelecida com sucesso',
      phoneNumber: data.display_phone_number,
      verified: data.verified_name,
    }
    
  } catch (error: any) {
    console.error('[testOfficialAPI] Exceção:', error)
    return {
      success: false,
      error: error.message,
    }
  }
}

async function testVenomAPI(config: any) {
  try {
    if (!config.venom_webhook_url) {
      return {
        success: false,
        error: 'Webhook URL não configurada',
      }
    }
    
    console.log('[testVenomAPI] Testando webhook:', config.venom_webhook_url)
    
    // Tentar fazer ping no webhook
    const response = await fetch(`${config.venom_webhook_url}/status`, {
      method: 'GET',
    })
    
    if (!response.ok) {
      return {
        success: false,
        error: 'Webhook não está respondendo',
      }
    }
    
    const data = await response.json()
    console.log('[testVenomAPI] Resposta do webhook:', data)
    
    return {
      success: true,
      message: 'Webhook configurado e respondendo',
      session: config.venom_session_name,
    }
    
  } catch (error: any) {
    console.error('[testVenomAPI] Exceção:', error)
    return {
      success: false,
      error: `Não foi possível conectar ao webhook: ${error.message}`,
    }
  }
}
