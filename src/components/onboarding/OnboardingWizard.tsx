import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Check, ChevronRight, Building, Target, Globe, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
}

export const OnboardingWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [clienteName, setClienteName] = useState("");
  const [clienteEmail, setClienteEmail] = useState("");
  const [campanhaNome, setCampanhaNome] = useState("");
  const [campanhaDesc, setCampanhaDesc] = useState("");
  const [clienteId, setClienteId] = useState<string | null>(null);
  const [campanhaId, setCampanhaId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [steps, setSteps] = useState<OnboardingStep[]>([
    {
      id: 1,
      title: "Criar Cliente",
      description: "Configure as informações básicas do seu negócio",
      icon: <Building className="h-6 w-6" />,
      completed: false
    },
    {
      id: 2,
      title: "Primeira Campanha",
      description: "Crie sua primeira campanha de captura de leads",
      icon: <Target className="h-6 w-6" />,
      completed: false
    },
    {
      id: 3,
      title: "Landing Page",
      description: "Configure sua landing page personalizada",
      icon: <Globe className="h-6 w-6" />,
      completed: false
    },
    {
      id: 4,
      title: "Compartilhar",
      description: "Obtenha o link e comece a capturar leads",
      icon: <Share2 className="h-6 w-6" />,
      completed: false
    }
  ]);

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleCreateCliente = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from("clientes")
        .insert({
          nome: clienteName,
          email: clienteEmail,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      setClienteId(data.id);
      markStepCompleted(0);
      setCurrentStep(1);

      toast({
        title: "Cliente criado!",
        description: "Agora vamos criar sua primeira campanha.",
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

  const handleCreateCampanha = async () => {
    if (!clienteId) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("campanhas")
        .insert({
          nome: campanhaNome,
          descricao: campanhaDesc,
          cliente_id: clienteId,
          status: 'ativa'
        })
        .select()
        .single();

      if (error) throw error;

      setCampanhaId(data.id);
      markStepCompleted(1);
      setCurrentStep(2);

      toast({
        title: "Campanha criada!",
        description: "Configure agora sua landing page.",
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

  const markStepCompleted = (stepIndex: number) => {
    setSteps(prev => prev.map((step, idx) => 
      idx === stepIndex ? { ...step, completed: true } : step
    ));
  };

  const handleSkipOnboarding = () => {
    localStorage.setItem('onboarding_completed', 'true');
    navigate('/dashboard');
  };

  const handleFinish = () => {
    localStorage.setItem('onboarding_completed', 'true');
    if (campanhaId) {
      navigate(`/campanha/${campanhaId}`);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <Badge variant="secondary">Passo {currentStep + 1} de {steps.length}</Badge>
            <Button variant="ghost" size="sm" onClick={handleSkipOnboarding}>
              Pular
            </Button>
          </div>
          <Progress value={progress} className="mb-4" />
          <CardTitle className="text-2xl">{steps[currentStep].title}</CardTitle>
          <CardDescription>{steps[currentStep].description}</CardDescription>
        </CardHeader>

        <CardContent>
          {/* Step 1: Criar Cliente */}
          {currentStep === 0 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cliente-nome">Nome do Negócio *</Label>
                <Input
                  id="cliente-nome"
                  value={clienteName}
                  onChange={(e) => setClienteName(e.target.value)}
                  placeholder="Ex: Minha Empresa LTDA"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cliente-email">Email de Contato *</Label>
                <Input
                  id="cliente-email"
                  type="email"
                  value={clienteEmail}
                  onChange={(e) => setClienteEmail(e.target.value)}
                  placeholder="contato@empresa.com"
                  required
                />
              </div>

              <Button 
                onClick={handleCreateCliente} 
                disabled={!clienteName || !clienteEmail || loading}
                className="w-full"
              >
                {loading ? "Criando..." : "Próximo"}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Step 2: Criar Campanha */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="campanha-nome">Nome da Campanha *</Label>
                <Input
                  id="campanha-nome"
                  value={campanhaNome}
                  onChange={(e) => setCampanhaNome(e.target.value)}
                  placeholder="Ex: Black Friday 2024"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="campanha-desc">Descrição (opcional)</Label>
                <Input
                  id="campanha-desc"
                  value={campanhaDesc}
                  onChange={(e) => setCampanhaDesc(e.target.value)}
                  placeholder="Descreva o objetivo desta campanha"
                />
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setCurrentStep(0)}>
                  Voltar
                </Button>
                <Button 
                  onClick={handleCreateCampanha} 
                  disabled={!campanhaNome || loading}
                  className="flex-1"
                >
                  {loading ? "Criando..." : "Próximo"}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Landing Page */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">
                  Sua campanha foi criada com sucesso! 
                </p>
                <p className="text-sm">
                  Você pode personalizar a landing page agora ou fazer isso depois.
                </p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setCurrentStep(1)}>
                  Voltar
                </Button>
                <Button 
                  onClick={() => {
                    markStepCompleted(2);
                    setCurrentStep(3);
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Personalizar Depois
                </Button>
                <Button 
                  onClick={() => {
                    markStepCompleted(2);
                    if (campanhaId) {
                      navigate(`/campanha/${campanhaId}`);
                    }
                  }}
                  className="flex-1"
                >
                  Personalizar Agora
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Compartilhar */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg text-center">
                <Check className="h-16 w-16 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">Tudo Pronto!</h3>
                <p className="text-muted-foreground mb-4">
                  Sua plataforma está configurada e pronta para capturar leads.
                </p>
                <div className="flex flex-col gap-2">
                  <Button onClick={handleFinish} size="lg" className="w-full">
                    Ir para Campanha
                  </Button>
                  <Button onClick={handleSkipOnboarding} variant="outline" size="lg" className="w-full">
                    Ir para Dashboard
                  </Button>
                </div>
              </div>

              {/* Checklist de Próximos Passos */}
              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-sm">Próximos Passos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    "Configure sua landing page",
                    "Personalize seus emails",
                    "Compartilhe o link da campanha",
                    "Acompanhe suas métricas"
                  ].map((step, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span>{step}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>

        {/* Progress Indicators */}
        <div className="px-6 pb-6">
          <div className="flex justify-center gap-2">
            {steps.map((step, idx) => (
              <div
                key={step.id}
                className={`h-2 w-2 rounded-full transition-all ${
                  idx <= currentStep ? 'bg-primary w-8' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};
