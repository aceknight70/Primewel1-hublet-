import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { PublicSkinHub } from './components/public/PublicSkinHub';
import { AffiliatePortal } from './components/affiliate/AffiliatePortal';
import { ManagerPortal } from './components/manager/ManagerPortal';
import { MasterOverview } from './components/master/MasterOverview';
import { AffiliateDetailModal } from './components/public/AffiliateDetailModal';
import { PosTerminalSimulator } from './components/pos/PosTerminalSimulator';
import { RlsAuditModal } from './components/rls/RlsAuditModal';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeView, toastMessage } = useApp();

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950 flex flex-col justify-between">
      <div>
        {/* Universal Hub Header */}
        <Header />

        {/* Dynamic View Container */}
        <main>
          {activeView === 'public_skin' && <PublicSkinHub />}
          {activeView === 'affiliate_portal' && <AffiliatePortal />}
          {activeView === 'manager_portal' && <ManagerPortal />}
          {activeView === 'master_overview' && <MasterOverview />}
        </main>
      </div>

      {/* Universal Footer with Developer Attribution */}
      <Footer />

      {/* Global Action Modals */}
      <AffiliateDetailModal />
      <PosTerminalSimulator />
      <RlsAuditModal />

      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-200">
          <div className={`flex items-center gap-2.5 rounded-2xl px-4 py-3 text-xs font-semibold shadow-2xl backdrop-blur-xl border ${
            toastMessage.type === 'success'
              ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40 shadow-emerald-950/50'
              : toastMessage.type === 'error'
              ? 'bg-red-950/90 text-red-300 border-red-500/40 shadow-red-950/50'
              : 'bg-blue-950/90 text-blue-300 border-blue-500/40 shadow-blue-950/50'
          }`}>
            {toastMessage.type === 'success' && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
            {toastMessage.type === 'error' && <AlertCircle className="h-4 w-4 text-red-400" />}
            {toastMessage.type === 'info' && <Info className="h-4 w-4 text-blue-400" />}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
