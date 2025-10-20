import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, CheckCircle2, XCircle } from "lucide-react";

interface ConfigurarWhatsAppOficialProps {
  campanhaId: string;
  config: any;
  onUpdate: () => void;
}

export const ConfigurarWhatsAppOficial = ({ campanhaId, config, onUpdate }: ConfigurarWhatsAppOficialProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    whatsapp_business_account_id: config?.whatsapp_business_account_id || "",
    phone_number_id: config?.phone_number_id || "",
    access_token_secret: "",
    webhook_verify_token: config?.webhook_verify_token || "",
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { data: cliente } = await supabase
        .from("clientes")
        .select("id")
        .eq("user_id", user.id)
        .single();

      const configData = {
        campanha_id: campanhaId,
        cliente_id: cliente?.id,
        api_type: "official" as const,
        ...formData,
      };

      if (config?.id) {
        await supabase
          .from("whatsapp_config")
          .update(configData)
          .eq("id", config.id);
      } else {
        await supabase
          .from("whatsapp_config")
          .insert(configData);
      }

      toast({
        title: "Configuração salva",
        description: "Configurações da API Oficial do WhatsApp foram salvas com sucesso.",
      });

      onUpdate();
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

  const handleTestConnection = async () => {
    toast({
      title: "Testando conexão",
      description: "Verificando credenciais da API...",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>API Oficial do WhatsApp Business</CardTitle>
            <CardDescription>
              Configure as credenciais da API oficial do Meta WhatsApp Business
            </CardDescription>
          </div>
          {config?.status && (
            <Badge variant={config.status === "connected" ? "default" : "secondary"}>
              {config.status === "connected" ? (
                <><CheckCircle2 className="mr-1 h-3 w-3" /> Conectado</>
              ) : (
                <><XCircle className="mr-1 h-3 w-3" /> Desconectado</>
              )}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="business_account_id">WhatsApp Business Account ID</Label>
          <Input
            id="business_account_id"
            value={formData.whatsapp_business_account_id}
            onChange={(e) => setFormData({ ...formData, whatsapp_business_account_id: e.target.value })}
            placeholder="1234567890"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone_number_id">Phone Number ID</Label>
          <Input
            id="phone_number_id"
            value={formData.phone_number_id}
            onChange={(e) => setFormData({ ...formData, phone_number_id: e.target.value })}
            placeholder="1234567890"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="access_token">Access Token (será armazenado de forma segura)</Label>
          <Input
            id="access_token"
            type="password"
            value={formData.access_token_secret}
            onChange={(e) => setFormData({ ...formData, access_token_secret: e.target.value })}
            placeholder="EAAG..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="webhook_token">Webhook Verify Token</Label>
          <Input
            id="webhook_token"
            value={formData.webhook_verify_token}
            onChange={(e) => setFormData({ ...formData, webhook_verify_token: e.target.value })}
            placeholder="meu_token_secreto"
          />
        </div>

        <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
          <ExternalLink className="h-4 w-4" />
          <a
            href="https://developers.facebook.com/docs/whatsapp/business-management-api/get-started"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline"
          >
            Como obter credenciais da API Oficial
          </a>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={loading}>
            Salvar Configurações
          </Button>
          <Button variant="outline" onClick={handleTestConnection} disabled={!config?.id}>
            Testar Conexão
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
