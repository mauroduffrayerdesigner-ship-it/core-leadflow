import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, QrCode } from "lucide-react";

interface ConfigurarWhatsAppVenomProps {
  campanhaId: string;
  config: any;
  onUpdate: () => void;
}

export const ConfigurarWhatsAppVenom = ({ campanhaId, config, onUpdate }: ConfigurarWhatsAppVenomProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    venom_session_name: config?.venom_session_name || "",
    venom_webhook_url: config?.venom_webhook_url || "",
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
        api_type: "unofficial" as const,
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
        description: "Configurações do Venom foram salvas com sucesso.",
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

  const handleGenerateQR = async () => {
    toast({
      title: "Gerando QR Code",
      description: "Aguarde enquanto geramos o QR Code para autenticação...",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>API Não Oficial (Venom)</CardTitle>
            <CardDescription>
              Configure a integração com Venom ou Baileys para WhatsApp
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
          <Label htmlFor="session_name">Nome da Sessão</Label>
          <Input
            id="session_name"
            value={formData.venom_session_name}
            onChange={(e) => setFormData({ ...formData, venom_session_name: e.target.value })}
            placeholder="minha-sessao-whatsapp"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="webhook_url">Webhook URL (para receber mensagens)</Label>
          <Input
            id="webhook_url"
            value={formData.venom_webhook_url}
            onChange={(e) => setFormData({ ...formData, venom_webhook_url: e.target.value })}
            placeholder="https://seu-servidor.com/webhook"
          />
        </div>

        {config?.qr_code && (
          <div className="p-4 bg-muted rounded-lg flex flex-col items-center gap-4">
            <QrCode className="h-6 w-6" />
            <img src={config.qr_code} alt="QR Code" className="w-64 h-64" />
            <p className="text-sm text-muted-foreground">
              Escaneie este QR Code no WhatsApp para autenticar
            </p>
          </div>
        )}

        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={loading}>
            Salvar Configurações
          </Button>
          <Button variant="outline" onClick={handleGenerateQR} disabled={!config?.id}>
            Gerar QR Code
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
