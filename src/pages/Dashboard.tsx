import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Building, Users, Share2, BookOpen } from "lucide-react";
import Layout from "@/components/Layout";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalLeads: 0,
    leadsEsteMs: 0,
    totalClientes: 0,
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

      setStats({
        totalLeads: totalLeads || 0,
        leadsEsteMs: leadsEsteMs || 0,
        totalClientes: totalClientes || 0,
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
            Bem-vindo ao seu dashboard de captura de leads!
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-2">Total de Leads</h3>
            <p className="text-3xl font-bold text-secondary">{stats.totalLeads}</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-2">Clientes Ativos</h3>
            <p className="text-3xl font-bold text-accent">{stats.totalClientes}</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-2">Leads Este Mês</h3>
            <p className="text-3xl font-bold text-primary">{stats.leadsEsteMs}</p>
          </div>
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
            Ver Leads
          </Button>
          
          <Button 
            size="lg" 
            variant="outline"
            className="h-24 flex-col gap-2"
            onClick={() => window.location.href = "/captura"}
          >
            <Share2 className="h-6 w-6" />
            Criar Formulário
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