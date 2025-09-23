import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Building, 
  Globe, 
  BarChart3, 
  Settings, 
  ExternalLink,
  Copy,
  Palette 
} from "lucide-react";
import Layout from "@/components/Layout";
import TemasLanding from "@/components/landing/TemasLanding";
import MetricasAvancadas from "@/components/dashboard/MetricasAvancadas";
import ConfigurarWebhook from "@/components/webhooks/ConfigurarWebhook";
import ImportarCSV from "@/components/leads/ImportarCSV";

interface Cliente {
  id: string;
  nome: string;
  email: string;
  logo_url?: string;
  webhook_url?: string;
  dominio_personalizado?: string;
  tema_id: number;
  criado_em: string;
  temas_landing?: { nome: string } | null;
}

const ClienteDetalhes = () => {
  const { clienteId } = useParams<{ clienteId: string }>();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (clienteId) {
      fetchCliente();
    }
  }, [clienteId]);

  const fetchCliente = async () => {
    try {
      const { data, error } = await supabase
        .from("clientes")
        .select("*, temas_landing(nome)")
        .eq("id", clienteId)
        .single();

      if (error) throw error;
      setCliente(data as Cliente);
    } catch (error: any) {
      console.error("Erro ao buscar cliente:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados do cliente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTemaSelect = (temaId: number) => {
    if (cliente) {
      setCliente({ ...cliente, tema_id: temaId });
    }
  };

  const copyLandingURL = () => {
    const url = `${window.location.origin}/lp/${clienteId}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "URL copiada!",
      description: "A URL da landing page foi copiada para a área de transferência.",
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="grid gap-6 md:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-8 bg-muted rounded w-1/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!cliente) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <h1 className="text-2xl font-bold mb-4">Cliente não encontrado</h1>
              <p className="text-muted-foreground">
                O cliente solicitado não existe ou você não tem permissão para visualizá-lo.
              </p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const landingURL = `${window.location.origin}/lp/${clienteId}`;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header do Cliente */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  {cliente.logo_url ? (
                    <img 
                      src={cliente.logo_url} 
                      alt={`Logo ${cliente.nome}`}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Building className="h-8 w-8 text-primary" />
                    </div>
                  )}
                  <div>
                    <CardTitle className="text-2xl">{cliente.nome}</CardTitle>
                    <CardDescription className="text-lg">{cliente.email}</CardDescription>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="secondary">
                        Tema: {cliente.temas_landing?.nome || `Tema ${cliente.tema_id}`}
                      </Badge>
                      {cliente.webhook_url && (
                        <Badge variant="outline">Webhook Ativo</Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Button onClick={copyLandingURL} className="gap-2">
                    <Copy className="h-4 w-4" />
                    Copiar URL da Landing
                  </Button>
                  <div className="text-sm text-muted-foreground">
                    <a 
                      href={landingURL} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:underline"
                    >
                      <Globe className="h-3 w-3" />
                      Ver Landing Page
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Tabs de Funcionalidades */}
          <Tabs defaultValue="metricas" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="metricas" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Métricas
              </TabsTrigger>
              <TabsTrigger value="temas" className="gap-2">
                <Palette className="h-4 w-4" />
                Temas
              </TabsTrigger>
              <TabsTrigger value="importar" className="gap-2">
                <Building className="h-4 w-4" />
                Importar CSV
              </TabsTrigger>
              <TabsTrigger value="webhook" className="gap-2">
                <Settings className="h-4 w-4" />
                Webhook N8N
              </TabsTrigger>
              <TabsTrigger value="dominio" className="gap-2">
                <Globe className="h-4 w-4" />
                Domínio
              </TabsTrigger>
            </TabsList>

            <TabsContent value="metricas">
              <MetricasAvancadas clienteId={clienteId} />
            </TabsContent>

            <TabsContent value="temas">
              <TemasLanding 
                clienteId={clienteId!}
                temaSelecionado={cliente.tema_id}
                onTemaSelect={handleTemaSelect}
              />
            </TabsContent>

            <TabsContent value="importar">
              <ImportarCSV 
                clienteId={clienteId!}
                onImportComplete={() => {
                  toast({
                    title: "Importação concluída!",
                    description: "Os leads foram importados com sucesso.",
                  });
                }}
              />
            </TabsContent>

            <TabsContent value="webhook">
              <ConfigurarWebhook clienteId={clienteId!} />
            </TabsContent>

            <TabsContent value="dominio">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Domínio Personalizado
                  </CardTitle>
                  <CardDescription>
                    Configure um domínio personalizado para sua landing page
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <h3 className="font-medium mb-2">URL Atual</h3>
                    <code className="text-sm">{landingURL}</code>
                  </div>
                  
                  {cliente.dominio_personalizado && (
                    <div className="p-4 bg-secondary/10 rounded-lg">
                      <h3 className="font-medium mb-2">Domínio Personalizado</h3>
                      <code className="text-sm">{cliente.dominio_personalizado}</code>
                      <p className="text-sm text-muted-foreground mt-2">
                        Configure um CNAME em seu DNS apontando para: preview--core-leadflow.lovable.app
                      </p>
                    </div>
                  )}
                  
                  <div className="text-sm text-muted-foreground">
                    <p><strong>Como configurar:</strong></p>
                    <ol className="list-decimal list-inside space-y-1 mt-2">
                      <li>Acesse o painel DNS do seu domínio</li>
                      <li>Crie um registro CNAME</li>
                      <li>Nome: seu-subdominio (ex: lp)</li>
                      <li>Valor: preview--core-leadflow.lovable.app</li>
                      <li>Aguarde a propagação DNS (até 24h)</li>
                    </ol>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default ClienteDetalhes;