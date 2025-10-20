import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import WhatsAppSidebar from "@/components/whatsapp/WhatsAppSidebar";
import ConversationList from "@/components/whatsapp/ConversationList";
import ChatInterface from "@/components/whatsapp/ChatInterface";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const WhatsApp = () => {
  const { campanhaId } = useParams();
  const [selectedCampanhaId, setSelectedCampanhaId] = useState<string | undefined>(campanhaId);
  const [selectedConversationId, setSelectedConversationId] = useState<string | undefined>();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <Layout>
      <div className="flex h-[calc(100vh-4rem)] bg-background">
        {/* Sidebar - Campanhas, Configs, Templates */}
        <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} border-r transition-all duration-300`}>
          <WhatsAppSidebar
            selectedCampanhaId={selectedCampanhaId}
            onSelectCampanha={setSelectedCampanhaId}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        </div>

        {/* Lista de Conversas */}
        <div className="w-80 border-r bg-muted/20">
          <ConversationList
            campanhaId={selectedCampanhaId}
            selectedConversationId={selectedConversationId}
            onSelectConversation={setSelectedConversationId}
          />
        </div>

        {/* Área do Chat */}
        <div className="flex-1 bg-background">
          <ChatInterface conversationId={selectedConversationId} />
        </div>
      </div>
    </Layout>
  );
};

export default WhatsApp;
