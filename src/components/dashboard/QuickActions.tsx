import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Download, Settings, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export const QuickActions = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-secondary" />
          Ações Rápidas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button asChild className="w-full justify-start" variant="outline">
          <Link to="/campanhas">
            <Plus className="mr-2 h-4 w-4" />
            Nova Campanha
          </Link>
        </Button>
        
        <Button asChild className="w-full justify-start" variant="outline">
          <Link to="/leads">
            <Download className="mr-2 h-4 w-4" />
            Exportar Leads
          </Link>
        </Button>
        
        <Button asChild className="w-full justify-start" variant="outline">
          <Link to="/captura">
            <Settings className="mr-2 h-4 w-4" />
            Configurar Captura
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};