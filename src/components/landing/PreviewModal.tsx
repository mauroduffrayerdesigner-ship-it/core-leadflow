import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import LandingPageRenderer from "./LandingPageRenderer";
import { X } from "lucide-react";

interface Cliente {
  id: string;
  nome: string;
  email: string;
  logo_url?: string;
  tema_id: number;
  webhook_url?: string;
}

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  temaId: number;
  clienteId: string;
}

const PreviewModal = ({ isOpen, onClose, temaId, clienteId }: PreviewModalProps) => {
  const [loading, setLoading] = useState(false);

  // Cliente mock para preview
  const clientePreview: Cliente = {
    id: clienteId,
    nome: "Sua Empresa",
    email: "contato@suaempresa.com",
    tema_id: temaId,
    logo_url: undefined,
    webhook_url: undefined,
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-full h-[90vh] p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">
              Preview do Tema
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <ScrollArea className="flex-1">
          <div className="w-full">
            <LandingPageRenderer 
              cliente={clientePreview} 
              isPreview={true}
            />
          </div>
        </ScrollArea>
        
        <div className="px-6 py-4 border-t bg-muted/50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Este é apenas um preview. O formulário não funcionará neste modo.
            </p>
            <Button onClick={onClose} variant="outline">
              Fechar Preview
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewModal;