import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { QRCodeSVG } from "qrcode.react";

interface Cliente {
  id: string;
  nome: string;
  logo_url?: string;
  tema_id: number;
  webhook_url?: string;
  headline?: string;
  subtitulo?: string;
  texto_cta?: string;
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
      // Usar edge function para criar lead e enviar webhook
      const { data, error } = await supabase.functions.invoke('webhook-lead', {
        body: {
          cliente_id: cliente.id,
          nome: formData.nome,
          email: formData.email,
          telefone: formData.telefone || null,
          interesse: formData.interesse || null,
          origem: 'formulario'
        }
      });

      if (error) throw error;

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

  // Gerar URL da landing page
  const getLandingPageUrl = () => {
    if (isPreview) return window.location.origin + "/preview";
    return window.location.href;
  };

  const renderTema = () => {
    switch (cliente.tema_id) {
      case 1: // Moderno Minimalista
        return (
          <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="container mx-auto px-4 py-16">
              <div className="max-w-4xl mx-auto text-center">
                {cliente.logo_url && (
                  <img src={cliente.logo_url} alt={cliente.nome} className="h-16 mx-auto mb-8" />
                )}
                <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  {cliente.headline || "Simplicidade que Converte"}
                </h1>
                <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
                  {cliente.subtitulo || "Design clean e moderno focado em resultados. Menos é mais quando se trata de conversão."}
                </p>
                
                <Card className="max-w-md mx-auto shadow-2xl border-0">
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold mb-6">Comece Agora</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <Input
                        placeholder="Seu nome"
                        value={formData.nome}
                        onChange={(e) => setFormData({...formData, nome: e.target.value})}
                        className="h-12"
                        required
                      />
                      <Input
                        type="email"
                        placeholder="E-mail"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="h-12"
                        required
                      />
                      <Input
                        placeholder="Telefone"
                        value={formData.telefone}
                        onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                        className="h-12"
                      />
                      <Textarea
                        placeholder="Como podemos ajudar?"
                        value={formData.interesse}
                        onChange={(e) => setFormData({...formData, interesse: e.target.value})}
                        rows={3}
                      />
                      <Button type="submit" className="w-full h-12 text-lg bg-gray-900 hover:bg-gray-800" disabled={loading}>
                        {loading ? "Enviando..." : (cliente.texto_cta || "Quero saber mais!")}
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
          <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-blue-500/10"></div>
            <div className="container mx-auto px-4 py-12 relative">
              <div className="max-w-6xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div className="space-y-8">
                    {cliente.logo_url && (
                      <img src={cliente.logo_url} alt={cliente.nome} className="h-12" />
                    )}
                    <div>
                      <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
                        O Futuro é{" "}
                        <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                          Agora
                        </span>
                      </h1>
                      <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                        Tecnologia de ponta para revolucionar seu mercado. Seja parte da próxima grande inovação.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                        <h3 className="text-2xl font-bold text-green-400 mb-2">99.9%</h3>
                        <p className="text-gray-400">Uptime garantido</p>
                      </div>
                      <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                        <h3 className="text-2xl font-bold text-blue-400 mb-2">10x</h3>
                        <p className="text-gray-400">Mais eficiência</p>
                      </div>
                    </div>
                  </div>
                  
                  <Card className="bg-gray-900/80 border-gray-700 backdrop-blur-lg">
                    <CardContent className="p-8">
                      <h2 className="text-2xl font-bold mb-6 text-white">
                        🚀 Early Access
                      </h2>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                          placeholder="Nome"
                          value={formData.nome}
                          onChange={(e) => setFormData({...formData, nome: e.target.value})}
                          className="bg-gray-800 border-gray-600 text-white h-12"
                          required
                        />
                        <Input
                          type="email"
                          placeholder="E-mail profissional"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="bg-gray-800 border-gray-600 text-white h-12"
                          required
                        />
                        <Input
                          placeholder="Empresa"
                          value={formData.telefone}
                          onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                          className="bg-gray-800 border-gray-600 text-white h-12"
                        />
                        <Textarea
                          placeholder="Desafio atual"
                          value={formData.interesse}
                          onChange={(e) => setFormData({...formData, interesse: e.target.value})}
                          className="bg-gray-800 border-gray-600 text-white"
                          rows={3}
                        />
                        <Button type="submit" className="w-full h-12 bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-black font-bold" disabled={loading}>
                          {loading ? "Enviando..." : "Garantir Acesso"}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        );

      case 3: // Corporativo Elegante
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="container mx-auto px-4 py-16">
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-16">
                  {cliente.logo_url && (
                    <img src={cliente.logo_url} alt={cliente.nome} className="h-20 mx-auto mb-8" />
                  )}
                  <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900 leading-tight">
                    Excelência em <span className="text-blue-600">Resultados</span>
                  </h1>
                  <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                    Soluções corporativas de alta performance para empresas que buscam crescimento sustentável e inovação estratégica.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-16">
                  <div className="text-center p-8 bg-white rounded-xl shadow-lg">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Estratégia</h3>
                    <p className="text-gray-600">Planejamento estratégico personalizado</p>
                  </div>
                  <div className="text-center p-8 bg-white rounded-xl shadow-lg">
                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="w-8 h-8 bg-indigo-600 rounded-lg"></div>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Execução</h3>
                    <p className="text-gray-600">Implementação com excelência operacional</p>
                  </div>
                  <div className="text-center p-8 bg-white rounded-xl shadow-lg">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="w-8 h-8 bg-purple-600 rounded-lg"></div>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Resultados</h3>
                    <p className="text-gray-600">ROI comprovado e crescimento sustentável</p>
                  </div>
                </div>

                <Card className="max-w-lg mx-auto shadow-2xl border-0">
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold mb-6 text-center">Solicite uma Proposta</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          placeholder="Nome"
                          value={formData.nome}
                          onChange={(e) => setFormData({...formData, nome: e.target.value})}
                          className="h-12"
                          required
                        />
                        <Input
                          placeholder="Sobrenome"
                          className="h-12"
                        />
                      </div>
                      <Input
                        type="email"
                        placeholder="E-mail corporativo"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="h-12"
                        required
                      />
                      <Input
                        placeholder="Empresa"
                        value={formData.telefone}
                        onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                        className="h-12"
                      />
                      <Textarea
                        placeholder="Descreva seu projeto"
                        value={formData.interesse}
                        onChange={(e) => setFormData({...formData, interesse: e.target.value})}
                        rows={4}
                      />
                      <Button type="submit" className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700" disabled={loading}>
                        {loading ? "Enviando..." : "Solicitar Proposta"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );

      case 4: // Criativo Colorido
        return (
          <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 text-white overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-300/20 to-pink-300/20"></div>
            <div className="container mx-auto px-4 py-12 relative">
              <div className="max-w-6xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div className="space-y-8">
                    {cliente.logo_url && (
                      <img src={cliente.logo_url} alt={cliente.nome} className="h-16 filter brightness-0 invert" />
                    )}
                    <div>
                      <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
                        Criatividade em{" "}
                        <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                          Ação
                        </span>
                      </h1>
                      <p className="text-xl text-white/90 mb-8 leading-relaxed">
                        Desperte o potencial criativo do seu negócio com soluções vibrantes e inovadoras que fazem a diferença.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20">
                        <h3 className="text-3xl font-bold text-yellow-300 mb-2">∞</h3>
                        <p className="text-white/80">Possibilidades</p>
                      </div>
                      <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20">
                        <h3 className="text-3xl font-bold text-pink-300 mb-2">24/7</h3>
                        <p className="text-white/80">Suporte criativo</p>
                      </div>
                    </div>
                  </div>
                  
                  <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                    <CardContent className="p-8">
                      <h2 className="text-3xl font-bold mb-6 text-white text-center">
                        🎨 Liberte sua Criatividade
                      </h2>
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                          placeholder="Seu nome artístico"
                          value={formData.nome}
                          onChange={(e) => setFormData({...formData, nome: e.target.value})}
                          className="bg-white/20 border-white/30 text-white placeholder-white/70 h-12"
                          required
                        />
                        <Input
                          type="email"
                          placeholder="E-mail"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="bg-white/20 border-white/30 text-white placeholder-white/70 h-12"
                          required
                        />
                        <Input
                          placeholder="Instagram/Portfolio"
                          value={formData.telefone}
                          onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                          className="bg-white/20 border-white/30 text-white placeholder-white/70 h-12"
                        />
                        <Textarea
                          placeholder="Conte sobre seu projeto criativo"
                          value={formData.interesse}
                          onChange={(e) => setFormData({...formData, interesse: e.target.value})}
                          className="bg-white/20 border-white/30 text-white placeholder-white/70"
                          rows={3}
                        />
                        <Button type="submit" className="w-full h-12 bg-gradient-to-r from-yellow-300 to-pink-300 hover:from-yellow-400 hover:to-pink-400 text-purple-900 font-bold text-lg" disabled={loading}>
                          {loading ? "Criando..." : "✨ Vamos Criar Juntos"}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        );

      case 5: // E-commerce Focus
        return (
          <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100">
            <div className="container mx-auto px-4 py-12">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                  {cliente.logo_url && (
                    <img src={cliente.logo_url} alt={cliente.nome} className="h-16 mx-auto mb-8" />
                  )}
                  <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gray-900">
                    Vendas que <span className="text-orange-600">Convertem</span>
                  </h1>
                  <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                    Maximize suas vendas online com estratégias comprovadas de e-commerce e conversão otimizada.
                  </p>
                </div>

                <div className="grid md:grid-cols-4 gap-6 mb-16">
                  <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                    <div className="text-3xl font-bold text-orange-600 mb-2">+300%</div>
                    <p className="text-gray-600">Aumento em vendas</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                    <div className="text-3xl font-bold text-red-600 mb-2">98%</div>
                    <p className="text-gray-600">Taxa de satisfação</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                    <div className="text-3xl font-bold text-amber-600 mb-2">24h</div>
                    <p className="text-gray-600">Suporte ativo</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">5x</div>
                    <p className="text-gray-600">ROI médio</p>
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div className="space-y-8">
                    <h2 className="text-3xl font-bold text-gray-900">
                      🛒 Transforme Visitantes em Compradores
                    </h2>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">✓</span>
                        </div>
                        <span className="text-lg">Otimização de conversão científica</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">✓</span>
                        </div>
                        <span className="text-lg">Funis de venda automatizados</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">✓</span>
                        </div>
                        <span className="text-lg">Analytics avançados de vendas</span>
                      </div>
                    </div>
                  </div>

                  <Card className="shadow-2xl border-0">
                    <CardContent className="p-8">
                      <div className="bg-orange-600 text-white p-4 rounded-lg mb-6 text-center">
                        <h3 className="text-xl font-bold">🔥 OFERTA LIMITADA</h3>
                        <p>Consultoria gratuita por tempo limitado!</p>
                      </div>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                          placeholder="Seu nome"
                          value={formData.nome}
                          onChange={(e) => setFormData({...formData, nome: e.target.value})}
                          className="h-12"
                          required
                        />
                        <Input
                          type="email"
                          placeholder="E-mail"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="h-12"
                          required
                        />
                        <Input
                          placeholder="WhatsApp"
                          value={formData.telefone}
                          onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                          className="h-12"
                        />
                        <Textarea
                          placeholder="Qual seu negócio? Faturamento atual?"
                          value={formData.interesse}
                          onChange={(e) => setFormData({...formData, interesse: e.target.value})}
                          rows={3}
                        />
                        <Button type="submit" className="w-full h-12 text-lg bg-orange-600 hover:bg-orange-700" disabled={loading}>
                          {loading ? "Enviando..." : "🚀 Quero Vender Mais!"}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        );

      case 6: // Consultoria Premium
        return (
          <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
            <div className="container mx-auto px-4 py-16">
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-16">
                  {cliente.logo_url && (
                    <img src={cliente.logo_url} alt={cliente.nome} className="h-20 mx-auto mb-8 filter brightness-0 invert" />
                  )}
                  <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                    Consultoria <span className="bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">Premium</span>
                  </h1>
                  <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                    Soluções exclusivas para líderes visionários que buscam transformação estratégica e resultados excepcionais.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-16">
                  <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">👑</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-amber-400">Elite</h3>
                    <p className="text-gray-400">Atendimento exclusivo C-Level</p>
                  </div>
                  <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">⚡</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-amber-400">Resultados</h3>
                    <p className="text-gray-400">ROI comprovado em 90 dias</p>
                  </div>
                  <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🎯</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-amber-400">Estratégia</h3>
                    <p className="text-gray-400">Planejamento personalizado</p>
                  </div>
                </div>

                <Card className="max-w-lg mx-auto bg-gray-800/50 border-gray-700">
                  <CardContent className="p-8">
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold mb-2">Diagnóstico Executivo</h2>
                      <p className="text-gray-400">Análise estratégica completa</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          placeholder="Nome"
                          value={formData.nome}
                          onChange={(e) => setFormData({...formData, nome: e.target.value})}
                          className="bg-gray-700 border-gray-600 text-white h-12"
                          required
                        />
                        <Input
                          placeholder="Cargo"
                          className="bg-gray-700 border-gray-600 text-white h-12"
                        />
                      </div>
                      <Input
                        type="email"
                        placeholder="E-mail executivo"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white h-12"
                        required
                      />
                      <Input
                        placeholder="Empresa / Setor"
                        value={formData.telefone}
                        onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white h-12"
                      />
                      <Textarea
                        placeholder="Principal desafio estratégico"
                        value={formData.interesse}
                        onChange={(e) => setFormData({...formData, interesse: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                        rows={4}
                      />
                      <Button type="submit" className="w-full h-12 text-lg bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-black font-bold" disabled={loading}>
                        {loading ? "Enviando..." : "Solicitar Diagnóstico"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );

      case 6: // VSL Video
        return (
          <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
            <div className="container mx-auto px-4 py-12">
              <div className="max-w-5xl mx-auto">
                {cliente.logo_url && (
                  <div className="text-center mb-8">
                    <img src={cliente.logo_url} alt={cliente.nome} className="h-16 mx-auto filter brightness-0 invert" />
                  </div>
                )}
                
                <div className="text-center mb-12">
                  <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    {cliente.headline || "Assista Este Vídeo Importante"}
                  </h1>
                  <p className="text-xl text-gray-400 mb-8">
                    {cliente.subtitulo || "Descubra como transformar seus resultados nos próximos minutos"}
                  </p>
                </div>

                {/* Video Player Placeholder */}
                <div className="mb-12">
                  <div className="aspect-video bg-black rounded-xl overflow-hidden border-4 border-red-500/20 shadow-2xl">
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                      <div className="text-center">
                        <div className="w-24 h-24 mx-auto mb-4 bg-red-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-700 transition-all transform hover:scale-110">
                          <div className="w-0 h-0 border-l-[30px] border-l-white border-t-[18px] border-t-transparent border-b-[18px] border-b-transparent ml-2"></div>
                        </div>
                        <p className="text-gray-400">Clique para assistir o vídeo</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA Form */}
                <Card className="max-w-2xl mx-auto bg-gray-800/50 border-red-500/30 backdrop-blur">
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold mb-2 text-center text-white">
                      🎁 Garanta Seu Acesso Exclusivo
                    </h2>
                    <p className="text-center text-gray-400 mb-6">
                      Preencha abaixo e receba conteúdo especial
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <Input
                        placeholder="Seu nome completo"
                        value={formData.nome}
                        onChange={(e) => setFormData({...formData, nome: e.target.value})}
                        className="h-12 bg-gray-700 border-gray-600 text-white"
                        required
                      />
                      <Input
                        type="email"
                        placeholder="Seu melhor e-mail"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="h-12 bg-gray-700 border-gray-600 text-white"
                        required
                      />
                      <Input
                        placeholder="WhatsApp (opcional)"
                        value={formData.telefone}
                        onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                        className="h-12 bg-gray-700 border-gray-600 text-white"
                      />
                      <Button type="submit" className="w-full h-14 text-lg bg-red-600 hover:bg-red-700 font-bold" disabled={loading}>
                        {loading ? "Enviando..." : (cliente.texto_cta || "QUERO ACESSO AGORA!")}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* QR Code Section */}
                <div className="mt-16 text-center">
                  <p className="text-gray-400 mb-4">Compartilhe esta página:</p>
                  <div className="inline-block p-4 bg-white rounded-xl">
                    <QRCodeSVG value={getLandingPageUrl()} size={150} />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">{getLandingPageUrl()}</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 7: // Gift Bonus
        return (
          <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
            <div className="container mx-auto px-4 py-16">
              <div className="max-w-4xl mx-auto">
                {cliente.logo_url && (
                  <div className="text-center mb-8">
                    <img src={cliente.logo_url} alt={cliente.nome} className="h-16 mx-auto" />
                  </div>
                )}
                
                <div className="text-center mb-12">
                  <div className="inline-block px-6 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full text-black font-bold mb-4">
                    🎁 BÔNUS EXCLUSIVO
                  </div>
                  <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                    {cliente.headline || "Presente Especial Para Você"}
                  </h1>
                  <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
                    {cliente.subtitulo || "Cadastre-se agora e ganhe acesso imediato ao seu bônus exclusivo"}
                  </p>
                </div>

                {/* Gift Card Visual */}
                <div className="mb-12 relative">
                  <div className="bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500 rounded-3xl p-1 shadow-2xl transform hover:scale-105 transition-transform">
                    <div className="bg-white rounded-3xl p-12 text-center">
                      <div className="text-8xl mb-4">🎁</div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-2">Seu Bônus Exclusivo</h3>
                      <p className="text-lg text-gray-600 mb-4">Valor estimado: R$ 997,00</p>
                      <div className="inline-block px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-full text-xl">
                        100% GRÁTIS
                      </div>
                    </div>
                  </div>
                  {/* Ribbon */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-red-600 text-white px-8 py-2 rounded-full font-bold shadow-lg">
                      OFERTA LIMITADA
                    </div>
                  </div>
                </div>

                {/* Form */}
                <Card className="max-w-lg mx-auto shadow-2xl border-2 border-amber-300">
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold mb-6 text-center">
                      Resgatar Meu Bônus Agora
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <Input
                        placeholder="Nome completo"
                        value={formData.nome}
                        onChange={(e) => setFormData({...formData, nome: e.target.value})}
                        className="h-12 border-amber-300"
                        required
                      />
                      <Input
                        type="email"
                        placeholder="E-mail"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="h-12 border-amber-300"
                        required
                      />
                      <Input
                        placeholder="WhatsApp"
                        value={formData.telefone}
                        onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                        className="h-12 border-amber-300"
                      />
                      <Button type="submit" className="w-full h-14 text-lg bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold shadow-lg" disabled={loading}>
                        {loading ? "Enviando..." : (cliente.texto_cta || "🎁 RESGATAR BÔNUS GRÁTIS")}
                      </Button>
                    </form>
                    <p className="text-center text-sm text-gray-500 mt-4">
                      ✓ Acesso imediato após cadastro
                    </p>
                  </CardContent>
                </Card>

                {/* QR Code Section */}
                <div className="mt-16 text-center">
                  <p className="text-gray-600 mb-4 font-semibold">Compartilhe este presente:</p>
                  <div className="inline-block p-6 bg-white rounded-2xl shadow-xl border-2 border-amber-300">
                    <QRCodeSVG value={getLandingPageUrl()} size={150} />
                  </div>
                  <p className="text-sm text-gray-500 mt-3">{getLandingPageUrl()}</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="container mx-auto px-4 py-16">
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-5xl font-bold mb-6">Tema não encontrado</h1>
                <p className="text-xl text-gray-600 mb-12">
                  Por favor, selecione um tema válido para sua landing page.
                </p>
                
                {/* QR Code padrão */}
                <div className="mt-16">
                  <p className="text-gray-600 mb-4">URL desta página:</p>
                  <div className="inline-block p-4 bg-white rounded-xl shadow-lg">
                    <QRCodeSVG value={getLandingPageUrl()} size={150} />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">{getLandingPageUrl()}</p>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return renderTema();
};

export default LandingPageRenderer;