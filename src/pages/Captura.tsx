import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Share2, Copy, ExternalLink, Sparkles } from "lucide-react";
import Layout from "@/components/Layout";

interface Cliente {
  id: string;
  nome: string;
}

const Captura = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [selectedCliente, setSelectedCliente] = useState("");
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    interesse: "",
  });
  const [isPreview, setIsPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchClientes();
  }, []);

  // Auto-selecionar cliente se houver apenas 1
  useEffect(() => {
    if (clientes.length === 1 && !selectedCliente) {
      setSelectedCliente(clientes[0].id);
    }
  }, [clientes, selectedCliente]);

  const fetchClientes = async () => {
    try {
      const { data, error } = await supabase
        .from("clientes")
        .select("id, nome")
        .order("nome");

      if (error) throw error;
      setClientes(data || []);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCliente) {
      toast({
        title: "Erro",
        description: "Selecione um cliente primeiro",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await supabase
        .from("leads")
        .insert({
          nome: formData.nome,
          email: formData.email,
          telefone: formData.telefone || null,
          interesse: formData.interesse || null,
          cliente_id: selectedCliente,
        });

      if (error) throw error;

      toast({
        title: "Lead capturado com sucesso! 🎉",
        description: "Obrigado pelo seu interesse. Entraremos em contato em breve.",
      });

      setFormData({
        nome: "",
        email: "",
        telefone: "",
        interesse: "",
      });
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

  const generateCaptureUrl = () => {
    if (!selectedCliente) return "";
    return `${window.location.origin}/capture/${selectedCliente}`;
  };

  const copyToClipboard = async () => {
    const url = generateCaptureUrl();
    if (!url) {
      toast({
        title: "Erro",
        description: "Selecione um cliente primeiro",
        variant: "destructive",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "URL copiada!",
        description: "A URL foi copiada para a área de transferência",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar a URL",
        variant: "destructive",
      });
    }
  };

  const openInNewTab = () => {
    const url = generateCaptureUrl();
    if (!url) {
      toast({
        title: "Erro",
        description: "Selecione um cliente primeiro",
        variant: "destructive",
      });
      return;
    }
    window.open(url, '_blank');
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Landing Pages</h1>
          <p className="text-muted-foreground">
            Crie e compartilhe landing pages personalizadas para capturar leads
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Configuração */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Configuração
              </CardTitle>
              <CardDescription>
                Configure o formulário e gere o link de captura
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cliente-select">Cliente</Label>
                <Select
                  value={selectedCliente}
                  onValueChange={setSelectedCliente}
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

              {selectedCliente && (
                <div className="space-y-4 pt-4 border-t">
                  <div className="space-y-2">
                    <Label>URL de Captura</Label>
                    <div className="flex gap-2">
                      <Input
                        value={generateCaptureUrl()}
                        readOnly
                        className="bg-muted"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyToClipboard}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={openInNewTab}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant={isPreview ? "default" : "outline"}
                      onClick={() => setIsPreview(true)}
                      className="flex-1"
                    >
                      Preview
                    </Button>
                    <Button
                      variant={!isPreview ? "default" : "outline"}
                      onClick={() => setIsPreview(false)}
                      className="flex-1"
                    >
                      Teste
                    </Button>
                  </div>
                </div>
              )}

              {clientes.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Você precisa criar um cliente primeiro para gerar formulários de captura.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Preview/Teste do Formulário */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                {isPreview ? "Preview" : "Teste do Formulário"}
              </CardTitle>
              <CardDescription>
                {isPreview 
                  ? "Visualize como o formulário aparecerá para seus leads"
                  : "Teste o formulário para verificar se está funcionando"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedCliente ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome completo *</Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                      required
                      placeholder="Seu nome completo"
                      disabled={isPreview}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      required
                      placeholder="seu@email.com"
                      disabled={isPreview}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input
                      id="telefone"
                      value={formData.telefone}
                      onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
                      placeholder="(11) 99999-9999"
                      disabled={isPreview}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="interesse">Como podemos ajudar?</Label>
                    <Textarea
                      id="interesse"
                      value={formData.interesse}
                      onChange={(e) => setFormData(prev => ({ ...prev, interesse: e.target.value }))}
                      placeholder="Conte-nos sobre seu interesse..."
                      rows={3}
                      disabled={isPreview}
                    />
                  </div>
                  
                  {!isPreview && (
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Enviando..." : "Enviar Interesse"}
                    </Button>
                  )}

                  {isPreview && (
                    <Button type="button" className="w-full" disabled>
                      Enviar Interesse
                    </Button>
                  )}
                </form>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Selecione um cliente para visualizar o formulário</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </Layout>
  );
};

export default Captura;