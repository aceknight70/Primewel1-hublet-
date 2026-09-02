import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  Layers,
  PlusCircle,
  ShieldCheck,
  TrendingUp,
  ShoppingBag,
  ExternalLink,
  Lock,
  Globe,
  Database,
  ArrowRight,
  Server,
  Zap,
  DollarSign,
  FileCode,
  Users,
  CheckCircle2,
  Copy,
} from 'lucide-react';

export const MasterOverview: React.FC = () => {
  const {
    allSkins,
    redemptions,
    pilotBusinesses,
    currentUser,
    addNewSkin,
    addBusiness,
    navigate,
    setIsRlsModalOpen,
    setIsPosModalOpen,
  } = useApp();

  const [isNewSkinModalOpen, setIsNewSkinModalOpen] = useState(false);
  const [isNewBizModalOpen, setIsNewBizModalOpen] = useState(false);
  const [newBizName, setNewBizName] = useState('');
  const [newBizSlug, setNewBizSlug] = useState('');
  const [newBizIndustry, setNewBizIndustry] = useState('');

  const [newDisplayName, setNewDisplayName] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [newTagline, setNewTagline] = useState('');
  const [newCuratorName, setNewCuratorName] = useState('');
  const [newPrimaryColor, setNewPrimaryColor] = useState('#0F172A');
  const [newAccentColor, setNewAccentColor] = useState('#38BDF8');
  
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const handleCopyLink = (e: React.MouseEvent, slug: string) => {
    e.stopPropagation();
    const url = `${window.location.origin}/?store=${slug}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedSlug(slug);
      setTimeout(() => setCopiedSlug(null), 2000);
    });
  };

  // Cross-skin aggregate computations
  const totalEcosystemVolume = redemptions.reduce((acc, r) => acc + r.grossAmountNgn, 0);
  const totalEcosystemCommission = redemptions.reduce((acc, r) => acc + r.commissionAmountNgn, 0);
  const totalEcosystemRedemptions = redemptions.length;

  const isMaster = currentUser.role === 'master';

  const handleDeploySkin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDisplayName || !newSlug) return;
    await addNewSkin({
      displayName: newDisplayName,
      slug: newSlug,
      tagline: newTagline || 'Exclusive Verified Affiliate Network',
      curatorName: newCuratorName || 'Lead Curator',
      primaryColor: newPrimaryColor,
      secondaryColor: '#1E293B',
      accentColor: newAccentColor,
      goldAccent: '#F59E0B',
    });
    setIsNewSkinModalOpen(false);
    setNewDisplayName('');
    setNewSlug('');
    setNewTagline('');
    setNewCuratorName('');
  };

  const handleAddBiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBizName || !newBizSlug) return;
    await addBusiness({
      name: newBizName,
      slug: newBizSlug,
      industry: newBizIndustry || 'General Retail',
    });
    setIsNewBizModalOpen(false);
    setNewBizName('');
    setNewBizSlug('');
    setNewBizIndustry('');
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 sm:px-6 lg:px-8 text-slate-100">
      <div className="mx-auto max-w-7xl space-y-8">
        
        <div className="pt-2 pb-4">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight">
            Master Overview
          </h1>
        </div>

        {isMaster && (
          <>
            {/* Master Top Control Banner */}
            <div className="relative overflow-hidden rounded-3xl border border-purple-500/30 bg-gradient-to-r from-purple-950/60 via-slate-900 to-slate-950 p-6 sm:p-8 shadow-2xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/20 px-3 py-1 text-xs font-bold text-purple-300 border border-purple-500/40 mb-2 font-mono">
                    <Building2 className="h-3.5 w-3.5" />
                    ESGMC & FATap-CT Master Overview • Root Backbone
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-black text-white">
                    Universal Affiliate Hub — Multi-Tenant Master
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                    One universal backend engine, path-based skin resolution. Deploying a new skin adds an <code className="bg-purple-950 px-1 py-0.5 rounded text-purple-300 font-mono">affhub_clients</code> record with an isolated directory, requiring zero codebase rebuilds.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setIsNewBizModalOpen(true)}
                    className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-amber-500 transition shadow-lg shadow-amber-950/50 cursor-pointer"
                  >
                    <PlusCircle className="h-4 w-4" />
                    <span>Add Pilot Business</span>
                  </button>
                  <button
                    id="deploy-new-skin-btn"
                    onClick={() => setIsNewSkinModalOpen(true)}
                    className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-purple-500 transition shadow-lg shadow-purple-950/50 cursor-pointer"
                  >
                    <PlusCircle className="h-4 w-4" />
                    <span>Deploy New Skin</span>
                  </button>

                  <button
                    onClick={() => setIsRlsModalOpen(true)}
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-800 border border-slate-700 px-3.5 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition cursor-pointer"
                  >
                    <Lock className="h-3.5 w-3.5 text-blue-400" />
                    <span>RLS Security Test</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Global Ecosystem Health Metrics */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <div className="text-xs text-slate-400 font-semibold flex items-center justify-between">
                  <span>Total Ecosystem GMV</span>
                  <DollarSign className="h-4 w-4 text-emerald-400" />
                </div>
                <div className="mt-2 text-2xl font-black text-white">
                  ₦{totalEcosystemVolume.toLocaleString()}
                </div>
                <p className="mt-1 text-[11px] text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Cross-skin gross redemptions
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <div className="text-xs text-slate-400 font-semibold flex items-center justify-between">
                  <span>Active Hub Skins</span>
                  <Layers className="h-4 w-4 text-purple-400" />
                </div>
                <div className="mt-2 text-2xl font-black text-white">
                  {allSkins.length} Active Skins
                </div>
                <p className="mt-1 text-[11px] text-purple-400">Path-based isolated directories</p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <div className="text-xs text-slate-400 font-semibold flex items-center justify-between">
                  <span>Pilot POS Redemptions</span>
                  <ShoppingBag className="h-4 w-4 text-amber-400" />
                </div>
                <div className="mt-2 text-2xl font-black text-white">
                  {totalEcosystemRedemptions} Transactions
                </div>
                <p className="mt-1 text-[11px] text-amber-400">Table: promo_redemptions (unprefixed)</p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <div className="text-xs text-slate-400 font-semibold flex items-center justify-between">
                  <span>Total Affiliate Payouts</span>
                  <TrendingUp className="h-4 w-4 text-blue-400" />
                </div>
                <div className="mt-2 text-2xl font-black text-white">
                  ₦{totalEcosystemCommission.toLocaleString()}
                </div>
                <p className="mt-1 text-[11px] text-blue-400">Accrued across all curators</p>
              </div>
            </div>
          </>
        )}

        {/* Multi-Tenant Skins Matrix */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers className="h-5 w-5 text-purple-400" />
                <span>Deployed Hub Skins & Exclusive Directories</span>
              </h2>
              <p className="text-xs text-slate-400">
                Each skin resolves independently on its URL path. Affiliates from PrimeWell are never visible under Bright Future or other skins.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {allSkins.map(skin => {
              const isPrimeWell = skin.slug === 'primewell';
              return (
                <div
                  key={skin.id}
                  onClick={() => navigate(`/?store=${skin.slug}`)}
                  className="group relative flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-950 p-6 transition hover:border-purple-500/50 hover:shadow-xl cursor-pointer"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-xl font-bold shadow"
                          style={{
                            backgroundColor: skin.brandTheme.primaryColor,
                            color: skin.brandTheme.accentColor,
                          }}
                        >
                          {isPrimeWell ? 'PW' : skin.displayName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition">
                            {skin.displayName}
                          </h3>
                          <span className="font-mono text-xs text-amber-400 font-bold">
                            /{skin.slug}
                          </span>
                        </div>
                      </div>

                      <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 uppercase">
                        {skin.status}
                      </span>
                    </div>

                    <p className="mt-3 text-xs text-slate-300 leading-relaxed">
                      {skin.tagline}
                    </p>

                    <div className="mt-4 rounded-xl bg-slate-900/80 p-3 border border-slate-800/80 space-y-1.5 text-xs text-slate-400">
                      <div className="flex justify-between">
                        <span>Managing Curator:</span>
                        <strong className="text-white">{skin.curatorName}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Database Client ID:</span>
                        <span className="font-mono text-[10px] text-purple-300">{skin.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Active Affiliates:</span>
                        <strong className="text-amber-400">{skin.totalAffiliatesCount || 0} Curators</strong>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-2 pt-3 border-t border-slate-800">
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate(`/?store=${skin.slug}`); }}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition cursor-pointer"
                    >
                      <Globe className="h-3.5 w-3.5 text-amber-400" />
                      <span>Visit Public Hub</span>
                    </button>
                    <button
                      onClick={(e) => handleCopyLink(e, skin.slug)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition cursor-pointer"
                    >
                      {copiedSlug === skin.slug ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5 text-slate-400" />
                          <span>Copy Link</span>
                        </>
                      )}
                    </button>
                    {isMaster && (
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/manager?store=${skin.slug}`); }}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-purple-600/30 border border-purple-500/30 px-3 py-2 text-xs font-semibold text-purple-300 hover:bg-purple-600/50 transition cursor-pointer"
                      >
                        <ShieldCheck className="h-3.5 w-3.5" />
                        <span>Manager Desk</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {isMaster && (
          <>
            {/* Universal Redemptions Engine Log (deliberately unprefixed: promo_redemptions) */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Database className="h-5 w-5 text-amber-400" />
                    <span>Universal Cross-Skin Ingestion Log (Table: <code className="font-mono text-amber-400">promo_redemptions</code>)</span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Deliberately unprefixed per the brief: Written to directly by pilot partner POS terminals (HiTech, Jotra, O Frank) at the point of sale.
                  </p>
                </div>
                <button
                  onClick={() => setIsPosModalOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 px-3.5 py-1.5 text-xs font-bold text-amber-300 hover:bg-amber-500/30 transition cursor-pointer"
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  Simulate Store POS Checkout
                </button>
              </div>
              <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-800 bg-slate-900/90 text-slate-400 font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Timestamp</th>
                      <th className="px-4 py-3">Skin Origin</th>
                      <th className="px-4 py-3">Affiliate & Promo</th>
                      <th className="px-4 py-3">Pilot Business</th>
                      <th className="px-4 py-3">Order ID</th>
                      <th className="px-4 py-3">Gross Total</th>
                      <th className="px-4 py-3">Discount</th>
                      <th className="px-4 py-3">Commission</th>
                      <th className="px-4 py-3">Terminal ID</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {redemptions.map(r => (
                      <tr key={r.id} className="hover:bg-slate-900/60 transition">
                        <td className="px-4 py-3 text-[11px] text-slate-400 font-mono">
                          {new Date(r.redeemedAt).toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          <span className="rounded bg-purple-500/20 px-2 py-0.5 text-[10px] font-bold text-purple-300 font-mono uppercase">
                            {r.clientName}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-bold text-white">{r.affiliateName}</div>
                          <div className="font-mono text-[10px] text-amber-400 font-bold">{r.promoCode}</div>
                        </td>
                        <td className="px-4 py-3 text-slate-300 font-medium">{r.businessName}</td>
                        <td className="px-4 py-3 font-mono text-slate-400">{r.orderId}</td>
                        <td className="px-4 py-3 font-bold text-white">₦{r.grossAmountNgn.toLocaleString()}</td>
                        <td className="px-4 py-3 text-red-400">-₦{r.discountAmountNgn.toLocaleString()}</td>
                        <td className="px-4 py-3 font-bold text-emerald-400">+₦{r.commissionAmountNgn.toLocaleString()}</td>
                        <td className="px-4 py-3 font-mono text-[10px] text-slate-500">{r.posTerminalId}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Modal: Deploy New Skin */}
        {isNewSkinModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="w-full max-w-lg rounded-3xl border border-purple-500/40 bg-slate-900 p-6 sm:p-8 shadow-2xl space-y-4">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-base">
                <PlusCircle className="h-5 w-5" />
                <span>Deploy New Skin Instance (affhub_clients)</span>
              </div>
              <p className="text-xs text-slate-300">
                Spawns a new path-based instance with an exclusive affiliate directory and customizable branding colors.
              </p>

              <form onSubmit={handleDeploySkin} className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Display Name</label>
                    <input
                      type="text"
                      required
                      value={newDisplayName}
                      onChange={e => {
                        setNewDisplayName(e.target.value);
                        if (!newSlug) {
                          setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-'));
                        }
                      }}
                      placeholder="e.g. Vanguard Luxe Hub"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">URL Path Slug</label>
                    <input
                      type="text"
                      required
                      value={newSlug}
                      onChange={e => setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                      placeholder="e.g. vanguard"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-amber-400 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Tagline</label>
                  <input
                    type="text"
                    value={newTagline}
                    onChange={e => setNewTagline(e.target.value)}
                    placeholder="e.g. Curated High-End Lifestyle & Smart Living Affiliates"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Lead Curator Name</label>
                  <input
                    type="text"
                    value={newCuratorName}
                    onChange={e => setNewCuratorName(e.target.value)}
                    placeholder="e.g. Chief Emeka"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Primary Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={newPrimaryColor}
                        onChange={e => setNewPrimaryColor(e.target.value)}
                        className="h-8 w-12 rounded cursor-pointer bg-transparent"
                      />
                      <span className="font-mono text-slate-300">{newPrimaryColor}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Accent Highlight Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={newAccentColor}
                        onChange={e => setNewAccentColor(e.target.value)}
                        className="h-8 w-12 rounded cursor-pointer bg-transparent"
                      />
                      <span className="font-mono text-slate-300">{newAccentColor}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsNewSkinModalOpen(false)}
                    className="rounded-xl px-4 py-2.5 bg-slate-800 text-slate-300 hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl px-5 py-2.5 bg-purple-600 font-bold text-white hover:bg-purple-500 shadow-lg shadow-purple-950/60"
                  >
                    Deploy Skin Instance
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isNewBizModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl relative">
              <button 
                onClick={() => setIsNewBizModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                ✕
              </button>
              <h2 className="text-xl font-bold text-white mb-2">Register Pilot Business</h2>
              <p className="text-xs text-slate-400 mb-6">Add a new external business to the universal registry.</p>
              
              <form onSubmit={handleAddBiz} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Business Name (e.g. Raw Diamond Investments)</label>
                  <input 
                    required
                    value={newBizName}
                    onChange={(e) => setNewBizName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white" 
                    placeholder="Enter business name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Unique Slug (e.g. raw-diamond)</label>
                  <input 
                    required
                    value={newBizSlug}
                    onChange={(e) => setNewBizSlug(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white" 
                    placeholder="raw-diamond"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Industry / Category (e.g. Decor & Antiques)</label>
                  <input 
                    value={newBizIndustry}
                    onChange={(e) => setNewBizIndustry(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white" 
                    placeholder="General Retail"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsNewBizModalOpen(false)}
                    className="rounded-xl px-4 py-2.5 bg-slate-800 text-slate-300 hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl px-5 py-2.5 bg-amber-600 font-bold text-white hover:bg-amber-500 shadow-lg shadow-amber-950/60"
                  >
                    Register Business
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
