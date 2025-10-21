import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import LandingPageRenderer from "@/components/landing/LandingPageRenderer";
import { Card, CardContent } from "@/components/ui/card";

interface Cliente {
  id: string;
  nome: string;
  logo_url?: string;
  tema_id: number;
  headline?: string;
  subtitulo?: string;
  texto_cta?: string;
  status?: string;
}

const LandingPage = () => {
  const { campanhaId } = useParams<{ campanhaId: string }>();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (campanhaId) {
      fetchCliente();
    }
  }, [campanhaId]);

  const fetchCliente = async () => {
    try {
      console.log("Buscando campanha com ID:", campanhaId);
      const { data, error } = await supabase
        .from("landing_page_campanha_public")
        .select("id, nome, logo_url, tema_id, headline, subtitulo, texto_cta, status")
        .eq("id", campanhaId)
        .single();

      console.log("Resultado da consulta:", { data, error });
      if (error) throw error;
      
      if (!data) {
        setError("Landing page não encontrada");
        return;
      }

      setCliente(data as Cliente);
    } catch (error: any) {
      console.error("Erro ao buscar cliente:", error);
      setError("Erro ao carregar a landing page");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Carregando landing page...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !cliente) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Ops!</h1>
            <p className="text-muted-foreground mb-4">
              {error || "Landing page não encontrada"}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <LandingPageRenderer cliente={cliente} />;
};

export default LandingPage;