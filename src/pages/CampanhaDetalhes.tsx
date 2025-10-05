import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import { Loader2, ChevronLeft } from "lucide-react";
import EditarLandingPageCampanha from "@/components/campanha/EditarLandingPageCampanha";
import ConfiguracoesCampanha from "@/components/campanha/ConfiguracoesCampanha";
import LeadsCampanha from "@/components/campanha/LeadsCampanha";
import MetricasCampanha from "@/components/campanha/MetricasCampanha";
import EmailsCampanha from "@/components/campanha/EmailsCampanha";

interface Campanha {
  id: string;
  cliente_id: string;
  nome: string;
  descricao?: string;
  status: string;
  tema_id: number;
  headline?: string;
  subtitulo?: string;
  texto_cta?: string;
  logo_url?: string;
  webhook_url?: string;
  dominio_personalizado?: string;
}

const CampanhaDetalhes = () => {
  const { campanhaId } = useParams();
  const navigate = useNavigate();
  const [campanha, setCampanha] = useState<Campanha | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (campanhaId) {
      fetchCampanha();
    }
  }, [campanhaId]);

  const fetchCampanha = async () => {
    try {
      const { data, error } = await supabase
        .from("campanhas")
        .select("*")
        .eq("id", campanhaId)
        .single();

      if (error) throw error;
      setCampanha(data);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados da campanha.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!campanha) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">Campanha não encontrada.</p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/campanhas">Campanhas</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{campanha.nome}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Botão Voltar */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/campanhas')}
          className="mb-4"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Voltar para Campanhas
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{campanha.nome}</h1>
          {campanha.descricao && (
            <p className="text-muted-foreground">{campanha.descricao}</p>
          )}
        </div>

        <Tabs defaultValue="landing" className="space-y-6">
          <TabsList>
            <TabsTrigger value="landing">Landing Page</TabsTrigger>
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="metricas">Métricas</TabsTrigger>
            <TabsTrigger value="emails">Emails</TabsTrigger>
            <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="landing">
            <EditarLandingPageCampanha campanhaId={campanhaId!} />
          </TabsContent>

          <TabsContent value="leads">
            <LeadsCampanha campanhaId={campanhaId!} />
          </TabsContent>

          <TabsContent value="metricas">
            <MetricasCampanha campanhaId={campanhaId!} />
          </TabsContent>

          <TabsContent value="emails">
            <EmailsCampanha campanhaId={campanhaId!} />
          </TabsContent>

          <TabsContent value="configuracoes">
            <ConfiguracoesCampanha campanhaId={campanhaId!} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default CampanhaDetalhes;