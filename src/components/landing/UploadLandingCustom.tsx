import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Code, Eye, Upload } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface UploadLandingCustomProps {
  campanhaId?: string;
  clienteId?: string;
  onSuccess?: () => void;
}

const UploadLandingCustom = ({ campanhaId, clienteId, onSuccess }: UploadLandingCustomProps) => {
  const [nome, setNome] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [cssContent, setCssContent] = useState("");
  const [jsContent, setJsContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    if (!nome.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira um nome para a landing page",
        variant: "destructive",
      });
      return;
    }

    if (!htmlContent.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira o código HTML",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const { data, error } = await supabase
        .from("landing_pages_custom")
        .insert({
          nome,
          html_content: htmlContent,
          css_content: cssContent || null,
          js_content: jsContent || null,
          campanha_id: campanhaId || null,
          cliente_id: clienteId || null,
        })
        .select()
        .single();

      if (error) throw error;

      // Atualizar referência na campanha ou cliente
      if (campanhaId && data) {
        await supabase
          .from("campanhas")
          .update({ custom_landing_id: data.id })
          .eq("id", campanhaId);
      } else if (clienteId && data) {
        await supabase
          .from("clientes")
          .update({ custom_landing_id: data.id })
          .eq("id", clienteId);
      }

      toast({
        title: "Sucesso!",
        description: "Landing page personalizada criada com sucesso",
      });

      // Limpar campos
      setNome("");
      setHtmlContent("");
      setCssContent("");
      setJsContent("");

      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error("Erro ao salvar:", error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível salvar a landing page",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const getPreviewHTML = () => {
    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${nome || "Preview"}</title>
  <style>${cssContent}</style>
</head>
<body>
  ${htmlContent}
  <script>${jsContent}</script>
</body>
</html>
    `;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload de Landing Page Personalizada
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="nome">Nome da Landing Page</Label>
            <Input
              id="nome"
              placeholder="Ex: Landing Page Black Friday"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>

          <Tabs defaultValue="html" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="html">HTML</TabsTrigger>
              <TabsTrigger value="css">CSS</TabsTrigger>
              <TabsTrigger value="js">JavaScript</TabsTrigger>
            </TabsList>

            <TabsContent value="html" className="space-y-2">
              <Label htmlFor="html">Código HTML *</Label>
              <Textarea
                id="html"
                placeholder="Cole seu código HTML aqui..."
                value={htmlContent}
                onChange={(e) => setHtmlContent(e.target.value)}
                rows={15}
                className="font-mono text-sm"
              />
              <p className="text-sm text-muted-foreground">
                Cole o HTML completo da sua landing page
              </p>
            </TabsContent>

            <TabsContent value="css" className="space-y-2">
              <Label htmlFor="css">Código CSS (Opcional)</Label>
              <Textarea
                id="css"
                placeholder="Cole seu código CSS aqui..."
                value={cssContent}
                onChange={(e) => setCssContent(e.target.value)}
                rows={15}
                className="font-mono text-sm"
              />
              <p className="text-sm text-muted-foreground">
                Estilos personalizados para sua landing page
              </p>
            </TabsContent>

            <TabsContent value="js" className="space-y-2">
              <Label htmlFor="js">Código JavaScript (Opcional)</Label>
              <Textarea
                id="js"
                placeholder="Cole seu código JavaScript aqui..."
                value={jsContent}
                onChange={(e) => setJsContent(e.target.value)}
                rows={15}
                className="font-mono text-sm"
              />
              <p className="text-sm text-muted-foreground">
                Scripts e interações personalizadas
              </p>
            </TabsContent>
          </Tabs>

          <div className="flex gap-3">
            <Button
              onClick={() => setPreviewOpen(true)}
              variant="outline"
              disabled={!htmlContent.trim()}
              className="flex-1"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || !nome.trim() || !htmlContent.trim()}
              className="flex-1"
            >
              <Code className="w-4 h-4 mr-2" />
              {saving ? "Salvando..." : "Salvar Landing Page"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-6xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>Preview: {nome || "Landing Page"}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto border rounded-lg">
            <iframe
              srcDoc={getPreviewHTML()}
              className="w-full h-full"
              sandbox="allow-scripts allow-same-origin"
              title="Preview"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UploadLandingCustom;
