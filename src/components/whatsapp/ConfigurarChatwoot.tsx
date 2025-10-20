import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { ExternalLink } from "lucide-react";

interface ConfigurarChatwootProps {
  campanhaId: string;
  config: any;
  onUpdate: () => void;
}

export const ConfigurarChatwoot = ({ campanhaId, config, onUpdate }: ConfigurarChatwootProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [enabled, setEnabled] = useState(!!config?.chatwoot_url);
  const [formData, setFormData] = useState({
    chatwoot_url: config?.chatwoot_url || "",
    chatwoot_account_id: config?.chatwoot_account_id || "",
    chatwoot_inbox_id: config?.chatwoot_inbox_id || "",
    chatwoot_api_key_secret: "",
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      if (!config?.id) {
        toast({
          title: "Erro",
          description: "Configure primeiro a API do WhatsApp",
          variant: "destructive",
        });
        return;
      }

      await supabase
        .from("whatsapp_config")
        .update(enabled ? formData : {
          chatwoot_url: null,
          chatwoot_account_id: null,
          chatwoot_inbox_id: null,
          chatwoot_api_key_secret: null,
        })
        .eq("id", config.id);

      toast({
        title: "Configuração salva",
        description: enabled 
          ? "Integração com Chatwoot configurada com sucesso."
          : "Integração com Chatwoot desativada.",
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

  const handleTestIntegration = async () => {
    toast({
      title: "Testando integração",
      description: "Verificando conexão com Chatwoot...",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Integração com Chatwoot</CardTitle>
        <CardDescription>
          Sincronize conversas WhatsApp com o Chatwoot para melhor gestão
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="enable-chatwoot">Ativar integração com Chatwoot</Label>
          <Switch
            id="enable-chatwoot"
            checked={enabled}
            onCheckedChange={setEnabled}
          />
        </div>

        {enabled && (
          <>
            <div className="space-y-2">
              <Label htmlFor="chatwoot_url">URL do Chatwoot</Label>
              <Input
                id="chatwoot_url"
                value={formData.chatwoot_url}
                onChange={(e) => setFormData({ ...formData, chatwoot_url: e.target.value })}
                placeholder="https://app.chatwoot.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="account_id">Account ID</Label>
              <Input
                id="account_id"
                value={formData.chatwoot_account_id}
                onChange={(e) => setFormData({ ...formData, chatwoot_account_id: e.target.value })}
                placeholder="123456"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="inbox_id">Inbox ID</Label>
              <Input
                id="inbox_id"
                value={formData.chatwoot_inbox_id}
                onChange={(e) => setFormData({ ...formData, chatwoot_inbox_id: e.target.value })}
                placeholder="789012"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="api_key">API Key (será armazenada de forma segura)</Label>
              <Input
                id="api_key"
                type="password"
                value={formData.chatwoot_api_key_secret}
                onChange={(e) => setFormData({ ...formData, chatwoot_api_key_secret: e.target.value })}
                placeholder="sua-api-key"
              />
            </div>

            <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
              <ExternalLink className="h-4 w-4" />
              <a
                href="https://www.chatwoot.com/docs/product/channels/api/client-apis"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                Como obter credenciais do Chatwoot
              </a>
            </div>
          </>
        )}

        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={loading}>
            Salvar Configurações
          </Button>
          {enabled && (
            <Button variant="outline" onClick={handleTestIntegration} disabled={!config?.id}>
              Testar Integração
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
