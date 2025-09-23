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
      const { lead_id, status, notas } = await req.json();

      console.log('Atualizando status do lead:', { lead_id, status, notas });

      // Validar status
      const validStatuses = ['novo', 'qualificado', 'convertido', 'descartado'];
      if (!validStatuses.includes(status)) {
        return new Response(JSON.stringify({ 
          error: 'Status inválido. Use: novo, qualificado, convertido, descartado' 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Atualizar lead
      const { data: leadData, error: leadError } = await supabase
        .from('leads')
        .update({
          status,
          notas: notas || null,
          data_atualizacao: new Date().toISOString()
        })
        .eq('id', lead_id)
        .select()
        .single();

      if (leadError) {
        console.error('Erro ao atualizar lead:', leadError);
        throw leadError;
      }

      console.log('Lead atualizado:', leadData);

      return new Response(JSON.stringify({ 
        success: true, 
        lead: leadData
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in update-lead-status function:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});