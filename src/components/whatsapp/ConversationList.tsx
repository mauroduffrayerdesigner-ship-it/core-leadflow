import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ConversationListProps {
  campanhaId?: string;
  selectedConversationId?: string;
  onSelectConversation: (conversationId: string) => void;
}

interface Conversation {
  id: string;
  lead_id: string;
  last_message_at: string;
  last_message_content: string;
  last_message_direction: string;
  unread_count: number;
  status: string;
  lead: {
    nome: string;
    telefone: string;
  };
}

const ConversationList = ({ campanhaId, selectedConversationId, onSelectConversation }: ConversationListProps) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (campanhaId) {
      fetchConversations();
      subscribeToConversations();
    }
  }, [campanhaId]);

  const fetchConversations = async () => {
    if (!campanhaId) return;

    try {
      const { data, error } = await supabase
        .from("whatsapp_conversations")
        .select(`
          id,
          lead_id,
          last_message_at,
          last_message_content,
          last_message_direction,
          unread_count,
          status,
          leads:lead_id (
            nome,
            telefone
          )
        `)
        .eq("campanha_id", campanhaId)
        .eq("status", "active")
        .order("last_message_at", { ascending: false });

      if (error) throw error;

      const formattedData = data?.map(conv => ({
        ...conv,
        lead: Array.isArray(conv.leads) ? conv.leads[0] : conv.leads
      })) as Conversation[];

      setConversations(formattedData || []);
    } catch (error: any) {
      console.error("Erro ao carregar conversas:", error);
      toast.error("Erro ao carregar conversas");
    } finally {
      setLoading(false);
    }
  };

  const subscribeToConversations = () => {
    if (!campanhaId) return;

    const channel = supabase
      .channel(`conversations-${campanhaId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "whatsapp_conversations",
          filter: `campanha_id=eq.${campanhaId}`,
        },
        () => {
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.lead?.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.lead?.telefone?.includes(searchTerm)
  );

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatTimestamp = (timestamp: string) => {
    if (!timestamp) return "";
    try {
      return formatDistanceToNow(new Date(timestamp), {
        addSuffix: true,
        locale: ptBR,
      });
    } catch {
      return "";
    }
  };

  if (!campanhaId) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>Selecione uma campanha</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header com Busca */}
      <div className="p-4 border-b space-y-3">
        <h2 className="text-lg font-semibold">Conversas</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Lista de Conversas */}
      <ScrollArea className="flex-1">
        {loading ? (
          <div className="p-4 text-center text-muted-foreground">Carregando...</div>
        ) : filteredConversations.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            {searchTerm ? "Nenhuma conversa encontrada" : "Nenhuma conversa ativa"}
          </div>
        ) : (
          <div className="divide-y">
            {filteredConversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => onSelectConversation(conversation.id)}
                className={`w-full p-4 flex gap-3 hover:bg-accent transition-colors ${
                  selectedConversationId === conversation.id ? "bg-accent" : ""
                }`}
              >
                <Avatar>
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getInitials(conversation.lead?.nome || "?")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium truncate">
                      {conversation.lead?.nome || "Sem nome"}
                    </span>
                    {conversation.last_message_at && (
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(conversation.last_message_at)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm text-muted-foreground truncate">
                      {conversation.last_message_direction === "outbound" && "Você: "}
                      {conversation.last_message_content || "Sem mensagens"}
                    </p>
                    {conversation.unread_count > 0 && (
                      <Badge variant="default" className="shrink-0">
                        {conversation.unread_count}
                      </Badge>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ConversationList;
