import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Cliente {
  id: string;
  nome: string;
  email: string;
  logo_url?: string;
  tema_id: number;
  webhook_url?: string;
}

interface LandingPageProps {
  cliente: Cliente;
  isPreview?: boolean;
}

const LandingPageRenderer = ({ cliente, isPreview = false }: LandingPageProps) => {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    interesse: "",
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isPreview) {
      toast({
        title: "Preview Mode",
        description: "Este é apenas um preview. O formulário não foi enviado.",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("leads")
        .insert({
          cliente_id: cliente.id,
          nome: formData.nome,
          email: formData.email,
          telefone: formData.telefone,
          interesse: formData.interesse,
          origem: "formulario",
        });

      if (error) throw error;

      // Enviar webhook se configurado
      if (cliente.webhook_url) {
        try {
          await fetch(cliente.webhook_url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              cliente_id: cliente.id,
              nome: formData.nome,
              email: formData.email,
              telefone: formData.telefone,
              interesse: formData.interesse,
              origem: "formulario",
              data_criacao: new Date().toISOString(),
            }),
          });
        } catch (webhookError) {
          console.error("Erro ao enviar webhook:", webhookError);
        }
      }

      toast({
        title: "Sucesso!",
        description: "Seus dados foram enviados com sucesso. Entraremos em contato em breve!",
      });

      setFormData({ nome: "", email: "", telefone: "", interesse: "" });
    } catch (error: any) {
      console.error("Erro ao enviar lead:", error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar seus dados. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderTema = () => {
    switch (cliente.tema_id) {
      case 1: // Moderno Minimalista
        return (
          <div className="min-h-screen bg-gradient-to-br from-background to-muted">
            <div className="container mx-auto px-4 py-12">
              <div className="max-w-4xl mx-auto text-center">
                {cliente.logo_url && (
                  <img
                    src={cliente.logo_url}
                    alt={cliente.nome}
                    className="h-16 mx-auto mb-8"
                  />
                )}
                <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Transforme seu Negócio
                </h1>
                <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
                  Descubra como nossa solução pode revolucionar seus resultados
                </p>
                
                <Card className="max-w-md mx-auto">
                  <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="nome">Nome completo</Label>
                        <Input
                          id="nome"
                          value={formData.nome}
                          onChange={(e) => setFormData({...formData, nome: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">E-mail</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="telefone">Telefone</Label>
                        <Input
                          id="telefone"
                          value={formData.telefone}
                          onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="interesse">Como podemos ajudar?</Label>
                        <Textarea
                          id="interesse"
                          value={formData.interesse}
                          onChange={(e) => setFormData({...formData, interesse: e.target.value})}
                          rows={3}
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Enviando..." : "Quero saber mais!"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );

      case 2: // Tech Startup
        return (
          <div className="min-h-screen bg-black text-white">
            <div className="container mx-auto px-4 py-12">
              <div className="max-w-6xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div>
                    {cliente.logo_url && (
                      <img
                        src={cliente.logo_url}
                        alt={cliente.nome}
                        className="h-12 mb-8"
                      />
                    )}
                    <h1 className="text-5xl md:text-7xl font-bold mb-6">
                      O Futuro é{" "}
                      <span className="text-secondary">Agora</span>
                    </h1>
                    <p className="text-xl text-gray-400 mb-8">
                      Tecnologia de ponta para revolucionar seu mercado
                    </p>
                    <div className="space-y-4 text-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-secondary rounded-full"></div>
                        <span>Inovação disruptiva</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-secondary rounded-full"></div>
                        <span>Escalabilidade garantida</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-secondary rounded-full"></div>
                        <span>ROI comprovado</span>
                      </div>
                    </div>
                  </div>
                  
                  <Card className="bg-gray-900 border-gray-800">
                    <CardContent className="p-8">
                      <h2 className="text-2xl font-bold mb-6 text-white">
                        Seja um Early Adopter
                      </h2>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                          placeholder="Seu nome"
                          value={formData.nome}
                          onChange={(e) => setFormData({...formData, nome: e.target.value})}
                          className="bg-gray-800 border-gray-700 text-white"
                          required
                        />
                        <Input
                          type="email"
                          placeholder="E-mail profissional"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="bg-gray-800 border-gray-700 text-white"
                          required
                        />
                        <Input
                          placeholder="Telefone"
                          value={formData.telefone}
                          onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                        <Textarea
                          placeholder="Conte-nos sobre seu desafio"
                          value={formData.interesse}
                          onChange={(e) => setFormData({...formData, interesse: e.target.value})}
                          className="bg-gray-800 border-gray-700 text-white"
                          rows={3}
                        />
                        <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90 text-black" disabled={loading}>
                          {loading ? "Enviando..." : "Reservar Demonstração"}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return renderTema1();
    }
  };

  const renderTema1 = () => renderTema();

  return renderTema();
};

export default LandingPageRenderer;