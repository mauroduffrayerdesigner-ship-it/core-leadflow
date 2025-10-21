import { Check, CheckCheck } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface MessageBubbleProps {
  message: {
    id: string;
    content: string;
    direction: string;
    timestamp: string;
    status: string;
    type: string;
    media_url?: string;
    read_at?: string;
    delivered_at?: string;
  };
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isOutbound = message.direction === "outbound";

  const formatTime = (timestamp: string) => {
    try {
      return format(new Date(timestamp), "HH:mm", { locale: ptBR });
    } catch {
      return "";
    }
  };

  const escapeHtml = (text: string) => {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  };

  const getStatusIcon = () => {
    if (message.read_at) {
      return <CheckCheck className="h-3 w-3 text-blue-500" />;
    }
    if (message.delivered_at) {
      return <CheckCheck className="h-3 w-3 text-muted-foreground" />;
    }
    if (message.status === "sent") {
      return <Check className="h-3 w-3 text-muted-foreground" />;
    }
    return null;
  };

  return (
    <div className={`flex ${isOutbound ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[70%] rounded-lg px-4 py-2 ${
          isOutbound
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground"
        }`}
      >
        {message.type === "image" && message.media_url && (
          <img
            src={message.media_url}
            alt="Imagem da mensagem"
            className="rounded mb-2 max-w-full"
          />
        )}
        
        <p className="whitespace-pre-wrap break-words">{escapeHtml(message.content)}</p>
        
        <div className={`flex items-center justify-end gap-1 mt-1 text-xs ${
          isOutbound ? "text-primary-foreground/70" : "text-muted-foreground"
        }`}>
          <span>{formatTime(message.timestamp)}</span>
          {isOutbound && getStatusIcon()}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
