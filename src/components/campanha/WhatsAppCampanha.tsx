import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConfigurarWhatsAppOficial } from "@/components/whatsapp/ConfigurarWhatsAppOficial";
import { ConfigurarWhatsAppVenom } from "@/components/whatsapp/ConfigurarWhatsAppVenom";
import { ConfigurarChatwoot } from "@/components/whatsapp/ConfigurarChatwoot";
import { TemplateWhatsApp } from "@/components/whatsapp/TemplateWhatsApp";
import { EnviarMensagemWhatsApp } from "@/components/whatsapp/EnviarMensagemWhatsApp";
import { HistoricoWhatsApp } from "@/components/whatsapp/HistoricoWhatsApp";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, MessageCircle } from "lucide-react";

interface WhatsAppCampanhaProps {
  campanhaId: string;
}

export const WhatsAppCampanha = ({ campanhaId }: WhatsAppCampanhaProps) => {
  const [apiType, setApiType] = useState<"official" | "unofficial">("official");

  const handleApiTypeChange = (value: string) => {
    setApiType(value as "official" | "unofficial");
  };
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConfig();
  }, [campanhaId]);

  const fetchConfig = async () => {
    try {
      const { data, error } = await supabase
        .from("whatsapp_config")
        .select("*")
        .eq("campanha_id", campanhaId)
        .single();

      if (error && error.code !== "PGRST116") throw error;

      if (data) {
        setConfig(data);
        if (data.api_type === "official" || data.api_type === "unofficial") {
          setApiType(data.api_type);
        }
      }
    } catch (error) {
      console.error("Erro ao buscar configuração:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageCircle className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">WhatsApp Prospecting</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tipo de API WhatsApp</CardTitle>
          <CardDescription>
            Escolha entre a API oficial do WhatsApp Business ou uma API não oficial
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={apiType} onValueChange={handleApiTypeChange}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="official" id="official" />
              <Label htmlFor="official">API Oficial do WhatsApp Business</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="unofficial" id="unofficial" />
              <Label htmlFor="unofficial">API Não Oficial (Venom/Baileys)</Label>
            </div>
          </RadioGroup>

          {apiType === "unofficial" && (
            <Alert className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                ⚠️ APIs não oficiais podem ter limitações e riscos de bloqueio da conta WhatsApp.
                Use por sua conta e risco.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="config" className="space-y-4">
        <TabsList>
          <TabsTrigger value="config">Configuração</TabsTrigger>
          <TabsTrigger value="chatwoot">Chatwoot</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="enviar">Enviar Mensagens</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="config">
          {apiType === "official" ? (
            <ConfigurarWhatsAppOficial campanhaId={campanhaId} config={config} onUpdate={fetchConfig} />
          ) : (
            <ConfigurarWhatsAppVenom campanhaId={campanhaId} config={config} onUpdate={fetchConfig} />
          )}
        </TabsContent>

        <TabsContent value="chatwoot">
          <ConfigurarChatwoot campanhaId={campanhaId} config={config} onUpdate={fetchConfig} />
        </TabsContent>

        <TabsContent value="templates">
          <TemplateWhatsApp campanhaId={campanhaId} apiType={apiType} />
        </TabsContent>

        <TabsContent value="enviar">
          <EnviarMensagemWhatsApp campanhaId={campanhaId} />
        </TabsContent>

        <TabsContent value="historico">
          <HistoricoWhatsApp campanhaId={campanhaId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
