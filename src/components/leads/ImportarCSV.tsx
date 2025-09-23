import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ImportarCSVProps {
  clienteId: string;
  onImportComplete: () => void;
}

const ImportarCSV = ({ clienteId, onImportComplete }: ImportarCSVProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string[][]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [mappings, setMappings] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.csv')) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um arquivo CSV.",
        variant: "destructive",
      });
      return;
    }

    setFile(selectedFile);
    parseCSV(selectedFile);
  };

  const parseCSV = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        toast({
          title: "Erro",
          description: "O arquivo CSV deve ter pelo menos uma linha de cabeçalho e uma linha de dados.",
          variant: "destructive",
        });
        return;
      }

      const csvHeaders = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      const csvData = lines.slice(1, 6).map(line => 
        line.split(',').map(cell => cell.trim().replace(/"/g, ''))
      );

      setHeaders(csvHeaders);
      setPreview(csvData);
      
      // Auto-mapear campos óbvios
      const autoMappings: Record<string, string> = {};
      csvHeaders.forEach((header, index) => {
        const lowerHeader = header.toLowerCase();
        if (lowerHeader.includes('nome') || lowerHeader === 'name') {
          autoMappings[index.toString()] = 'nome';
        } else if (lowerHeader.includes('email') || lowerHeader.includes('e-mail')) {
          autoMappings[index.toString()] = 'email';
        } else if (lowerHeader.includes('telefone') || lowerHeader.includes('phone') || lowerHeader.includes('cel')) {
          autoMappings[index.toString()] = 'telefone';
        } else if (lowerHeader.includes('interesse') || lowerHeader.includes('message') || lowerHeader.includes('observ')) {
          autoMappings[index.toString()] = 'interesse';
        }
      });
      setMappings(autoMappings);
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!file) return;

    const nomeIndex = Object.keys(mappings).find(key => mappings[key] === 'nome');
    const emailIndex = Object.keys(mappings).find(key => mappings[key] === 'email');

    if (!nomeIndex || !emailIndex) {
      toast({
        title: "Erro",
        description: "Nome e E-mail são campos obrigatórios. Configure o mapeamento corretamente.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());
        const dataLines = lines.slice(1);

        const leads = [];
        const telefoneIndex = Object.keys(mappings).find(key => mappings[key] === 'telefone');
        const interesseIndex = Object.keys(mappings).find(key => mappings[key] === 'interesse');

        for (const line of dataLines) {
          const cells = line.split(',').map(cell => cell.trim().replace(/"/g, ''));
          
          const nome = cells[parseInt(nomeIndex)]?.trim();
          const email = cells[parseInt(emailIndex)]?.trim();
          
          if (nome && email) {
            leads.push({
              cliente_id: clienteId,
              nome,
              email,
              telefone: telefoneIndex ? cells[parseInt(telefoneIndex)]?.trim() || null : null,
              interesse: interesseIndex ? cells[parseInt(interesseIndex)]?.trim() || null : null,
              origem: 'csv',
              status: 'novo',
            });
          }
        }

        if (leads.length === 0) {
          toast({
            title: "Erro",
            description: "Nenhum lead válido encontrado no arquivo.",
            variant: "destructive",
          });
          return;
        }

        const { error } = await supabase
          .from("leads")
          .insert(leads);

        if (error) throw error;

        toast({
          title: "Sucesso!",
          description: `${leads.length} leads importados com sucesso.`,
        });

        // Reset
        setFile(null);
        setPreview([]);
        setHeaders([]);
        setMappings({});
        if (fileInputRef.current) fileInputRef.current.value = '';
        
        onImportComplete();
      };
      reader.readAsText(file);
    } catch (error: any) {
      console.error("Erro ao importar leads:", error);
      toast({
        title: "Erro",
        description: "Não foi possível importar os leads. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreview([]);
    setHeaders([]);
    setMappings({});
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Importar Leads via CSV
        </CardTitle>
        <CardDescription>
          Faça upload de um arquivo CSV para importar leads em massa
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!file ? (
          <div>
            <Label htmlFor="csv-file">Selecionar arquivo CSV</Label>
            <Input
              id="csv-file"
              type="file"
              accept=".csv"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="mt-2"
            />
            
            <Alert className="mt-4">
              <FileText className="h-4 w-4" />
              <AlertDescription>
                O arquivo deve estar no formato CSV com colunas separadas por vírgula. 
                Certifique-se de incluir pelo menos as colunas Nome e E-mail.
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="font-medium">{file.name}</span>
              </div>
              <Button variant="outline" size="sm" onClick={clearFile}>
                Remover
              </Button>
            </div>

            {headers.length > 0 && (
              <div>
                <h3 className="font-medium mb-3">Mapeamento de Colunas</h3>
                <div className="grid gap-3">
                  {headers.map((header, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-1/3">
                        <Label className="text-sm font-medium">{header}</Label>
                      </div>
                      <div className="w-2/3">
                        <Select
                          value={mappings[index.toString()] || ""}
                          onValueChange={(value) => 
                            setMappings({...mappings, [index.toString()]: value})
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Mapear para..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">-- Não mapear --</SelectItem>
                            <SelectItem value="nome">Nome (obrigatório)</SelectItem>
                            <SelectItem value="email">E-mail (obrigatório)</SelectItem>
                            <SelectItem value="telefone">Telefone</SelectItem>
                            <SelectItem value="interesse">Interesse/Observações</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {preview.length > 0 && (
              <div>
                <h3 className="font-medium mb-3">Preview dos Dados</h3>
                <div className="border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted">
                        <tr>
                          {headers.map((header, index) => (
                            <th key={index} className="px-3 py-2 text-left font-medium">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {preview.map((row, rowIndex) => (
                          <tr key={rowIndex} className="border-t">
                            {row.map((cell, cellIndex) => (
                              <td key={cellIndex} className="px-3 py-2">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Mostrando apenas as primeiras 5 linhas
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <Button onClick={handleImport} disabled={loading || !Object.values(mappings).includes('nome') || !Object.values(mappings).includes('email')}>
                {loading ? "Importando..." : "Importar Leads"}
              </Button>
              <Button variant="outline" onClick={clearFile}>
                Cancelar
              </Button>
            </div>

            {(!Object.values(mappings).includes('nome') || !Object.values(mappings).includes('email')) && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Configure o mapeamento para Nome e E-mail antes de importar.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImportarCSV;