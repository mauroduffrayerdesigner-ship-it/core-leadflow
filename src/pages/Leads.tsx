import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Mail, Phone, MessageSquare, Users, Filter, Calendar } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Layout from "@/components/Layout";
import ExportarCSV from "@/components/leads/ExportarCSV";
import ImportarCSV from "@/components/leads/ImportarCSV";
import FiltrosLeads from "@/components/leads/FiltrosLeads";

interface Lead {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  interesse?: string;
  data_criacao: string;
  cliente_id: string;
  origem?: string;
  status?: string;
  clientes?: {
    nome: string;
  };
}

interface Cliente {
  id: string;
  nome: string;
}

const Leads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filtros, setFiltros] = useState({
    origem: "all",
    status: "all",
    cliente_id: "all",
    data_inicio: "",
    data_fim: ""
  });
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    interesse: "",
    cliente_id: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Buscar leads com informações do cliente
      let query = supabase
        .from("leads")
        .select(`
          *,
          clientes(nome)
        `)
        .order("data_criacao", { ascending: false });

      // Aplicar filtros
      if (filtros.origem && filtros.origem !== "all") query = query.eq("origem", filtros.origem);
      if (filtros.status && filtros.status !== "all") query = query.eq("status", filtros.status);
      if (filtros.cliente_id && filtros.cliente_id !== "all") query = query.eq("cliente_id", filtros.cliente_id);
      if (filtros.data_inicio) query = query.gte("data_criacao", filtros.data_inicio);
      if (filtros.data_fim) query = query.lte("data_criacao", filtros.data_fim + "T23:59:59");

      const { data: leadsData, error: leadsError } = await query;

      if (leadsError) throw leadsError;

      // Buscar clientes para o select
      const { data: clientesData, error: clientesError } = await supabase
        .from("clientes")
        .select("id, nome")
        .order("nome");

      if (clientesError) throw clientesError;

      setLeads(leadsData || []);
      setClientes(clientesData || []);
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
      // Usar edge function para criar lead com webhook
      const { error } = await supabase.functions.invoke('webhook-lead', {
        body: {
          cliente_id: formData.cliente_id,
          nome: formData.nome,
          email: formData.email,
          telefone: formData.telefone || null,
          interesse: formData.interesse || null,
          origem: 'manual'
        }
      });

      if (error) throw error;

      toast({
        title: "Lead adicionado!",
        description: "O novo lead foi registrado com sucesso.",
      });

      setFormData({
        nome: "",
        email: "",
        telefone: "",
        interesse: "",
        cliente_id: "",
      });
      setIsModalOpen(false);
      fetchData();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Carregando leads...</div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Leads</h1>
          <p className="text-muted-foreground">
            Visualize e gerencie todos os leads capturados
          </p>
        </div>
        
        <div className="flex gap-2">
          <ExportarCSV />
          <ImportarCSV onSuccess={fetchData} />
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setFormData({
                nome: "",
                email: "",
                telefone: "",
                interesse: "",
                cliente_id: "",
              });
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Lead
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Lead</DialogTitle>
              <DialogDescription>
                Adicione um novo lead manualmente ao sistema
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cliente_id">Cliente</Label>
                <Select
                  value={formData.cliente_id}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, cliente_id: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientes.map((cliente) => (
                      <SelectItem key={cliente.id} value={cliente.id}>
                        {cliente.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                  required
                  placeholder="Nome do lead"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                  placeholder="email@lead.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone (opcional)</Label>
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
                  placeholder="(11) 99999-9999"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="interesse">Interesse (opcional)</Label>
                <Textarea
                  id="interesse"
                  value={formData.interesse}
                  onChange={(e) => setFormData(prev => ({ ...prev, interesse: e.target.value }))}
                  placeholder="Descreva o interesse do lead..."
                  rows={3}
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  Adicionar Lead
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
      </div>

      {/* Filtros */}
      <FiltrosLeads
        clientes={clientes}
        filtros={filtros}
        onFiltrosChange={setFiltros}
        onAplicar={fetchData}
        onLimpar={() => {
          setFiltros({
            origem: "all",
            status: "all",
            cliente_id: "all",
            data_inicio: "",
            data_fim: ""
          });
          fetchData();
        }}
      />

      {leads.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <CardTitle className="mb-2">Nenhum lead encontrado</CardTitle>
            <CardDescription className="text-center mb-4">
              {clientes.length === 0 
                ? "Primeiro você precisa criar um cliente para poder capturar leads"
                : "Os leads capturados aparecerão aqui"
              }
            </CardDescription>
            {clientes.length > 0 && (
              <Button onClick={() => setIsModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Primeiro Lead
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {leads.map((lead) => (
            <Card key={lead.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{lead.nome}</CardTitle>
                    <CardDescription>
                      Cliente: {lead.clientes?.nome}
                    </CardDescription>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(lead.data_criacao).toLocaleDateString('pt-BR')} às{' '}
                    {new Date(lead.data_criacao).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{lead.email}</span>
                  </div>
                  
                   {lead.telefone && (
                     <div className="flex items-center gap-2">
                       <Phone className="h-4 w-4 text-muted-foreground" />
                       <span className="text-sm">{lead.telefone}</span>
                     </div>
                   )}

                   <div className="flex items-center gap-2">
                     <span className="text-xs px-2 py-1 bg-muted rounded-full">
                       {lead.origem || 'formulario'}
                     </span>
                     <span className={`text-xs px-2 py-1 rounded-full ${
                       lead.status === 'convertido' ? 'bg-green-100 text-green-800' :
                       lead.status === 'qualificado' ? 'bg-blue-100 text-blue-800' :
                       lead.status === 'descartado' ? 'bg-red-100 text-red-800' :
                       'bg-gray-100 text-gray-800'
                     }`}>
                       {lead.status || 'novo'}
                     </span>
                   </div>
                  
                  {lead.interesse && (
                    <div className="md:col-span-2 flex items-start gap-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <span className="text-sm font-medium">Interesse:</span>
                        <p className="text-sm text-muted-foreground mt-1">
                          {lead.interesse}
                        </p>
                      </div>
                    </div>
                  )}
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

export default Leads;