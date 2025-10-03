import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, Send, CheckCircle, XCircle, Clock, Palette, Edit, Trash2, Plus } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

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
  const [temaEmailId, setTemaEmailId] = useState("");
  const [assinaturaEmailId, setAssinaturaEmailId] = useState("");
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [temasEmail, setTemasEmail] = useState<any[]>([]);
  const [assinaturas, setAssinaturas] = useState<any[]>([]);
  const [isAssinaturaDialogOpen, setIsAssinaturaDialogOpen] = useState(false);
  const { toast } = useToast();

  const [novaAssinatura, setNovaAssinatura] = useState({
    nome: "",
    cargo: "",
    empresa: "",
    telefone: "",
    email: "",
    website: "",
    logo_url: "",
  });

  useEffect(() => {
    fetchConfiguracoes();
    fetchTemplates();
    fetchLogs();
    fetchTemasEmail();
    fetchAssinaturas();
  }, [campanhaId]);

  const fetchConfiguracoes = async () => {
    try {
      const { data, error } = await supabase
        .from("campanhas")
        .select("email_remetente, email_nome_remetente, email_auto_envio, template_boas_vindas_id, tema_email_id, assinatura_email_id")
        .eq("id", campanhaId)
        .single();

      if (error) throw error;
      
      setEmailRemetente(data.email_remetente || "");
      setEmailNomeRemetente(data.email_nome_remetente || "");
      setEmailAutoEnvio(data.email_auto_envio || false);
      setTemplateBoasVindasId(data.template_boas_vindas_id || "");
      setTemaEmailId(data.tema_email_id ? data.tema_email_id.toString() : "none");
      setAssinaturaEmailId(data.assinatura_email_id || "none");
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

  const fetchTemasEmail = async () => {
    try {
      const { data, error } = await supabase
        .from("temas_email")
        .select("*")
        .order("nome");

      if (error) throw error;
      setTemasEmail(data || []);
    } catch (error: any) {
      console.error("Erro ao buscar temas:", error);
    }
  };

  const fetchAssinaturas = async () => {
    try {
      const { data, error } = await supabase
        .from("assinaturas_email")
        .select("*")
        .eq("campanha_id", campanhaId)
        .order("criado_em", { ascending: false });

      if (error) throw error;
      setAssinaturas(data || []);
    } catch (error: any) {
      console.error("Erro ao buscar assinaturas:", error);
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
          tema_email_id: (temaEmailId && temaEmailId !== "none") ? parseInt(temaEmailId) : null,
          assinatura_email_id: (assinaturaEmailId && assinaturaEmailId !== "none") ? assinaturaEmailId : null,
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

  const handleCriarAssinatura = async () => {
    setSalvando(true);
    try {
      const templateHtml = `
        <table role="presentation" style="border-collapse: collapse;">
          <tr>
            <td style="padding-right: 20px; border-right: 2px solid #e5e7eb;">
              ${novaAssinatura.logo_url ? `<img src="${novaAssinatura.logo_url}" alt="Logo" style="max-width: 80px; height: auto;">` : ''}
            </td>
            <td style="padding-left: 20px;">
              <p style="margin: 0; font-weight: bold; color: #1f2937; font-size: 16px;">${novaAssinatura.nome}</p>
              ${novaAssinatura.cargo ? `<p style="margin: 4px 0; color: #6b7280; font-size: 14px;">${novaAssinatura.cargo}</p>` : ''}
              ${novaAssinatura.empresa ? `<p style="margin: 4px 0; color: #6b7280; font-size: 14px;">${novaAssinatura.empresa}</p>` : ''}
              ${novaAssinatura.telefone ? `<p style="margin: 4px 0; color: #6b7280; font-size: 13px;">📞 ${novaAssinatura.telefone}</p>` : ''}
              ${novaAssinatura.email ? `<p style="margin: 4px 0; color: #6b7280; font-size: 13px;">✉️ ${novaAssinatura.email}</p>` : ''}
              ${novaAssinatura.website ? `<p style="margin: 4px 0; color: #6b7280; font-size: 13px;">🌐 <a href="${novaAssinatura.website}" style="color: #3b82f6; text-decoration: none;">${novaAssinatura.website}</a></p>` : ''}
            </td>
          </tr>
        </table>
      `;

      const { error } = await supabase
        .from("assinaturas_email")
        .insert({
          campanha_id: campanhaId,
          nome: novaAssinatura.nome,
          cargo: novaAssinatura.cargo || null,
          empresa: novaAssinatura.empresa || null,
          telefone: novaAssinatura.telefone || null,
          email: novaAssinatura.email || null,
          website: novaAssinatura.website || null,
          logo_url: novaAssinatura.logo_url || null,
          template_html: templateHtml,
        });

      if (error) throw error;

      toast({
        title: "Assinatura criada!",
        description: "A assinatura de email foi criada com sucesso.",
      });

      setIsAssinaturaDialogOpen(false);
      setNovaAssinatura({
        nome: "",
        cargo: "",
        empresa: "",
        telefone: "",
        email: "",
        website: "",
        logo_url: "",
      });
      fetchAssinaturas();
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

  const handleDeletarAssinatura = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar esta assinatura?")) return;

    try {
      const { error } = await supabase
        .from("assinaturas_email")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Assinatura deletada!",
        description: "A assinatura foi removida com sucesso.",
      });

      fetchAssinaturas();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
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
    <Tabs defaultValue="config" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="config">Configuração</TabsTrigger>
        <TabsTrigger value="temas">Temas</TabsTrigger>
        <TabsTrigger value="assinaturas">Assinaturas</TabsTrigger>
        <TabsTrigger value="historico">Histórico</TabsTrigger>
      </TabsList>

      {/* Configuração */}
      <TabsContent value="config" className="space-y-6">
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

            <div className="space-y-2">
              <Label htmlFor="template">Template de Boas-Vindas</Label>
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

            <Button onClick={handleSalvar} disabled={salvando}>
              {salvando && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar Configurações
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Temas */}
      <TabsContent value="temas" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Temas de Email
            </CardTitle>
            <CardDescription>
              Escolha um tema visual para seus emails
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Tema Atual</Label>
              <Select value={temaEmailId} onValueChange={setTemaEmailId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um tema" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhum tema</SelectItem>
                  {temasEmail.map((tema) => (
                    <SelectItem key={tema.id} value={tema.id.toString()}>
                      {tema.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {temasEmail.map((tema) => (
                <Card 
                  key={tema.id} 
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    temaEmailId === tema.id.toString() ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setTemaEmailId(tema.id.toString())}
                >
                  <CardHeader>
                    <CardTitle className="text-base">{tema.nome}</CardTitle>
                    <CardDescription className="text-xs">
                      {tema.descricao}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs text-muted-foreground">
                      <strong>Variáveis:</strong> {tema.variaveis_suportadas?.join(", ")}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button onClick={handleSalvar} disabled={salvando}>
              {salvando && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar Tema
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Assinaturas */}
      <TabsContent value="assinaturas" className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Edit className="h-5 w-5" />
                  Assinaturas de Email
                </CardTitle>
                <CardDescription>
                  Crie assinaturas profissionais para seus emails
                </CardDescription>
              </div>
              <Dialog open={isAssinaturaDialogOpen} onOpenChange={setIsAssinaturaDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Assinatura
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Criar Nova Assinatura</DialogTitle>
                    <DialogDescription>
                      Preencha os dados para criar uma assinatura profissional
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Nome *</Label>
                        <Input
                          value={novaAssinatura.nome}
                          onChange={(e) => setNovaAssinatura({ ...novaAssinatura, nome: e.target.value })}
                          placeholder="João Silva"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Cargo</Label>
                        <Input
                          value={novaAssinatura.cargo}
                          onChange={(e) => setNovaAssinatura({ ...novaAssinatura, cargo: e.target.value })}
                          placeholder="Gerente de Marketing"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Empresa</Label>
                      <Input
                        value={novaAssinatura.empresa}
                        onChange={(e) => setNovaAssinatura({ ...novaAssinatura, empresa: e.target.value })}
                        placeholder="Minha Empresa Ltda"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Telefone</Label>
                        <Input
                          value={novaAssinatura.telefone}
                          onChange={(e) => setNovaAssinatura({ ...novaAssinatura, telefone: e.target.value })}
                          placeholder="(11) 99999-9999"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                          type="email"
                          value={novaAssinatura.email}
                          onChange={(e) => setNovaAssinatura({ ...novaAssinatura, email: e.target.value })}
                          placeholder="joao@empresa.com"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Website</Label>
                      <Input
                        value={novaAssinatura.website}
                        onChange={(e) => setNovaAssinatura({ ...novaAssinatura, website: e.target.value })}
                        placeholder="https://www.empresa.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>URL do Logo</Label>
                      <Input
                        value={novaAssinatura.logo_url}
                        onChange={(e) => setNovaAssinatura({ ...novaAssinatura, logo_url: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                  <Button onClick={handleCriarAssinatura} disabled={salvando || !novaAssinatura.nome}>
                    {salvando && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Criar Assinatura
                  </Button>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Assinatura Ativa</Label>
              <Select value={assinaturaEmailId} onValueChange={setAssinaturaEmailId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma assinatura" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhuma</SelectItem>
                  {assinaturas.map((assinatura) => (
                    <SelectItem key={assinatura.id} value={assinatura.id}>
                      {assinatura.nome} - {assinatura.cargo || "Sem cargo"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {assinaturas.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>Nenhuma assinatura criada ainda</p>
                <p className="text-sm">Clique em "Nova Assinatura" para começar</p>
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              {assinaturas.map((assinatura) => (
                <Card key={assinatura.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">{assinatura.nome}</CardTitle>
                        {assinatura.cargo && (
                          <CardDescription className="text-xs">{assinatura.cargo}</CardDescription>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeletarAssinatura(assinatura.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs space-y-1 text-muted-foreground">
                      {assinatura.empresa && <p>🏢 {assinatura.empresa}</p>}
                      {assinatura.telefone && <p>📞 {assinatura.telefone}</p>}
                      {assinatura.email && <p>✉️ {assinatura.email}</p>}
                      {assinatura.website && (
                        <p>🌐 <a href={assinatura.website} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                          {assinatura.website}
                        </a></p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button onClick={handleSalvar} disabled={salvando}>
              {salvando && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar Assinatura Ativa
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Histórico */}
      <TabsContent value="historico" className="space-y-6">
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
      </TabsContent>
    </Tabs>
  );
};

export default EmailsCampanha;