import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Sparkles, Terminal, Layers, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { activeSkin, activeView, setIsRlsModalOpen, setIsPosModalOpen, pilotBusinesses } = useApp();

  return (
    <footer id="app-universal-footer" className="mt-16 border-t border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Official Readiness & Reach Connector + Pilot Partners Banner */}
        <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900/90 via-slate-950 to-slate-900/90 p-5 shadow-xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-black uppercase tracking-wider text-amber-400 border border-amber-500/30">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Official Readiness And Reach Connector</span>
              </div>
              <h4 className="mt-2 text-sm sm:text-base font-bold text-white">
                Official Pilot Redemption Partners:
              </h4>
            </div>

            {/* Partner Chips */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {pilotBusinesses.map((biz) => {
                let emoji = '🏢';
                if (biz.slug === 'hitech') emoji = '⚡';
                if (biz.slug === 'jotra') emoji = '🛋️';
                if (biz.slug === 'ofrank') emoji = '🔊';
                if (biz.slug === 'raw-diamond') emoji = '💎';
                
                return (
                  <div key={biz.id} className="flex items-center gap-2 rounded-xl bg-slate-900/90 border border-amber-500/30 px-3 py-2 text-xs text-white shadow-sm">
                    <span className="text-base">{emoji}</span>
                    <div>
                      <span className="font-bold text-amber-300">{biz.name}</span>
                      <span className="text-[11px] text-slate-400 ml-1">
                        ({biz.industry.split(',')[0]})
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand & Developer Attribution */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 font-black text-xs">
                {activeSkin?.displayName ? activeSkin.displayName.slice(0, 2).toUpperCase() : 'AH'}
              </div>
              <span className="text-sm font-bold tracking-tight text-white">
                {activeSkin?.displayName || 'Affhub Prime'}
              </span>
              <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-400 border border-slate-700">
                v2.4 Pro
              </span>
            </div>

            {/* Prominent ESGMC and FATAP-CT Developer Attribution */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 text-xs text-slate-300">
              <span>Developed by</span>
              <span className="font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                ESGMC
              </span>
              <span>and</span>
              <span className="font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                FATAP-CT
              </span>
            </div>

            <p className="text-[11px] text-slate-300 max-w-md">
              Enterprise Multi-Tenant Affiliate Engine with Row-Level Security, ResponseWatch Audit, and POS Discount Validation.
            </p>
          </div>

          {/* Quick Hub Badges & System Tools */}
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <button
              id="footer-rls-audit-btn"
              onClick={() => setIsRlsModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-950/40 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-900/40 transition cursor-pointer"
              title="Inspect Row Level Security (RLS) Tenant Isolation"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>RLS Tenant Guard</span>
            </button>

            <button
              id="footer-pos-simulator-btn"
              onClick={() => setIsPosModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-950/40 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-900/40 transition cursor-pointer"
              title="Launch POS Terminal Promo Simulator"
            >
              <Terminal className="h-3.5 w-3.5 text-amber-400" />
              <span>POS Terminal</span>
            </button>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-8 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-300">
          <div>
            &copy; {new Date().getFullYear()} Affhub Architecture &middot; All Rights Reserved.
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 text-slate-200">
              Engineered by <strong className="text-amber-400">ESGMC & FATAP-CT</strong>
            </span>
            <span className="text-slate-700">&bull;</span>
            <span className="text-slate-200">Tenant: <span className="font-mono text-amber-300">/{activeSkin?.slug || 'primewell'}</span></span>
          </div>
        </div>
      </div>
    </footer>
  );
};
