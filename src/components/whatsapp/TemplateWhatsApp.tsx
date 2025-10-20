import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface TemplateWhatsAppProps {
  campanhaId: string;
  apiType: "official" | "unofficial";
}

export const TemplateWhatsApp = ({ campanhaId, apiType }: TemplateWhatsAppProps) => {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "marketing",
    body_content: "",
    header_content: "",
    footer_content: "",
  });

  useEffect(() => {
    fetchTemplates();
  }, [campanhaId]);

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from("whatsapp_templates")
        .select("*")
        .eq("campanha_id", campanhaId)
        .order("criado_em", { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar templates",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const templateData = {
        campanha_id: campanhaId,
        ...formData,
        variables: ["{{nome}}", "{{email}}", "{{telefone}}", "{{interesse}}"],
      };

      if (editingTemplate) {
        await supabase
          .from("whatsapp_templates")
          .update(templateData)
          .eq("id", editingTemplate.id);
      } else {
        await supabase
          .from("whatsapp_templates")
          .insert(templateData);
      }

      toast({
        title: editingTemplate ? "Template atualizado" : "Template criado",
        description: "Template salvo com sucesso.",
      });

      setDialogOpen(false);
      resetForm();
      fetchTemplates();
    } catch (error: any) {
      toast({
        title: "Erro ao salvar template",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Deseja realmente excluir este template?")) return;

    try {
      await supabase.from("whatsapp_templates").delete().eq("id", id);
      toast({
        title: "Template excluído",
        description: "Template removido com sucesso.",
      });
      fetchTemplates();
    } catch (error: any) {
      toast({
        title: "Erro ao excluir",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (template: any) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      category: template.category,
      body_content: template.body_content,
      header_content: template.header_content || "",
      footer_content: template.footer_content || "",
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingTemplate(null);
    setFormData({
      name: "",
      category: "marketing",
      body_content: "",
      header_content: "",
      footer_content: "",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Templates de Mensagem</CardTitle>
            <CardDescription>
              Gerencie templates para envio de mensagens WhatsApp
            </CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Criar Template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingTemplate ? "Editar Template" : "Criar Novo Template"}
                </DialogTitle>
                <DialogDescription>
                  Variáveis disponíveis: {"{"}{"{"} nome {"}"}{"}"}, {"{"}{"{"} email {"}"}{"}"}, {"{"}{"{"} telefone {"}"}{"}"}, {"{"}{"{"} interesse {"}"}{"}"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Template</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Saudação inicial"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="utility">Utilidade</SelectItem>
                      <SelectItem value="authentication">Autenticação</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="header">Cabeçalho (opcional)</Label>
                  <Input
                    id="header"
                    value={formData.header_content}
                    onChange={(e) => setFormData({ ...formData, header_content: e.target.value })}
                    placeholder="Olá!"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="body">Corpo da Mensagem</Label>
                  <Textarea
                    id="body"
                    value={formData.body_content}
                    onChange={(e) => setFormData({ ...formData, body_content: e.target.value })}
                    placeholder="Olá {{nome}}, tudo bem? Estou entrando em contato sobre {{interesse}}..."
                    rows={6}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="footer">Rodapé (opcional)</Label>
                  <Input
                    id="footer"
                    value={formData.footer_content}
                    onChange={(e) => setFormData({ ...formData, footer_content: e.target.value })}
                    placeholder="Equipe de Vendas"
                  />
                </div>

                <Button onClick={handleSave} className="w-full">
                  {editingTemplate ? "Atualizar Template" : "Criar Template"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Carregando...</p>
        ) : templates.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Nenhum template criado ainda. Clique em "Criar Template" para começar.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Categoria</TableHead>
                {apiType === "official" && <TableHead>Status</TableHead>}
                <TableHead>Criado em</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell className="font-medium">{template.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{template.category}</Badge>
                  </TableCell>
                  {apiType === "official" && (
                    <TableCell>
                      <Badge
                        variant={template.approval_status === "approved" ? "default" : "secondary"}
                      >
                        {template.approval_status}
                      </Badge>
                    </TableCell>
                  )}
                  <TableCell>
                    {new Date(template.criado_em).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(template)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(template.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
