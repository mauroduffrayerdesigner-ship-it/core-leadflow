import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { MessageSquare, Settings, FileText, History, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

interface WhatsAppSidebarProps {
  selectedCampanhaId?: string;
  onSelectCampanha: (campanhaId: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

interface Campanha {
  id: string;
  nome: string;
}

const WhatsAppSidebar = ({ selectedCampanhaId, onSelectCampanha, collapsed, onToggleCollapse }: WhatsAppSidebarProps) => {
  const [campanhas, setCampanhas] = useState<Campanha[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampanhas();
  }, []);

  const fetchCampanhas = async () => {
    try {
      const { data: clienteData } = await supabase
        .from("clientes")
        .select("id")
        .single();

      if (!clienteData) {
        toast.error("Cliente não encontrado");
        return;
      }

      const { data, error } = await supabase
        .from("campanhas")
        .select("id, nome")
        .eq("cliente_id", clienteData.id)
        .order("nome");

      if (error) throw error;

      setCampanhas(data || []);
      
      // Selecionar a primeira campanha por padrão
      if (data && data.length > 0 && !selectedCampanhaId) {
        onSelectCampanha(data[0].id);
      }
    } catch (error: any) {
      toast.error("Erro ao carregar campanhas");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (collapsed) {
    return (
      <div className="h-full flex flex-col items-center py-4 gap-4">
        <Button variant="ghost" size="icon" onClick={onToggleCollapse}>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Separator />
        <Button variant="ghost" size="icon">
          <MessageSquare className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <FileText className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <History className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-lg font-semibold">WhatsApp</h2>
        <Button variant="ghost" size="icon" onClick={onToggleCollapse}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Campanhas */}
          <div>
            <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Campanhas
            </h3>
            <div className="space-y-1">
              {loading ? (
                <div className="text-sm text-muted-foreground">Carregando...</div>
              ) : campanhas.length === 0 ? (
                <div className="text-sm text-muted-foreground">Nenhuma campanha</div>
              ) : (
                campanhas.map((campanha) => (
                  <Button
                    key={campanha.id}
                    variant={selectedCampanhaId === campanha.id ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => onSelectCampanha(campanha.id)}
                  >
                    {campanha.nome}
                  </Button>
                ))
              )}
            </div>
          </div>

          <Separator />

          {/* Ações Rápidas */}
          <div>
            <h3 className="text-sm font-medium mb-2">Acesso Rápido</h3>
            <div className="space-y-1">
              <Button variant="ghost" className="w-full justify-start">
                <Settings className="h-4 w-4 mr-2" />
                Configurações
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Templates
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <History className="h-4 w-4 mr-2" />
                Histórico
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default WhatsAppSidebar;
