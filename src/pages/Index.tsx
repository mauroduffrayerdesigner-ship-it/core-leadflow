import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="text-5xl font-bold mb-6">
            <span className="text-primary">CORE</span>
            <span className="text-secondary"> Capture</span>
          </div>
          <h1 className="text-3xl font-bold mb-4 text-foreground">
            Capture leads com conversão máxima
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Plataforma SaaS completa para gerar landing pages otimizadas e capturar leads qualificados para o seu negócio.
          </p>
          
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link to="/auth">Começar Agora</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/auth">Fazer Login</Link>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center p-6 bg-card rounded-lg border">
            <div className="w-12 h-12 bg-secondary rounded-lg mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Landing Pages Otimizadas</h3>
            <p className="text-muted-foreground">
              Páginas de captura automáticas com design focado em conversão
            </p>
          </div>

          <div className="text-center p-6 bg-card rounded-lg border">
            <div className="w-12 h-12 bg-accent rounded-lg mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Analytics Completo</h3>
            <p className="text-muted-foreground">
              Dashboard com métricas detalhadas e insights de performance
            </p>
          </div>

          <div className="text-center p-6 bg-card rounded-lg border">
            <div className="w-12 h-12 bg-primary rounded-lg mx-auto mb-4 flex items-center justify-center text-primary-foreground">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Integração Automática</h3>
            <p className="text-muted-foreground">
              Notificações por email e exportação de leads em tempo real
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
