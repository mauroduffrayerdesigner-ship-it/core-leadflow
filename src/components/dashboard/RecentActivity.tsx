import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Clock, User, Mail, Target } from "lucide-react";

const activities = [
  {
    id: 1,
    type: "lead",
    title: "Novo lead capturado",
    description: "João Silva se cadastrou via Landing Page",
    time: "2 min atrás",
    icon: <User className="h-4 w-4" />,
    status: "new"
  },
  {
    id: 2,
    type: "email",
    title: "Email enviado",
    description: "Sequência de boas-vindas para Maria Santos",
    time: "15 min atrás",
    icon: <Mail className="h-4 w-4" />,
    status: "sent"
  },
  {
    id: 3,
    type: "conversion",
    title: "Lead convertido",
    description: "Pedro Costa se tornou cliente",
    time: "1 hora atrás",
    icon: <Target className="h-4 w-4" />,
    status: "converted"
  },
  {
    id: 4,
    type: "lead",
    title: "Novo lead capturado",
    description: "Ana Oliveira se cadastrou via formulário",
    time: "2 horas atrás",
    icon: <User className="h-4 w-4" />,
    status: "new"
  },
];

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
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-secondary" />
          Atividade Recente
        </CardTitle>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
};