import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, Send, CheckCircle, XCircle, Clock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface EmailsCampanhaProps {
  campanhaId: string;
}

interface EmailTemplate {
  id: string;
  nome: string;
  assunto: string;
  corpo: string;
  tipo: string;
}

interface EmailLog {
  id: string;
  destinatario_email: string;
  destinatario_nome: string;
  assunto: string;
  status: string;
  criado_em: string;
}

const EmailsCampanha = ({ campanhaId }: EmailsCampanhaProps) => {
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [emailRemetente, setEmailRemetente] = useState("");
  const [emailNomeRemetente, setEmailNomeRemetente] = useState("");
  const [emailAutoEnvio, setEmailAutoEnvio] = useState(false);
  const [templateBoasVindasId, setTemplateBoasVindasId] = useState("");
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchConfiguracoes();
    fetchTemplates();
    fetchLogs();
  }, [campanhaId]);

  const fetchConfiguracoes = async () => {
    try {
      const { data, error } = await supabase
        .from("campanhas")
        .select("email_remetente, email_nome_remetente, email_auto_envio, template_boas_vindas_id")
        .eq("id", campanhaId)
        .single();

      if (error) throw error;
      
      setEmailRemetente(data.email_remetente || "");
      setEmailNomeRemetente(data.email_nome_remetente || "");
      setEmailAutoEnvio(data.email_auto_envio || false);
      setTemplateBoasVindasId(data.template_boas_vindas_id || "");
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar as configurações de email.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from("email_templates")
        .select("*")
        .order("nome");

      if (error) throw error;
      setTemplates(data || []);
    } catch (error: any) {
      console.error("Erro ao buscar templates:", error);
    }
  };

  const fetchLogs = async () => {
    try {
      const { data, error } = await supabase
        .from("email_logs")
        .select("*")
        .eq("campanha_id", campanhaId)
        .order("criado_em", { ascending: false })
        .limit(10);

      if (error) throw error;
      setLogs(data || []);
    } catch (error: any) {
      console.error("Erro ao buscar logs:", error);
    }
  };

  const handleSalvar = async () => {
    setSalvando(true);
    try {
      const { error } = await supabase
        .from("campanhas")
        .update({
          email_remetente: emailRemetente,
          email_nome_remetente: emailNomeRemetente,
          email_auto_envio: emailAutoEnvio,
          template_boas_vindas_id: templateBoasVindasId || null,
        })
        .eq("id", campanhaId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Configurações de email salvas com sucesso!",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSalvando(false);
    }
  };

  const handleTestarEmail = async () => {
    if (!emailRemetente || !templateBoasVindasId) {
      toast({
        title: "Atenção",
        description: "Configure o email remetente e selecione um template antes de testar.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Em desenvolvimento",
      description: "Função de teste de email será implementada em breve.",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "enviado":
        return <Badge variant="default" className="gap-1"><CheckCircle className="h-3 w-3" /> Enviado</Badge>;
      case "falha":
        return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" /> Falha</Badge>;
      default:
        return <Badge variant="secondary" className="gap-1"><Clock className="h-3 w-3" /> {status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Configuração do Brevo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Configuração de Email (Brevo)
          </CardTitle>
          <CardDescription>
            Configure o remetente dos emails automáticos da campanha
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email_remetente">Email Remetente</Label>
              <Input
                id="email_remetente"
                type="email"
                placeholder="noreply@seudominio.com"
                value={emailRemetente}
                onChange={(e) => setEmailRemetente(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Email verificado no Brevo
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nome_remetente">Nome do Remetente</Label>
              <Input
                id="nome_remetente"
                placeholder="Sua Empresa"
                value={emailNomeRemetente}
                onChange={(e) => setEmailNomeRemetente(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label>Envio Automático</Label>
              <p className="text-sm text-muted-foreground">
                Enviar email automaticamente ao capturar novo lead
              </p>
            </div>
            <Switch
              checked={emailAutoEnvio}
              onCheckedChange={setEmailAutoEnvio}
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSalvar} disabled={salvando}>
              {salvando && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar Configurações
            </Button>
            <Button variant="outline" onClick={handleTestarEmail}>
              <Send className="mr-2 h-4 w-4" />
              Testar Envio
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Templates e Automação */}
      <Card>
        <CardHeader>
          <CardTitle>Template de Boas-Vindas</CardTitle>
          <CardDescription>
            Selecione o template que será enviado automaticamente para novos leads
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="template">Template</Label>
            <Select value={templateBoasVindasId} onValueChange={setTemplateBoasVindasId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um template" />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.nome} - {template.assunto}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {templateBoasVindasId && (
            <div className="rounded-lg border p-4 bg-muted/50">
              <p className="text-sm text-muted-foreground mb-2">
                <strong>Variáveis disponíveis:</strong>
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{"{{nome}}"}</Badge>
                <Badge variant="outline">{"{{email}}"}</Badge>
                <Badge variant="outline">{"{{telefone}}"}</Badge>
                <Badge variant="outline">{"{{interesse}}"}</Badge>
                <Badge variant="outline">{"{{campanha}}"}</Badge>
              </div>
            </div>
          )}

          <Button onClick={handleSalvar} disabled={salvando} className="w-full">
            {salvando && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Salvar Template de Boas-Vindas
          </Button>
        </CardContent>
      </Card>

      {/* Estatísticas e Histórico */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Envios</CardTitle>
          <CardDescription>
            Últimos 10 emails enviados nesta campanha
          </CardDescription>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhum email enviado ainda
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Destinatário</TableHead>
                  <TableHead>Assunto</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{log.destinatario_nome}</p>
                        <p className="text-sm text-muted-foreground">{log.destinatario_email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{log.assunto}</TableCell>
                    <TableCell>{getStatusBadge(log.status)}</TableCell>
                    <TableCell>
                      {new Date(log.criado_em).toLocaleString('pt-BR')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailsCampanha;
