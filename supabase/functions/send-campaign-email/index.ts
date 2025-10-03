import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { campanhaId, leadId, templateId } = await req.json();
    
    console.log('Enviando email:', { campanhaId, leadId, templateId });

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Buscar dados da campanha
    const { data: campanha, error: campanhaError } = await supabaseClient
      .from('campanhas')
      .select('*')
      .eq('id', campanhaId)
      .single();

    if (campanhaError || !campanha) {
      throw new Error('Campanha não encontrada');
    }

    // Buscar dados do lead
    const { data: lead, error: leadError } = await supabaseClient
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .single();

    if (leadError || !lead) {
      throw new Error('Lead não encontrado');
    }

    // Buscar template
    const { data: template, error: templateError } = await supabaseClient
      .from('email_templates')
      .select('*')
      .eq('id', templateId)
      .single();

    if (templateError || !template) {
      throw new Error('Template não encontrado');
    }

    // Substituir variáveis no template
    let assunto = template.assunto || 'Sem assunto';
    let corpo = template.corpo || '';
    
    const variaveis: Record<string, string> = {
      '{{nome}}': lead.nome || 'Cliente',
      '{{email}}': lead.email || '',
      '{{telefone}}': lead.telefone || 'Não informado',
      '{{interesse}}': lead.interesse || 'Não informado',
      '{{campanha}}': campanha.nome || 'Campanha',
    };

    Object.entries(variaveis).forEach(([chave, valor]) => {
      const regex = new RegExp(chave.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      assunto = assunto.replace(regex, valor);
      corpo = corpo.replace(regex, valor);
    });

    console.log('Enviando para Brevo:', lead.email);

    // Enviar via Brevo
    const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': Deno.env.get('BREVO_API_KEY') ?? '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: campanha.email_nome_remetente || 'CORE Capture',
          email: campanha.email_remetente || 'noreply@corecapture.com',
        },
        to: [
          {
            email: lead.email,
            name: lead.nome,
          },
        ],
        subject: assunto,
        htmlContent: corpo,
      }),
    });

    const result = await brevoResponse.json();
    console.log('Resposta Brevo:', result);

    // Registrar log
    const { error: logError } = await supabaseClient.from('email_logs').insert({
      campanha_id: campanhaId,
      lead_id: leadId,
      template_id: templateId,
      destinatario_email: lead.email,
      destinatario_nome: lead.nome,
      assunto: assunto,
      status: brevoResponse.ok ? 'enviado' : 'falha',
      provider_message_id: result.messageId || null,
      erro: brevoResponse.ok ? null : JSON.stringify(result),
    });

    if (logError) {
      console.error('Erro ao registrar log:', logError);
    }

    return new Response(
      JSON.stringify({ 
        success: brevoResponse.ok,
        messageId: result.messageId,
        message: brevoResponse.ok ? 'Email enviado com sucesso' : 'Falha ao enviar email',
        error: brevoResponse.ok ? null : result
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: brevoResponse.ok ? 200 : 500,
      }
    );
  } catch (error: any) {
    console.error('Erro ao enviar email:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
