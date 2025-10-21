import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Send, Loader2 } from "lucide-react";
import { sendBulkMessageSchema } from "@/lib/validations/whatsapp";

interface EnviarMensagemWhatsAppProps {
  campanhaId: string;
}

export const EnviarMensagemWhatsApp = ({ campanhaId }: EnviarMensagemWhatsAppProps) => {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    fetchTemplates();
    fetchLeads();
  }, [campanhaId]);

  useEffect(() => {
    if (selectedTemplate && selectedLeads.length > 0) {
      generatePreview();
    }
  }, [selectedTemplate, selectedLeads]);

  const fetchTemplates = async () => {
    const { data } = await supabase
      .from("whatsapp_templates")
      .select("*")
      .eq("campanha_id", campanhaId)
      .eq("ativo", true);
    setTemplates(data || []);
  };

  const fetchLeads = async () => {
    const { data } = await supabase
      .from("leads")
      .select("*")
      .eq("campanha_id", campanhaId)
      .order("data_criacao", { ascending: false });
    setLeads(data || []);
  };

  const generatePreview = () => {
    const template = templates.find(t => t.id === selectedTemplate);
    const lead = leads.find(l => l.id === selectedLeads[0]);

    if (!template || !lead) return;

    let text = template.body_content;
    text = text.replace(/\{\{nome\}\}/g, lead.nome);
    text = text.replace(/\{\{email\}\}/g, lead.email);
    text = text.replace(/\{\{telefone\}\}/g, lead.telefone || "");
    text = text.replace(/\{\{interesse\}\}/g, lead.interesse || "");

    setPreview(text);
  };

  const handleSend = async () => {
    setLoading(true);
    try {
      // Validar entrada
      const validatedData = sendBulkMessageSchema.parse({
        templateId: selectedTemplate,
        leadIds: selectedLeads,
      });

      const template = templates.find(t => t.id === validatedData.templateId);
      if (!template) throw new Error("Template não encontrado");

      let successCount = 0;
      let failCount = 0;

      // Enviar mensagens sequencialmente (máx 100 conforme schema)
      for (const leadId of validatedData.leadIds) {
        try {
          const lead = leads.find(l => l.id === leadId);
          if (!lead) continue;

          // Personalizar mensagem
          let message = template.body_content;
          message = message.replace(/\{\{nome\}\}/g, lead.nome);
          message = message.replace(/\{\{email\}\}/g, lead.email);
          message = message.replace(/\{\{telefone\}\}/g, lead.telefone || "");
          message = message.replace(/\{\{interesse\}\}/g, lead.interesse || "");

          // Enviar via Edge Function
          const { data, error } = await supabase.functions.invoke('whatsapp-send-message', {
            body: {
              campanhaId,
              leadId,
              message,
              type: template.header_type || 'text',
            }
          });

          if (error) throw error;
          if (data.success) {
            successCount++;
          } else {
            failCount++;
          }
        } catch (err) {
          console.error(`Erro ao enviar para lead ${leadId}:`, err);
          failCount++;
        }
      }

      toast({
        title: "Envio concluído",
        description: `${successCount} mensagens enviadas, ${failCount} falharam.`,
      });

      setSelectedLeads([]);
      setSelectedTemplate("");
    } catch (error: any) {
      toast({
        title: "Erro ao enviar",
        description: error.issues?.[0]?.message || error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleLead = (leadId: string) => {
    setSelectedLeads(prev =>
      prev.includes(leadId)
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    );
  };

  const toggleAll = () => {
    if (selectedLeads.length === leads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(leads.map(l => l.id));
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Enviar Mensagens em Lote</CardTitle>
          <CardDescription>
            Selecione os leads e o template para enviar mensagens WhatsApp
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Template</Label>
            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um template" />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Leads ({selectedLeads.length} selecionados)</Label>
              <Button variant="ghost" size="sm" onClick={toggleAll}>
                {selectedLeads.length === leads.length ? "Desmarcar todos" : "Selecionar todos"}
              </Button>
            </div>
            <div className="border rounded-lg max-h-64 overflow-y-auto p-2 space-y-2">
              {leads.map((lead) => (
                <div key={lead.id} className="flex items-center space-x-2 p-2 hover:bg-muted rounded">
                  <Checkbox
                    checked={selectedLeads.includes(lead.id)}
                    onCheckedChange={() => toggleLead(lead.id)}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{lead.nome}</p>
                    <p className="text-xs text-muted-foreground">{lead.telefone}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button onClick={handleSend} disabled={loading} className="w-full">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
            Enviar para {selectedLeads.length} lead(s)
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preview da Mensagem</CardTitle>
          <CardDescription>
            Visualização com dados do primeiro lead selecionado
          </CardDescription>
        </CardHeader>
        <CardContent>
          {preview ? (
            <div className="p-4 bg-muted rounded-lg whitespace-pre-wrap">
              {preview}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              Selecione um template e leads para ver o preview
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
