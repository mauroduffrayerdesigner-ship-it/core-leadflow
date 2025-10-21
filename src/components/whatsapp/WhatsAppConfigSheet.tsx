import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ConfigurarWhatsAppOficial } from "./ConfigurarWhatsAppOficial";
import { ConfigurarWhatsAppVenom } from "./ConfigurarWhatsAppVenom";
import { TemplateWhatsApp } from "./TemplateWhatsApp";
import { HistoricoWhatsApp } from "./HistoricoWhatsApp";

interface WhatsAppConfigSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campanhaId?: string;
  defaultTab?: string;
}

interface WhatsAppConfig {
  id: string;
  api_type: "official" | "unofficial";
  whatsapp_business_account_id?: string;
  phone_number_id?: string;
  access_token_secret?: string;
  webhook_verify_token?: string;
  venom_session_name?: string;
  venom_webhook_url?: string;
  connection_status?: string;
  qr_code?: string;
}

const WhatsAppConfigSheet = ({
  open,
  onOpenChange,
  campanhaId,
  defaultTab = "config"
}: WhatsAppConfigSheetProps) => {
  const [config, setConfig] = useState<WhatsAppConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [apiType, setApiType] = useState<"official" | "unofficial">("official");

  useEffect(() => {
    if (open && campanhaId) {
      fetchConfig();
    }
  }, [open, campanhaId]);

  const fetchConfig = async () => {
    if (!campanhaId) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("whatsapp_config")
        .select("*")
        .eq("campanha_id", campanhaId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setConfig(data as WhatsAppConfig);
        setApiType((data.api_type as "official" | "unofficial") || "official");
      }
    } catch (error: any) {
      console.error("Erro ao carregar config:", error);
      toast.error("Erro ao carregar configurações");
    } finally {
      setLoading(false);
    }
  };

  const handleConfigUpdate = () => {
    fetchConfig();
  };

  if (!campanhaId) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full sm:max-w-[600px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>WhatsApp - Gerenciamento</SheetTitle>
          </SheetHeader>
          <div className="mt-6 text-center text-muted-foreground">
            Selecione uma campanha para gerenciar configurações
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-[600px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>WhatsApp - Gerenciamento</SheetTitle>
        </SheetHeader>

        <Tabs defaultValue={defaultTab} className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="config">Configurações</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
          </TabsList>

          <TabsContent value="config" className="space-y-4">
            {loading ? (
              <div className="text-center text-muted-foreground py-8">
                Carregando configurações...
              </div>
            ) : (
              <>
                {apiType === "official" ? (
                  <ConfigurarWhatsAppOficial
                    campanhaId={campanhaId}
                    config={config}
                    onUpdate={handleConfigUpdate}
                  />
                ) : (
                  <ConfigurarWhatsAppVenom
                    campanhaId={campanhaId}
                    config={config}
                    onUpdate={handleConfigUpdate}
                  />
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="templates">
            <TemplateWhatsApp campanhaId={campanhaId} apiType={apiType} />
          </TabsContent>

          <TabsContent value="history">
            <HistoricoWhatsApp campanhaId={campanhaId} />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};

export default WhatsAppConfigSheet;
