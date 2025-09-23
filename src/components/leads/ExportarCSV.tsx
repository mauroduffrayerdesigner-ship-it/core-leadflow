import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Download, Loader2 } from "lucide-react";

interface ExportarCSVProps {
  clienteId?: string;
}

const ExportarCSV = ({ clienteId }: ExportarCSVProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const exportarLeads = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("leads")
        .select(`
          nome,
          email,
          telefone,
          interesse,
          origem,
          status,
          data_criacao,
          clientes(nome)
        `)
        .order("data_criacao", { ascending: false });

      // Filtrar por cliente se especificado
      if (clienteId) {
        query = query.eq("cliente_id", clienteId);
      }

      const { data: leads, error } = await query;

      if (error) throw error;

      if (!leads || leads.length === 0) {
        toast({
          title: "Nenhum lead encontrado",
          description: "Não há leads para exportar.",
          variant: "destructive",
        });
        return;
      }

      // Converter para CSV
      const csvHeaders = [
        "Nome",
        "Email", 
        "Telefone",
        "Interesse",
        "Origem",
        "Status",
        "Data de Criação",
        "Cliente"
      ];

      const csvData = leads.map(lead => [
        lead.nome,
        lead.email,
        lead.telefone || "",
        lead.interesse || "",
        lead.origem || "",
        lead.status || "",
        new Date(lead.data_criacao).toLocaleDateString('pt-BR'),
        lead.clientes?.nome || ""
      ]);

      const csvContent = [
        csvHeaders.join(","),
        ...csvData.map(row => row.map(cell => `"${cell}"`).join(","))
      ].join("\n");

      // Download do arquivo
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `leads_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Exportação concluída",
        description: `${leads.length} leads exportados com sucesso.`,
      });

    } catch (error: any) {
      console.error("Erro ao exportar leads:", error);
      toast({
        title: "Erro na exportação",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={exportarLeads} 
      disabled={loading}
      variant="outline"
      size="sm"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <Download className="h-4 w-4 mr-2" />
      )}
      Exportar CSV
    </Button>
  );
};

export default ExportarCSV;