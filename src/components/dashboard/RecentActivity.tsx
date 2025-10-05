import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Clock, User, Mail, Target } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Activity {
  id: string;
  type: string;
  title: string;
  description: string;
  time: string;
  icon: React.ReactNode;
  status: string;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "new":
      return <Badge variant="secondary" className="text-xs">Novo</Badge>;
    case "sent":
      return <Badge variant="outline" className="text-xs">Enviado</Badge>;
    case "converted":
      return <Badge className="text-xs bg-secondary text-black">Convertido</Badge>;
    default:
      return null;
  }
};

export const RecentActivity = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentActivity();
  }, []);

  const fetchRecentActivity = async () => {
    try {
      // Buscar novos leads (últimas 24h)
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);

      const { data: recentLeads } = await supabase
        .from("leads")
        .select("id, nome, data_criacao, status")
        .gte("data_criacao", oneDayAgo.toISOString())
        .order("data_criacao", { ascending: false })
        .limit(5);

      // Buscar emails enviados (últimos 10)
      const { data: recentEmails } = await supabase
        .from("email_logs")
        .select("id, destinatario_nome, criado_em, status")
        .order("criado_em", { ascending: false })
        .limit(5);

      // Buscar leads convertidos recentemente
      const { data: convertedLeads } = await supabase
        .from("leads")
        .select("id, nome, data_atualizacao, status")
        .eq("status", "convertido")
        .order("data_atualizacao", { ascending: false })
        .limit(3);

      // Combinar e formatar atividades
      const formattedActivities: Activity[] = [];

      // Adicionar leads novos
      recentLeads?.forEach((lead) => {
        formattedActivities.push({
          id: lead.id,
          type: "lead",
          title: "Novo lead capturado",
          description: `${lead.nome} se cadastrou`,
          time: formatDistanceToNow(new Date(lead.data_criacao), { 
            addSuffix: true, 
            locale: ptBR 
          }),
          icon: <User className="h-4 w-4" />,
          status: "new",
        });
      });

      // Adicionar emails enviados
      recentEmails?.forEach((email) => {
        formattedActivities.push({
          id: email.id,
          type: "email",
          title: "Email enviado",
          description: `Email para ${email.destinatario_nome || "lead"}`,
          time: formatDistanceToNow(new Date(email.criado_em), { 
            addSuffix: true, 
            locale: ptBR 
          }),
          icon: <Mail className="h-4 w-4" />,
          status: "sent",
        });
      });

      // Adicionar conversões
      convertedLeads?.forEach((lead) => {
        formattedActivities.push({
          id: `conv-${lead.id}`,
          type: "conversion",
          title: "Lead convertido",
          description: `${lead.nome} se tornou cliente`,
          time: formatDistanceToNow(new Date(lead.data_atualizacao), { 
            addSuffix: true, 
            locale: ptBR 
          }),
          icon: <Target className="h-4 w-4" />,
          status: "converted",
        });
      });

      // Ordenar por tempo (mais recente primeiro)
      formattedActivities.sort((a, b) => {
        const timeA = a.time;
        const timeB = b.time;
        return timeA.localeCompare(timeB);
      });

      // Limitar a 8 atividades
      setActivities(formattedActivities.slice(0, 8));
    } catch (error) {
      console.error("Erro ao buscar atividades recentes:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-secondary" />
            Atividade Recente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Carregando atividades...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-secondary" />
          Atividade Recente
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhuma atividade recente
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-smooth">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-secondary/10 text-secondary">
                    {activity.icon}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{activity.title}</p>
                    {getStatusBadge(activity.status)}
                  </div>
                  <p className="text-xs text-muted-foreground">{activity.description}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
