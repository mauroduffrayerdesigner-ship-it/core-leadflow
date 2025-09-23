import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { CalendarDays, TrendingUp, Users, Target, Download } from "lucide-react";
import { format, subDays, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";

interface MetricaCliente {
  id: string;
  cliente_id: string;
  data_metrica: string;
  total_leads: number;
  leads_formulario: number;
  leads_manual: number;
  leads_csv: number;
  leads_n8n: number;
  leads_qualificados: number;
  leads_convertidos: number;
}

interface MetricasAvancadasProps {
  clienteId?: string;
}

const MetricasAvancadas = ({ clienteId }: MetricasAvancadasProps) => {
  const [metricas, setMetricas] = useState<MetricaCliente[]>([]);
  const [resumo, setResumo] = useState({
    totalLeads: 0,
    leadsHoje: 0,
    leadsSemana: 0,
    taxaConversao: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetricas();
  }, [clienteId]);

  const fetchMetricas = async () => {
    try {
      let query = supabase
        .from("metricas_cliente")
        .select("*")
        .gte("data_metrica", format(subDays(new Date(), 30), "yyyy-MM-dd"))
        .order("data_metrica", { ascending: true });

      if (clienteId) {
        query = query.eq("cliente_id", clienteId);
      }

      const { data, error } = await query;

      if (error) throw error;

      setMetricas(data || []);
      calcularResumo(data || []);
    } catch (error: any) {
      console.error("Erro ao buscar métricas:", error);
    } finally {
      setLoading(false);
    }
  };

  const calcularResumo = (dados: MetricaCliente[]) => {
    const hoje = format(new Date(), "yyyy-MM-dd");
    const ultimaSemana = format(subDays(new Date(), 7), "yyyy-MM-dd");

    const totalLeads = dados.reduce((acc, curr) => acc + curr.total_leads, 0);
    const leadsHoje = dados
      .filter(d => d.data_metrica === hoje)
      .reduce((acc, curr) => acc + curr.total_leads, 0);
    const leadsSemana = dados
      .filter(d => d.data_metrica >= ultimaSemana)
      .reduce((acc, curr) => acc + curr.total_leads, 0);
    
    const totalConvertidos = dados.reduce((acc, curr) => acc + curr.leads_convertidos, 0);
    const taxaConversao = totalLeads > 0 ? (totalConvertidos / totalLeads) * 100 : 0;

    setResumo({
      totalLeads,
      leadsHoje,
      leadsSemana,
      taxaConversao,
    });
  };

  const dadosGraficoPorOrigem = () => {
    const dados = metricas.reduce((acc, curr) => {
      acc.formulario += curr.leads_formulario;
      acc.manual += curr.leads_manual;
      acc.csv += curr.leads_csv;
      acc.n8n += curr.leads_n8n;
      return acc;
    }, { formulario: 0, manual: 0, csv: 0, n8n: 0 });

    return [
      { name: "Formulário", value: dados.formulario, color: "hsl(var(--primary))" },
      { name: "Manual", value: dados.manual, color: "hsl(var(--secondary))" },
      { name: "CSV", value: dados.csv, color: "hsl(var(--accent))" },
      { name: "N8N", value: dados.n8n, color: "hsl(var(--muted-foreground))" },
    ].filter(item => item.value > 0);
  };

  const dadosGraficoFunil = () => {
    const totais = metricas.reduce((acc, curr) => {
      acc.capturados += curr.total_leads;
      acc.qualificados += curr.leads_qualificados;
      acc.convertidos += curr.leads_convertidos;
      return acc;
    }, { capturados: 0, qualificados: 0, convertidos: 0 });

    return [
      { etapa: "Capturados", quantidade: totais.capturados },
      { etapa: "Qualificados", quantidade: totais.qualificados },
      { etapa: "Convertidos", quantidade: totais.convertidos },
    ];
  };

  const dadosGraficoTendencia = () => {
    return metricas.map(metrica => ({
      data: format(new Date(metrica.data_metrica), "dd/MM", { locale: ptBR }),
      leads: metrica.total_leads,
      convertidos: metrica.leads_convertidos,
    }));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-1/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cards de Resumo */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resumo.totalLeads}</div>
            <p className="text-xs text-muted-foreground">
              Últimos 30 dias
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leads Hoje</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{resumo.leadsHoje}</div>
            <p className="text-xs text-muted-foreground">
              Capturados hoje
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Esta Semana</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{resumo.leadsSemana}</div>
            <p className="text-xs text-muted-foreground">
              Últimos 7 dias
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resumo.taxaConversao.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Leads → Conversões
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Gráfico de Tendência */}
        <Card>
          <CardHeader>
            <CardTitle>Evolução de Leads</CardTitle>
            <CardDescription>Captura de leads por dia</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dadosGraficoTendencia()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="data" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="leads" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))" }}
                />
                <Line 
                  type="monotone" 
                  dataKey="convertidos" 
                  stroke="hsl(var(--secondary))" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--secondary))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico por Origem */}
        <Card>
          <CardHeader>
            <CardTitle>Leads por Origem</CardTitle>
            <CardDescription>Distribuição por canal de entrada</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dadosGraficoPorOrigem()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {dadosGraficoPorOrigem().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Funil de Conversão */}
      <Card>
        <CardHeader>
          <CardTitle>Funil de Conversão</CardTitle>
          <CardDescription>Jornada dos leads no processo</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dadosGraficoFunil()} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="etapa" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="quantidade" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Ações */}
      <div className="flex justify-end">
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Exportar Relatório
        </Button>
      </div>
    </div>
  );
};

export default MetricasAvancadas;