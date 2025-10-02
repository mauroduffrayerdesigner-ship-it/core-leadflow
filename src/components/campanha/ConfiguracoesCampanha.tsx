import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Webhook, Globe, CheckCircle2, AlertCircle } from "lucide-react";

interface ConfiguracoesCampanhaProps {
  campanhaId: string;
}

const ConfiguracoesCampanha = ({ campanhaId }: ConfiguracoesCampanhaProps) => {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [dominioPersonalizado, setDominioPersonalizado] = useState("");
  const [loading, setLoading] = useState(false);
  const [testando, setTestando] = useState(false);
  const [webhookAtivo, setWebhookAtivo] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchConfiguracoes();
  }, [campanhaId]);

  const fetchConfiguracoes = async () => {
    try {
      const { data, error } = await supabase
        .from("campanhas")
        .select("webhook_url, dominio_personalizado")
        .eq("id", campanhaId)
        .single();

      if (error) throw error;

      setWebhookUrl(data.webhook_url || "");
      setDominioPersonalizado(data.dominio_personalizado || "");
      setWebhookAtivo(!!data.webhook_url);
    } catch (error: any) {
      console.error("Erro ao carregar configurações:", error);
    }
  };

  const handleSalvar = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("campanhas")
        .update({
          webhook_url: webhookUrl || null,
          dominio_personalizado: dominioPersonalizado || null,
        })
        .eq("id", campanhaId);

      if (error) throw error;

      setWebhookAtivo(!!webhookUrl);

      toast({
        title: "Configurações salvas",
        description: "As configurações da campanha foram atualizadas com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTestarWebhook = async () => {
    if (!webhookUrl) {
      toast({
        title: "URL necessária",
        description: "Configure uma URL de webhook antes de testar.",
        variant: "destructive",
      });
      return;
    }

    setTestando(true);
    try {
      const payloadTeste = {
        evento: "teste_webhook",
        campanha: {
          id: campanhaId,
          nome: "Campanha de Teste",
        },
        lead: {
          nome: "Lead de Teste",
          email: "teste@exemplo.com",
          telefone: "+5511999999999",
          interesse: "Teste de integração",
          origem: "teste",
        },
        timestamp: new Date().toISOString(),
      };

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payloadTeste),
      });

      if (response.ok) {
        toast({
          title: "Webhook testado com sucesso",
          description: `Status: ${response.status} - Conexão estabelecida!`,
        });
      } else {
        toast({
          title: "Erro no teste",
          description: `Status: ${response.status} - Verifique a configuração do webhook.`,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Falha na conexão",
        description: "Não foi possível conectar ao webhook. Verifique a URL.",
        variant: "destructive",
      });
    } finally {
      setTestando(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Webhook className="h-5 w-5" />
                Webhook de Integração
              </CardTitle>
              <CardDescription>
                Configure webhook para integrar com IA e automações (n8n, Make, Zapier, etc.)
              </CardDescription>
            </div>
            {webhookAtivo ? (
              <Badge variant="default" className="gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Ativo
              </Badge>
            ) : (
              <Badge variant="secondary" className="gap-1">
                <AlertCircle className="h-3 w-3" />
                Inativo
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="webhook-url">URL do Webhook</Label>
            <Input
              id="webhook-url"
              type="url"
              placeholder="https://seu-webhook.com/endpoint"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Será chamado automaticamente quando um novo lead for capturado
            </p>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSalvar} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar Webhook
            </Button>
            <Button 
              variant="outline" 
              onClick={handleTestarWebhook}
              disabled={testando || !webhookUrl}
            >
              {testando && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Testar Conexão
            </Button>
          </div>

          <Alert>
            <AlertDescription>
              <strong>Payload enviado:</strong>
              <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-x-auto">
{`{
  "evento": "novo_lead",
  "campanha": {
    "id": "uuid",
    "nome": "Nome da Campanha"
  },
  "lead": {
    "nome": "Nome",
    "email": "email@exemplo.com",
    "telefone": "+55...",
    "interesse": "texto",
    "origem": "formulario"
  }
}`}
              </pre>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Domínio Personalizado
          </CardTitle>
          <CardDescription>
            Configure um domínio próprio para sua landing page
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dominio">Domínio Personalizado</Label>
            <Input
              id="dominio"
              type="text"
              placeholder="campanha.seudominio.com"
              value={dominioPersonalizado}
              onChange={(e) => setDominioPersonalizado(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Configure os registros DNS apontando para o servidor da plataforma
            </p>
          </div>

          <Button onClick={handleSalvar} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Salvar Domínio
          </Button>

          <Alert>
            <AlertDescription className="text-sm">
              <strong>Instruções DNS:</strong>
              <ul className="mt-2 space-y-1 list-disc list-inside">
                <li>Tipo: CNAME</li>
                <li>Nome: seu subdomínio</li>
                <li>Valor: platform.leadflow.com</li>
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfiguracoesCampanha;
