import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Eye, Check } from "lucide-react";
import PreviewModal from "./PreviewModal";
import previewModerno from "@/assets/preview-moderno-minimalista.jpg";
import previewTech from "@/assets/preview-tech-startup.jpg";
import previewCorporativo from "@/assets/preview-corporativo-elegante.jpg";
import previewCriativo from "@/assets/preview-criativo-colorido.jpg";
import previewEcommerce from "@/assets/preview-ecommerce-focus.jpg";
import previewConsultoria from "@/assets/preview-consultoria-premium.jpg";
import previewVsl from "@/assets/preview-vsl-video.jpg";
import previewGift from "@/assets/preview-gift-bonus.jpg";

interface Tema {
  id: number;
  nome: string;
  descricao: string;
  preview_url?: string;
  criado_em: string;
}

interface TemasLandingProps {
  clienteId: string;
  temaSelecionado?: number;
  onTemaSelect: (temaId: number) => void;
}

const TemasLanding = ({ clienteId, temaSelecionado, onTemaSelect }: TemasLandingProps) => {
  const [temas, setTemas] = useState<Tema[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewTemaId, setPreviewTemaId] = useState<number>(1);
  const { toast } = useToast();

  useEffect(() => {
    fetchTemas();
  }, []);

  const fetchTemas = async () => {
    try {
      const { data, error } = await supabase
        .from("temas_landing")
        .select("*")
        .order("id");

      if (error) throw error;
      setTemas(data || []);
    } catch (error: any) {
      console.error("Erro ao buscar temas:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os temas disponíveis.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelecionarTema = async (temaId: number) => {
    try {
      const { error } = await supabase
        .from("clientes")
        .update({ tema_id: temaId })
        .eq("id", clienteId);

      if (error) throw error;

      onTemaSelect(temaId);
      toast({
        title: "Sucesso",
        description: "Tema selecionado com sucesso!",
      });
    } catch (error: any) {
      console.error("Erro ao selecionar tema:", error);
      toast({
        title: "Erro",
        description: "Não foi possível selecionar o tema.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-2/3"></div>
              <div className="h-3 bg-muted rounded w-full"></div>
            </CardHeader>
            <CardContent>
              <div className="h-32 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Escolha o Tema da sua Landing Page</h2>
        <p className="text-muted-foreground">
          Selecione um dos nossos temas otimizados para conversão
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {temas.map((tema) => (
          <Card 
            key={tema.id} 
            className={`relative transition-all duration-200 hover:shadow-lg ${
              temaSelecionado === tema.id ? 'ring-2 ring-primary shadow-lg' : ''
            }`}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{tema.nome}</CardTitle>
                  <CardDescription className="mt-1">
                    {tema.descricao}
                  </CardDescription>
                </div>
                {temaSelecionado === tema.id && (
                  <Badge variant="default" className="ml-2">
                    <Check className="h-3 w-3 mr-1" />
                    Ativo
                  </Badge>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="h-32 bg-muted rounded-lg overflow-hidden">
                <img 
                  src={
                    tema.id === 1 ? previewModerno :
                    tema.id === 2 ? previewTech :
                    tema.id === 3 ? previewCorporativo :
                    tema.id === 4 ? previewCriativo :
                    tema.id === 5 ? previewEcommerce :
                    tema.id === 6 ? previewConsultoria :
                    tema.id === 7 ? previewVsl :
                    tema.id === 8 ? previewGift :
                    previewModerno
                  } 
                  alt={`Preview ${tema.nome}`}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    setPreviewTemaId(tema.id);
                    setPreviewOpen(true);
                  }}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                
                <Button
                  size="sm"
                  className="flex-1"
                  variant={temaSelecionado === tema.id ? "secondary" : "default"}
                  onClick={() => handleSelecionarTema(tema.id)}
                  disabled={temaSelecionado === tema.id}
                >
                  {temaSelecionado === tema.id ? "Selecionado" : "Selecionar"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <PreviewModal 
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        temaId={previewTemaId}
        clienteId={clienteId}
      />
    </div>
  );
};

export default TemasLanding;