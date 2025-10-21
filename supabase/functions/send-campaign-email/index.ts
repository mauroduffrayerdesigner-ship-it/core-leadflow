import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation schema
const SendEmailSchema = z.object({
  campanhaId: z.string().uuid('ID de campanha inválido'),
  leadId: z.string().uuid('ID de lead inválido'),
  templateId: z.string().uuid('ID de template inválido')
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    
    // Validação com Zod
    const validated = SendEmailSchema.parse(body);
    const { campanhaId, leadId, templateId } = validated;

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const brevoApiKey = Deno.env.get('BREVO_API_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Buscar dados do lead
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .single();

    if (leadError) throw leadError;

    // Buscar template
    const { data: template, error: templateError } = await supabase
      .from('email_templates')
      .select('*')
      .eq('id', templateId)
      .single();

    if (templateError) throw templateError;

    // Buscar campanha
    const { data: campanha, error: campanhaError } = await supabase
      .from('campanhas')
      .select('*')
      .eq('id', campanhaId)
      .single();

    if (campanhaError) throw campanhaError;

    // Substituir variáveis no template
    let emailBody = template.corpo;
    let emailSubject = template.assunto;
    
    const variables: Record<string, string> = {
      '{{nome}}': lead.nome || '',
      '{{email}}': lead.email || '',
      '{{telefone}}': lead.telefone || '',
      '{{interesse}}': lead.interesse || '',
    };

    Object.entries(variables).forEach(([key, value]) => {
      emailBody = emailBody.replace(new RegExp(key, 'g'), value);
      emailSubject = emailSubject.replace(new RegExp(key, 'g'), value);
    });

    // Enviar email via Brevo
    const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': brevoApiKey,
      },
      body: JSON.stringify({
        sender: {
          name: campanha.email_nome_remetente || 'CORE Capture',
          email: campanha.email_remetente || 'contato@corecapture.com',
        },
        to: [{ email: lead.email, name: lead.nome }],
        subject: emailSubject,
        htmlContent: emailBody,
      }),
    });

    if (!brevoResponse.ok) {
      const errorData = await brevoResponse.text();
      throw new Error(`Brevo API error: ${errorData}`);
    }

    const brevoData = await brevoResponse.json();

    // Salvar log
    await supabase.from('email_logs').insert({
      campanha_id: campanhaId,
      lead_id: leadId,
      template_id: templateId,
      destinatario_email: lead.email,
      destinatario_nome: lead.nome,
      assunto: emailSubject,
      status: 'enviado',
      provider_message_id: brevoData.messageId,
    });

    return new Response(
      JSON.stringify({ success: true, messageId: brevoData.messageId }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ 
          error: 'Dados inválidos', 
          details: error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});