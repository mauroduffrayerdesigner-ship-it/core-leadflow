import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import WhatsAppSidebar from "@/components/whatsapp/WhatsAppSidebar";
import ConversationList from "@/components/whatsapp/ConversationList";
import ChatInterface from "@/components/whatsapp/ChatInterface";
import WhatsAppConfigSheet from "@/components/whatsapp/WhatsAppConfigSheet";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const WhatsApp = () => {
  const { campanhaId } = useParams();
  const [selectedCampanhaId, setSelectedCampanhaId] = useState<string | undefined>(campanhaId);
  const [selectedConversationId, setSelectedConversationId] = useState<string | undefined>();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetTab, setSheetTab] = useState<'config' | 'templates' | 'history'>('config');

  const handleOpenConfig = () => {
    setSheetTab('config');
    setSheetOpen(true);
  };

  const handleOpenTemplates = () => {
    setSheetTab('templates');
    setSheetOpen(true);
  };

  const handleOpenHistory = () => {
    setSheetTab('history');
    setSheetOpen(true);
  };

  return (
    <Layout>
      <div className="flex h-[calc(100vh-4rem)] bg-background">
        {/* Sidebar - Campanhas, Configs, Templates */}
        <div className={`
          ${sidebarCollapsed ? 'w-16' : 'w-64'}
          border-r transition-all duration-300
          hidden md:block
        `}>
          <WhatsAppSidebar
            selectedCampanhaId={selectedCampanhaId}
            onSelectCampanha={setSelectedCampanhaId}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            onOpenConfig={handleOpenConfig}
            onOpenTemplates={handleOpenTemplates}
            onOpenHistory={handleOpenHistory}
          />
        </div>

        {/* Lista de Conversas */}
        <div className={`
          w-full md:w-80
          border-r bg-muted/20
          md:block
          ${selectedConversationId ? 'hidden md:block' : 'block'}
        `}>
          <ConversationList
            campanhaId={selectedCampanhaId}
            selectedConversationId={selectedConversationId}
            onSelectConversation={setSelectedConversationId}
          />
        </div>

        {/* Área do Chat */}
        <div className={`
          flex-1 bg-background
          ${selectedConversationId ? 'block' : 'hidden md:block'}
        `}>
          <ChatInterface conversationId={selectedConversationId} />
        </div>
      </div>

      {/* Sheet de Configurações */}
      <WhatsAppConfigSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        campanhaId={selectedCampanhaId}
        defaultTab={sheetTab}
      />
    </Layout>
  );
};

export default WhatsApp;
