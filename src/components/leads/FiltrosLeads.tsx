import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

interface Cliente {
  id: string;
  nome: string;
}

interface FiltrosLeadsProps {
  clientes: Cliente[];
  filtros: {
    origem: string;
    status: string;
    cliente_id: string;
    data_inicio: string;
    data_fim: string;
  };
  onFiltrosChange: (filtros: any) => void;
  onAplicar: () => void;
  onLimpar: () => void;
}

const FiltrosLeads = ({ 
  clientes, 
  filtros, 
  onFiltrosChange, 
  onAplicar, 
  onLimpar 
}: FiltrosLeadsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filtros
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-5">
          <div className="space-y-2">
            <Label>Cliente</Label>
            <Select value={filtros.cliente_id} onValueChange={(value) => onFiltrosChange({ ...filtros, cliente_id: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                {clientes.map((cliente) => (
                  <SelectItem key={cliente.id} value={cliente.id}>
                    {cliente.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Origem</Label>
            <Select value={filtros.origem} onValueChange={(value) => onFiltrosChange({ ...filtros, origem: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas</SelectItem>
                <SelectItem value="formulario">Formulário</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="n8n">N8N</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={filtros.status} onValueChange={(value) => onFiltrosChange({ ...filtros, status: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value="novo">Novo</SelectItem>
                <SelectItem value="qualificado">Qualificado</SelectItem>
                <SelectItem value="convertido">Convertido</SelectItem>
                <SelectItem value="descartado">Descartado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Data Início</Label>
            <Input
              type="date"
              value={filtros.data_inicio}
              onChange={(e) => onFiltrosChange({ ...filtros, data_inicio: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Data Fim</Label>
            <Input
              type="date"
              value={filtros.data_fim}
              onChange={(e) => onFiltrosChange({ ...filtros, data_fim: e.target.value })}
            />
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button onClick={onAplicar} variant="outline">
            Aplicar Filtros
          </Button>
          <Button onClick={onLimpar} variant="ghost">
            Limpar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FiltrosLeads;