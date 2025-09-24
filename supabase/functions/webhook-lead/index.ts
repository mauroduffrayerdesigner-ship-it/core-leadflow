import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    if (req.method === 'POST') {
      const { cliente_id, nome, email, telefone, interesse, origem = 'formulario' } = await req.json();

      console.log('Criando lead:', { cliente_id, nome, email, origem });

      // 1. Inserir lead no banco
      const { data: leadData, error: leadError } = await supabase
        .from('leads')
        .insert({
          cliente_id,
          nome,
          email,
          telefone,
          interesse,
          origem
        })
        .select()
        .single();

      if (leadError) {
        console.error('Erro ao inserir lead:', leadError);
        throw leadError;
      }

      console.log('Lead criado:', leadData);

      // 2. Buscar webhook_url do cliente
      const { data: clienteData, error: clienteError } = await supabase
        .from('clientes')
        .select('webhook_url, nome')
        .eq('id', cliente_id)
        .single();

      if (clienteError) {
        console.error('Erro ao buscar cliente:', clienteError);
        throw clienteError;
      }

      // 3. Enviar webhook se configurado
      if (clienteData?.webhook_url) {
        console.log('Enviando webhook para:', clienteData.webhook_url);
        
        try {
          const webhookPayload = {
            lead: leadData,
            cliente: {
              id: cliente_id,
              nome: clienteData.nome
            },
            timestamp: new Date().toISOString()
          };

          const webhookResponse = await fetch(clienteData.webhook_url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(webhookPayload),
          });

          console.log('Webhook response status:', webhookResponse.status);
          
          if (!webhookResponse.ok) {
            console.warn('Webhook failed with status:', webhookResponse.status);
          }
        } catch (webhookError) {
          console.error('Erro ao enviar webhook:', webhookError);
          // Não falha a operação se o webhook der erro
        }
      }

      return new Response(JSON.stringify({ 
        success: true, 
        lead: leadData,
        webhook_sent: !!clienteData?.webhook_url
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 201,
      });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in webhook-lead function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(JSON.stringify({ 
      error: errorMessage 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});