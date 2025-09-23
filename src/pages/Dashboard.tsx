import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Users, Share2, BookOpen, BarChart3, TrendingUp, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import MetricasAvancadas from "@/components/dashboard/MetricasAvancadas";

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

      // Total de clientes
      const { count: totalClientes } = await supabase
        .from("clientes")
        .select("*", { count: "exact", head: true });

      // Landing pages ativas (clientes com tema configurado)
      const { count: landingPagesAtivas } = await supabase
        .from("clientes")
        .select("*", { count: "exact", head: true })
        .not("tema_id", "is", null);

      // Calcular taxa de conversão média
      const { data: metricas } = await supabase
        .from("metricas_cliente")
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
        totalClientes: totalClientes || 0,
        landingPagesAtivas: landingPagesAtivas || 0,
        taxaConversaoMedia,
      });
    } catch (error: any) {
      console.error("Erro ao buscar estatísticas:", error);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Dashboard CORE Capture</h1>
          <p className="text-muted-foreground">
            Plataforma SaaS completa para captura de leads com landing pages otimizadas
          </p>
          <Badge variant="secondary" className="mt-2">
            Sistema SaaS Ativo
          </Badge>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5 mb-8">
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Total de Leads
            </h3>
            <p className="text-3xl font-bold text-primary">{stats.totalLeads}</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <Building className="h-5 w-5 text-secondary" />
              Clientes Ativos
            </h3>
            <p className="text-3xl font-bold text-secondary">{stats.totalClientes}</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent" />
              Leads Este Mês
            </h3>
            <p className="text-3xl font-bold text-accent">{stats.leadsEsteMs}</p>
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <Globe className="h-5 w-5 text-muted-foreground" />
              Landing Pages
            </h3>
            <p className="text-3xl font-bold text-muted-foreground">{stats.landingPagesAtivas}</p>
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-green-600" />
              Conversão Média
            </h3>
            <p className="text-3xl font-bold text-green-600">{stats.taxaConversaoMedia.toFixed(1)}%</p>
          </div>
        </div>

        {/* Métricas Avançadas */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Analytics Avançados
              </CardTitle>
              <CardDescription>
                Visão completa das métricas de todos os clientes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MetricasAvancadas />
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Button 
            size="lg" 
            className="h-24 flex-col gap-2"
            onClick={() => window.location.href = "/clientes"}
          >
            <Building className="h-6 w-6" />
            Gerenciar Clientes
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