import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Target, BarChart3, Zap, CheckCircle, Users, Globe, TrendingUp } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header />
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-20">
          <Badge variant="secondary" className="mb-4 text-sm font-medium">
            🚀 Plataforma SaaS Completa
          </Badge>
          <div className="flex justify-center mb-8">
            <img src="/favicon.svg" alt="CORE" className="h-20 w-20" />
          </div>
          <div className="text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
            Plataforma de Marketing e Venda
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground leading-tight">
            Capture leads com
            <span className="text-secondary"> conversão máxima</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
            Plataforma SaaS completa para gerar landing pages otimizadas, capturar leads qualificados 
            e automatizar todo o processo de vendas do seu negócio.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 py-6 group">
              <Link to="/auth">
                Começar Gratuitamente
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
              <Link to="/auth">Ver Demo</Link>
            </Button>
          </div>

          {/* Social Proof */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-secondary" />
              <span>Sem cartão de crédito</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-secondary" />
              <span>+1000 empresas confiam</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-secondary" />
              <span>95% de satisfação</span>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-20">
          <div className="group text-center p-8 bg-card rounded-xl border hover:border-secondary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className="w-16 h-16 bg-gradient-to-br from-secondary to-secondary/70 rounded-xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Target className="h-8 w-8 text-black" />
            </div>
            <h3 className="text-xl font-bold mb-3">Landing Pages Otimizadas</h3>
            <p className="text-muted-foreground leading-relaxed">
              Páginas de captura automáticas com design focado em conversão e temas profissionais
            </p>
          </div>

          <div className="group text-center p-8 bg-card rounded-xl border hover:border-accent/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent/70 rounded-xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BarChart3 className="h-8 w-8 text-black" />
            </div>
            <h3 className="text-xl font-bold mb-3">Analytics Avançado</h3>
            <p className="text-muted-foreground leading-relaxed">
              Dashboard completo com métricas detalhadas, insights de performance e relatórios
            </p>
          </div>

          <div className="group text-center p-8 bg-card rounded-xl border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3">Integração Total</h3>
            <p className="text-muted-foreground leading-relaxed">
              Webhooks, N8N, notificações automáticas e exportação de leads em tempo real
            </p>
          </div>
        </div>

        {/* Additional Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-20">
          <div className="text-center p-6 bg-card/50 rounded-lg border border-dashed">
            <Globe className="h-10 w-10 text-secondary mx-auto mb-3" />
            <h4 className="font-semibold mb-2">Domínio Personalizado</h4>
            <p className="text-sm text-muted-foreground">Use seu próprio domínio</p>
          </div>
          <div className="text-center p-6 bg-card/50 rounded-lg border border-dashed">
            <Target className="h-10 w-10 text-accent mx-auto mb-3" />
            <h4 className="font-semibold mb-2">Múltiplos Temas</h4>
            <p className="text-sm text-muted-foreground">Templates profissionais</p>
          </div>
          <div className="text-center p-6 bg-card/50 rounded-lg border border-dashed">
            <BarChart3 className="h-10 w-10 text-primary mx-auto mb-3" />
            <h4 className="font-semibold mb-2">Métricas em Tempo Real</h4>
            <p className="text-sm text-muted-foreground">Acompanhe conversões</p>
          </div>
          <div className="text-center p-6 bg-card/50 rounded-lg border border-dashed">
            <Zap className="h-10 w-10 text-secondary mx-auto mb-3" />
            <h4 className="font-semibold mb-2">Automação Completa</h4>
            <p className="text-sm text-muted-foreground">Workflows automatizados</p>
          </div>
        </div>

        {/* CTA Final */}
        <div className="text-center bg-gradient-to-r from-secondary/10 to-accent/10 rounded-2xl p-12 border">
          <h2 className="text-3xl font-bold mb-4">Pronto para acelerar seus resultados?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de empresas que já transformaram seus leads em clientes.
          </p>
          <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90 text-black text-lg px-8 py-6">
            <Link to="/auth">
              Começar Agora - É Grátis
            </Link>
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
