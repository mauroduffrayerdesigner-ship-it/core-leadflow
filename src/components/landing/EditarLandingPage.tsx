import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Eye, Upload } from "lucide-react";
import TemasLanding from "./TemasLanding";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import LandingPageRenderer from "./LandingPageRenderer";

interface Cliente {
  id: string;
  nome: string;
  email: string;
  logo_url?: string;
  tema_id: number;
  headline?: string;
  subtitulo?: string;
  texto_cta?: string;
}

interface EditarLandingPageProps {
  clienteId: string;
}

const EditarLandingPage = ({ clienteId }: EditarLandingPageProps) => {
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [formData, setFormData] = useState({
    headline: "",
    subtitulo: "",
    texto_cta: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    if (clienteId) {
      fetchCliente();
    }
  }, [clienteId]);

  const fetchCliente = async () => {
    try {
      const { data, error } = await supabase
        .from("clientes")
        .select("*")
        .eq("id", clienteId)
        .single();

      if (error) throw error;

      setCliente(data);
      setFormData({
        headline: data.headline || "Transforme sua empresa com nossa solução",
        subtitulo: data.subtitulo || "Descubra como podemos ajudar você a alcançar seus objetivos",
        texto_cta: data.texto_cta || "Quero saber mais",
      });
    } catch (error: any) {
      console.error("Erro ao buscar cliente:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados do cliente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("clientes")
        .update({
          headline: formData.headline,
          subtitulo: formData.subtitulo,
          texto_cta: formData.texto_cta,
        })
        .eq("id", clienteId);

      if (error) throw error;

      // Atualizar estado local
      if (cliente) {
        setCliente({
          ...cliente,
          headline: formData.headline,
          subtitulo: formData.subtitulo,
          texto_cta: formData.texto_cta,
        });
      }

      toast({
        title: "Sucesso",
        description: "Configurações da landing page salvas com sucesso!",
      });
    } catch (error: any) {
      console.error("Erro ao salvar:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar as configurações.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleTemaSelect = (temaId: number) => {
    if (cliente) {
      setCliente({ ...cliente, tema_id: temaId });
    }
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Por ora, apenas mostramos que a funcionalidade existe
    // Em um ambiente real, seria necessário configurar Supabase Storage
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "Upload de logo será implementado com Supabase Storage.",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!cliente) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Cliente não encontrado.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Configurações de Conteúdo */}
      <Card>
        <CardHeader>
          <CardTitle>Configurações de Conteúdo</CardTitle>
          <CardDescription>
            Personalize os textos da sua landing page
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="headline">Título Principal (Headline)</Label>
              <Input
                id="headline"
                value={formData.headline}
                onChange={(e) => setFormData(prev => ({ ...prev, headline: e.target.value }))}
                placeholder="Ex: Transforme sua empresa com nossa solução"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="texto_cta">Texto do Botão CTA</Label>
              <Input
                id="texto_cta"
                value={formData.texto_cta}
                onChange={(e) => setFormData(prev => ({ ...prev, texto_cta: e.target.value }))}
                placeholder="Ex: Quero saber mais"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subtitulo">Subtítulo</Label>
            <Textarea
              id="subtitulo"
              value={formData.subtitulo}
              onChange={(e) => setFormData(prev => ({ ...prev, subtitulo: e.target.value }))}
              placeholder="Ex: Descubra como podemos ajudar você a alcançar seus objetivos"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo">Logo da Empresa</Label>
            <div className="flex items-center gap-4">
              <Input
                id="logo"
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="flex-1"
              />
              <Button variant="outline" size="sm" onClick={() => document.getElementById('logo')?.click()}>
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
            </div>
            {cliente.logo_url && (
              <div className="mt-2">
                <img 
                  src={cliente.logo_url} 
                  alt="Logo atual"
                  className="h-16 w-auto object-contain"
                />
              </div>
            )}
            <p className="text-sm text-muted-foreground">
              📌 Upload de logo será implementado com Supabase Storage
            </p>
          </div>

          <div className="flex gap-4">
            <Button 
              onClick={handleSave} 
              disabled={saving}
              className="flex-1"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Salvar Configurações
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => setPreviewOpen(true)}
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Seleção de Tema */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Temas Disponíveis</h3>
        <TemasLanding 
          clienteId={clienteId}
          temaSelecionado={cliente.tema_id}
          onTemaSelect={handleTemaSelect}
        />
      </div>

      {/* URL da Landing Page */}
      <Card>
        <CardHeader>
          <CardTitle>URL da Landing Page</CardTitle>
          <CardDescription>
            Sua landing page está disponível no endereço abaixo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <code className="flex-1 text-sm">
              {window.location.origin}/lp/{clienteId}
            </code>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/lp/${clienteId}`);
                toast({
                  title: "Copiado!",
                  description: "URL copiada para a área de transferência.",
                });
              }}
            >
              Copiar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Modal de Preview */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-6xl w-full h-[90vh] p-0">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle>Preview da Landing Page</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto">
            {cliente && (
              <LandingPageRenderer 
                cliente={{
                  ...cliente,
                  headline: formData.headline,
                  subtitulo: formData.subtitulo,
                  texto_cta: formData.texto_cta,
                }}
                isPreview={true}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditarLandingPage;