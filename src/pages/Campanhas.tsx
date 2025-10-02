import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Target, Eye, Pause, Play } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import { useNavigate } from "react-router-dom";

interface Campanha {
  id: string;
  cliente_id: string;
  nome: string;
  descricao?: string;
  status: string;
  tema_id?: number;
  criado_em: string;
}

const Campanhas = () => {
  const [campanhas, setCampanhas] = useState<Campanha[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCampanha, setEditingCampanha] = useState<Campanha | null>(null);
  const [clienteId, setClienteId] = useState<string>("");
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCampanhas();
  }, []);

  const fetchCampanhas = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      // Buscar primeiro cliente do usuário
      const { data: clientes } = await supabase
        .from("clientes")
        .select("id")
        .eq("user_id", user.id)
        .limit(1);

      if (clientes && clientes.length > 0) {
        setClienteId(clientes[0].id);

        const { data, error } = await supabase
          .from("campanhas")
          .select("*")
          .eq("cliente_id", clientes[0].id)
          .order("criado_em", { ascending: false });

        if (error) throw error;
        setCampanhas(data || []);
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingCampanha) {
        const { error } = await supabase
          .from("campanhas")
          .update({
            nome: formData.nome,
            descricao: formData.descricao || null,
          })
          .eq("id", editingCampanha.id);

        if (error) throw error;

        toast({
          title: "Campanha atualizada!",
          description: "As informações foram salvas com sucesso.",
        });
      } else {
        const { error } = await supabase
          .from("campanhas")
          .insert({
            nome: formData.nome,
            descricao: formData.descricao || null,
            cliente_id: clienteId,
            status: 'ativa',
          });

        if (error) throw error;

        toast({
          title: "Campanha criada!",
          description: "A nova campanha foi adicionada com sucesso.",
        });
      }

      setFormData({ nome: "", descricao: "" });
      setEditingCampanha(null);
      setIsModalOpen(false);
      fetchCampanhas();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (campanha: Campanha) => {
    setEditingCampanha(campanha);
    setFormData({
      nome: campanha.nome,
      descricao: campanha.descricao || "",
    });
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (campanha: Campanha) => {
    try {
      const newStatus = campanha.status === 'ativa' ? 'pausada' : 'ativa';
      
      const { error } = await supabase
        .from("campanhas")
        .update({ status: newStatus })
        .eq("id", campanha.id);

      if (error) throw error;

      toast({
        title: "Status atualizado!",
        description: `Campanha ${newStatus === 'ativa' ? 'ativada' : 'pausada'} com sucesso.`,
      });
      
      fetchCampanhas();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta campanha?")) return;

    try {
      const { error } = await supabase
        .from("campanhas")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Campanha excluída!",
        description: "A campanha foi removida com sucesso.",
      });
      
      fetchCampanhas();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      ativa: "default",
      pausada: "secondary",
      finalizada: "outline",
    };
    
    return (
      <Badge variant={variants[status as keyof typeof variants] as any}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Carregando campanhas...</div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Campanhas</h1>
            <p className="text-muted-foreground">
              Gerencie suas campanhas de captura de leads
            </p>
          </div>
          
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingCampanha(null);
                setFormData({ nome: "", descricao: "" });
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Campanha
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingCampanha ? "Editar Campanha" : "Nova Campanha"}
                </DialogTitle>
                <DialogDescription>
                  {editingCampanha 
                    ? "Atualize as informações da campanha" 
                    : "Crie uma nova campanha de captura de leads"
                  }
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome da Campanha</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                    required
                    placeholder="Ex: Black Friday 2024"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição (opcional)</Label>
                  <Textarea
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                    placeholder="Descreva o objetivo desta campanha"
                    rows={3}
                  />
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingCampanha ? "Atualizar" : "Criar"} Campanha
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {campanhas.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Target className="h-12 w-12 text-muted-foreground mb-4" />
              <CardTitle className="mb-2">Nenhuma campanha encontrada</CardTitle>
              <CardDescription className="text-center mb-4">
                Comece criando sua primeira campanha para capturar leads
              </CardDescription>
              <Button onClick={() => setIsModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeira Campanha
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {campanhas.map((campanha) => (
              <Card key={campanha.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-lg">{campanha.nome}</CardTitle>
                        {getStatusBadge(campanha.status)}
                      </div>
                      {campanha.descricao && (
                        <CardDescription className="line-clamp-2">
                          {campanha.descricao}
                        </CardDescription>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="text-sm text-muted-foreground">
                    Criada em {new Date(campanha.criado_em).toLocaleDateString('pt-BR')}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => navigate(`/campanha/${campanha.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Gerenciar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleStatus(campanha)}
                    >
                      {campanha.status === 'ativa' ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(campanha)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(campanha.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Campanhas;