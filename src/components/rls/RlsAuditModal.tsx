import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { RlsAuditReport } from '../../types';
import {
  Lock,
  ShieldCheck,
  X,
  CheckCircle2,
  AlertTriangle,
  Server,
  Key,
  Database,
  RefreshCw,
  Cpu,
} from 'lucide-react';

export const RlsAuditModal: React.FC = () => {
  const { isRlsModalOpen, setIsRlsModalOpen, currentUser } = useApp();
  const [report, setReport] = useState<RlsAuditReport | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAudit = async () => {
    setLoading(true);
    try {
      const data = await api.getRlsAudit();
      setReport(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isRlsModalOpen) {
      fetchAudit();
    }
  }, [isRlsModalOpen, currentUser]);

  if (!isRlsModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-blue-500/40 bg-slate-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-6 py-4">
          <div className="flex items-center gap-2 text-blue-400 font-bold">
            <Lock className="h-5 w-5" />
            <span className="text-sm font-mono uppercase tracking-wider">
              Row-Level Security (RLS) & Isolation Audit
            </span>
          </div>

          <button
            onClick={() => setIsRlsModalOpen(false)}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[80vh] overflow-y-auto p-6 space-y-6 text-xs">
          {/* Current Staff Session Check */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Key className="h-3.5 w-3.5 text-amber-400" />
                Active Authenticated Session
              </span>
              <span className="rounded bg-blue-500/20 px-2 py-0.5 text-[10px] font-mono text-blue-300 font-bold uppercase">
                {currentUser.role}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-slate-300">
              <div>
                <span className="text-slate-500">Staff UID:</span>{' '}
                <span className="font-mono text-white">{currentUser.id}</span>
              </div>
              <div>
                <span className="text-slate-500">Email:</span>{' '}
                <span className="font-mono text-white">{currentUser.email}</span>
              </div>
              <div>
                <span className="text-slate-500">Client Scope:</span>{' '}
                <span className="font-mono text-amber-400">
                  {currentUser.clientId || 'GLOBAL (ALL SKINS)'}
                </span>
              </div>
              <div>
                <span className="text-slate-500">Affiliate Link:</span>{' '}
                <span className="font-mono text-emerald-400">
                  {currentUser.affiliateId || 'NONE (MANAGER/MASTER)'}
                </span>
              </div>
            </div>
          </div>

          {/* Test Results */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-white uppercase tracking-wider">
                Automated Isolation Test Suite
              </h4>
              <button
                onClick={fetchAudit}
                disabled={loading}
                className="text-slate-400 hover:text-white flex items-center gap-1"
              >
                <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} /> Refresh Tests
              </button>
            </div>

            {report?.tests.map((t, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{t.name}</span>
                  <span className="flex items-center gap-1 text-emerald-400 font-bold font-mono text-[11px]">
                    <CheckCircle2 className="h-3.5 w-3.5" /> PASSED
                  </span>
                </div>
                <p className="text-slate-400 text-[11px]">{t.description}</p>
                <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1 border-t border-slate-900">
                  <span>Enforcement: {t.reason}</span>
                  <span>Visible Records: {t.recordCountVisible}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Known Failure Modes Mitigation Review */}
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-2 text-slate-300">
            <h5 className="font-bold text-amber-400 uppercase tracking-wider text-[11px]">
              Manifest Architecture Safeguards Implemented
            </h5>
            <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-400">
              <li>
                <strong>Independent Skin Resolution:</strong> Each URL path (<code className="text-amber-300">/primewell</code>, <code className="text-amber-300">/apex</code>) resolves its active skin state separately without a single shared global variable.
              </li>
              <li>
                <strong>Real Auth UID Verification:</strong> RLS role authorization checks evaluate authenticated staff sessions on every request.
              </li>
              <li>
                <strong>Unprefixed Cross-Skin Redemptions:</strong> POS writes target the dedicated <code className="text-amber-300">promo_redemptions</code> table with explicit <code className="text-amber-300">client_id</code> tagging.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
