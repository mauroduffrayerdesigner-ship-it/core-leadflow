import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Users, Target, TrendingUp, Calendar } from "lucide-react";

interface Metricas {
  totalLeads: number;
  leadsFormulario: number;
  leadsManual: number;
  leadsCsv: number;
  leadsN8n: number;
  leadsQualificados: number;
  leadsConvertidos: number;
  taxaConversao: number;
  taxaQualificacao: number;
}

interface MetricasCampanhaProps {
  campanhaId: string;
}

const MetricasCampanha = ({ campanhaId }: MetricasCampanhaProps) => {
  const [metricas, setMetricas] = useState<Metricas>({
    totalLeads: 0,
    leadsFormulario: 0,
    leadsManual: 0,
    leadsCsv: 0,
    leadsN8n: 0,
    leadsQualificados: 0,
    leadsConvertidos: 0,
    taxaConversao: 0,
    taxaQualificacao: 0,
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchMetricas();
  }, [campanhaId]);

  const fetchMetricas = async () => {
    try {
      // Buscar dados agregados da tabela metricas_campanha
      const { data: metricasData, error: metricasError } = await supabase
        .from("metricas_campanha")
        .select("*")
        .eq("campanha_id", campanhaId);

      if (metricasError) throw metricasError;

      // Agregar todas as métricas
      const totais = metricasData?.reduce(
        (acc, m) => ({
          totalLeads: acc.totalLeads + (m.total_leads || 0),
          leadsFormulario: acc.leadsFormulario + (m.leads_formulario || 0),
          leadsManual: acc.leadsManual + (m.leads_manual || 0),
          leadsCsv: acc.leadsCsv + (m.leads_csv || 0),
          leadsN8n: acc.leadsN8n + (m.leads_n8n || 0),
          leadsQualificados: acc.leadsQualificados + (m.leads_qualificados || 0),
          leadsConvertidos: acc.leadsConvertidos + (m.leads_convertidos || 0),
        }),
        {
          totalLeads: 0,
          leadsFormulario: 0,
          leadsManual: 0,
          leadsCsv: 0,
          leadsN8n: 0,
          leadsQualificados: 0,
          leadsConvertidos: 0,
        }
      ) || {
        totalLeads: 0,
        leadsFormulario: 0,
        leadsManual: 0,
        leadsCsv: 0,
        leadsN8n: 0,
        leadsQualificados: 0,
        leadsConvertidos: 0,
      };

      // Calcular taxas
      const taxaConversao = totais.totalLeads > 0
        ? (totais.leadsConvertidos / totais.totalLeads) * 100
        : 0;

      const taxaQualificacao = totais.totalLeads > 0
        ? (totais.leadsQualificados / totais.totalLeads) * 100
        : 0;

      setMetricas({
        ...totais,
        taxaConversao,
        taxaQualificacao,
      });
    } catch (error: any) {
      toast({
        title: "Erro ao carregar métricas",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metricas.totalLeads}</div>
            <p className="text-xs text-muted-foreground">
              Todos os leads capturados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Qualificados</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metricas.leadsQualificados}</div>
            <p className="text-xs text-muted-foreground">
              {metricas.taxaQualificacao.toFixed(1)}% do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Convertidos</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metricas.leadsConvertidos}</div>
            <p className="text-xs text-muted-foreground">
              {metricas.taxaConversao.toFixed(1)}% taxa de conversão
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Formulário</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metricas.leadsFormulario}</div>
            <p className="text-xs text-muted-foreground">
              Via landing page
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Origem dos Leads</CardTitle>
          <CardDescription>
            Distribuição por canal de captura
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">Formulário</p>
                <p className="text-xs text-muted-foreground">Landing page</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{metricas.leadsFormulario}</p>
                <p className="text-xs text-muted-foreground">
                  {metricas.totalLeads > 0
                    ? ((metricas.leadsFormulario / metricas.totalLeads) * 100).toFixed(1)
                    : 0}%
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">Manual</p>
                <p className="text-xs text-muted-foreground">Inserção manual</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{metricas.leadsManual}</p>
                <p className="text-xs text-muted-foreground">
                  {metricas.totalLeads > 0
                    ? ((metricas.leadsManual / metricas.totalLeads) * 100).toFixed(1)
                    : 0}%
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">CSV</p>
                <p className="text-xs text-muted-foreground">Importação</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{metricas.leadsCsv}</p>
                <p className="text-xs text-muted-foreground">
                  {metricas.totalLeads > 0
                    ? ((metricas.leadsCsv / metricas.totalLeads) * 100).toFixed(1)
                    : 0}%
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">N8N / Automação</p>
                <p className="text-xs text-muted-foreground">Via webhook</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{metricas.leadsN8n}</p>
                <p className="text-xs text-muted-foreground">
                  {metricas.totalLeads > 0
                    ? ((metricas.leadsN8n / metricas.totalLeads) * 100).toFixed(1)
                    : 0}%
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetricasCampanha;
