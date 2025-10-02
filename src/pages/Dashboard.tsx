import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Users, Share2, BookOpen, BarChart3, TrendingUp, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import MetricasAvancadas from "@/components/dashboard/MetricasAvancadas";
import { StatCard } from "@/components/dashboard/StatCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentActivity } from "@/components/dashboard/RecentActivity";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalLeads: 0,
    leadsEsteMs: 0,
    totalClientes: 0,
    landingPagesAtivas: 0,
    taxaConversaoMedia: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Total de leads
      const { count: totalLeads } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true });

      // Leads este mês
      const inicioMes = new Date();
      inicioMes.setDate(1);
      inicioMes.setHours(0, 0, 0, 0);

      const { count: leadsEsteMs } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .gte("data_criacao", inicioMes.toISOString());

      // Total de campanhas ativas
      const { count: totalCampanhas } = await supabase
        .from("campanhas")
        .select("*", { count: "exact", head: true })
        .eq("status", "ativa");

      // Landing pages ativas (campanhas com tema configurado)
      const { count: landingPagesAtivas } = await supabase
        .from("campanhas")
        .select("*", { count: "exact", head: true })
        .not("tema_id", "is", null);

      // Calcular taxa de conversão média
      const { data: metricas } = await supabase
        .from("metricas_campanha")
        .select("total_leads, leads_convertidos");

      let taxaConversaoMedia = 0;
      if (metricas && metricas.length > 0) {
        const totalLeadsMetricas = metricas.reduce((acc, curr) => acc + curr.total_leads, 0);
        const totalConvertidos = metricas.reduce((acc, curr) => acc + curr.leads_convertidos, 0);
        taxaConversaoMedia = totalLeadsMetricas > 0 ? (totalConvertidos / totalLeadsMetricas) * 100 : 0;
      }

      setStats({
        totalLeads: totalLeads || 0,
        leadsEsteMs: leadsEsteMs || 0,
        totalClientes: totalCampanhas || 0,
        landingPagesAtivas: landingPagesAtivas || 0,
        taxaConversaoMedia,
      });
    } catch (error: any) {
      console.error("Erro ao buscar estatísticas:", error);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center mb-12">
          <div className="inline-block">
            <h1 className="text-5xl font-bold mb-4 gradient-bg-hero bg-clip-text text-transparent">
              Dashboard CORE Capture
            </h1>
          </div>
          <p className="text-xl text-muted-foreground mb-4">
            Sistema completo para captura de leads com landing pages otimizadas
          </p>
          <Badge variant="secondary" className="text-sm px-4 py-2 animate-pulse-slow">
            🚀 Sistema Ativo
          </Badge>
        </div>
        
        {/* Cards de Métricas com Design Aprimorado */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          <StatCard
            title="Total de Leads"
            value={stats.totalLeads}
            description="Todos os leads capturados"
            icon={<Users className="h-4 w-4" />}
            trend={{ value: 12, label: "vs mês anterior" }}
            className="shadow-brand-primary"
          />

          <StatCard
            title="Campanhas Ativas"
            value={stats.totalClientes}
            description="Campanhas em execução"
            icon={<Building className="h-4 w-4" />}
            trend={{ value: 25, label: "crescimento" }}
            className="shadow-brand-secondary"
          />

          <StatCard
            title="Leads Este Mês"
            value={stats.leadsEsteMs}
            description={`Novos leads em ${new Date().toLocaleDateString('pt-BR', { month: 'long' })}`}
            icon={<TrendingUp className="h-4 w-4" />}
            trend={{ value: 8, label: "vs mês anterior" }}
            className="shadow-brand-accent"
          />

          <StatCard
            title="Landing Pages"
            value={stats.landingPagesAtivas}
            description="Páginas ativas"
            icon={<Globe className="h-4 w-4" />}
            trend={{ value: 5, label: "novas este mês" }}
          />

          <StatCard
            title="Conversão Média"
            value={`${stats.taxaConversaoMedia.toFixed(1)}%`}
            description="Taxa de sucesso"
            icon={<BarChart3 className="h-4 w-4" />}
            trend={{ value: 3, label: "melhoria" }}
            className="shadow-glow"
          />
        </div>

        {/* Grid de Ações e Atividades */}
        <div className="grid gap-6 md:grid-cols-3">
          <QuickActions />
          <RecentActivity />
        </div>

        {/* Métricas Avançadas */}
        <Card className="glass-effect shadow-brand-secondary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <BarChart3 className="h-6 w-6 text-secondary" />
              Analytics Avançados
            </CardTitle>
            <CardDescription className="text-base">
              Visão completa das métricas de todas as campanhas em tempo real
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MetricasAvancadas />
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Button 
            size="lg" 
            className="h-24 flex-col gap-2"
            onClick={() => window.location.href = "/campanhas"}
          >
            <Building className="h-6 w-6" />
            Gerenciar Campanhas
          </Button>
          
          <Button 
            size="lg" 
            variant="outline"
            className="h-24 flex-col gap-2"
            onClick={() => window.location.href = "/leads"}
          >
            <Users className="h-6 w-6" />
            Ver Todos os Leads
          </Button>
          
          <Button 
            size="lg" 
            variant="outline"
            className="h-24 flex-col gap-2"
            onClick={() => window.location.href = "/captura"}
          >
            <Share2 className="h-6 w-6" />
            Criar Landing Page
          </Button>
          
          <Button 
            size="lg" 
            variant="outline"
            className="h-24 flex-col gap-2"
            onClick={() => window.open("https://docs.lovable.dev", "_blank")}
          >
            <BookOpen className="h-6 w-6" />
            Documentação
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;