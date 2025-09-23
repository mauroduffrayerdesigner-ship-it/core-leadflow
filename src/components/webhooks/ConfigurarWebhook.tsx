import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Settings, Send, TestTube, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ConfigurarWebhookProps {
  clienteId: string;
}

const ConfigurarWebhook = ({ clienteId }: ConfigurarWebhookProps) => {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [webhookAtivo, setWebhookAtivo] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchWebhookConfig();
  }, [clienteId]);

  const fetchWebhookConfig = async () => {
    try {
      const { data, error } = await supabase
        .from("clientes")
        .select("webhook_url")
        .eq("id", clienteId)
        .single();

      if (error) throw error;

      if (data?.webhook_url) {
        setWebhookUrl(data.webhook_url);
        setWebhookAtivo(true);
      }
    } catch (error: any) {
      console.error("Erro ao buscar configuração do webhook:", error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("clientes")
        .update({ webhook_url: webhookUrl || null })
        .eq("id", clienteId);

      if (error) throw error;

      setWebhookAtivo(!!webhookUrl);
      toast({
        title: "Sucesso!",
        description: webhookUrl 
          ? "Webhook configurado com sucesso!" 
          : "Webhook removido com sucesso!",
      });
    } catch (error: any) {
      console.error("Erro ao salvar webhook:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a configuração do webhook.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTest = async () => {
    if (!webhookUrl) {
      toast({
        title: "Erro",
        description: "Configure uma URL antes de testar.",
        variant: "destructive",
      });
      return;
    }

    setTestLoading(true);
    try {
      const payload = {
        cliente_id: clienteId,
        lead_id: "test-lead-id",
        nome: "Lead de Teste",
        email: "teste@exemplo.com",
        telefone: "+55 11 99999-9999",
        interesse: "Teste de integração webhook",
        origem: "teste",
        data_criacao: new Date().toISOString(),
        test: true,
      };

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast({
          title: "Teste realizado!",
          description: `Webhook testado com sucesso. Status: ${response.status}`,
        });
      } else {
        toast({
          title: "Erro no teste",
          description: `O webhook retornou status ${response.status}. Verifique a URL e tente novamente.`,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Erro ao testar webhook:", error);
      toast({
        title: "Erro no teste",
        description: "Não foi possível conectar com o webhook. Verifique a URL.",
        variant: "destructive",
      });
    } finally {
      setTestLoading(false);
    }
  };

  const exemploPayload = `{
  "cliente_id": "${clienteId}",
  "lead_id": "uuid-do-lead",
  "nome": "João Silva",
  "email": "joao@exemplo.com",
  "telefone": "+55 11 99999-9999",
  "interesse": "Informações sobre o produto",
  "origem": "formulario", // ou "manual", "csv", "n8n"
  "data_criacao": "2024-01-15T10:30:00Z"
}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Configurar Webhook
          {webhookAtivo && <Badge variant="secondary">Ativo</Badge>}
        </CardTitle>
        <CardDescription>
          Configure um webhook para receber notificações automáticas quando novos leads forem capturados
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="webhook-url">URL do Webhook</Label>
          <Input
            id="webhook-url"
            type="url"
            placeholder="https://seu-servidor.com/webhook/leads"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            className="mt-2"
          />
          <p className="text-sm text-muted-foreground mt-1">
            Insira a URL que receberá os dados dos novos leads via POST
          </p>
        </div>

        <div className="flex gap-3">
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Salvando..." : "Salvar Configuração"}
          </Button>
          
          {webhookUrl && (
            <Button 
              variant="outline" 
              onClick={handleTest} 
              disabled={testLoading}
              className="gap-2"
            >
              <TestTube className="h-4 w-4" />
              {testLoading ? "Testando..." : "Testar Webhook"}
            </Button>
          )}
        </div>

        <Alert>
          <Send className="h-4 w-4" />
          <AlertDescription>
            O webhook será disparado automaticamente sempre que um novo lead for capturado 
            pelo formulário da landing page, adicionado manualmente ou importado via CSV.
          </AlertDescription>
        </Alert>

        <div>
          <h3 className="font-medium mb-2">Exemplo de Payload JSON</h3>
          <Textarea
            value={exemploPayload}
            readOnly
            className="font-mono text-sm"
            rows={12}
          />
          <p className="text-sm text-muted-foreground mt-2">
            Este é o formato JSON que será enviado para sua URL de webhook
          </p>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Integração com N8N:</strong> Para conectar com N8N, crie um workflow 
            com trigger "Webhook" e use a URL gerada. O N8N receberá automaticamente 
            os dados dos leads capturados.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default ConfigurarWebhook;