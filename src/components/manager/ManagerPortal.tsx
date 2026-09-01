import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AffhubAffiliate, CaseStatus, ResponseWatchCase } from '../../types';
import { ImageUploadModal } from '../common/ImageUploadModal';
import { SkinLogoCard } from '../public/SkinLogoCard';
import {
  ShieldCheck,
  Users,
  Activity,
  Award,
  Plus,
  Edit,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText,
  Sliders,
  DollarSign,
  TrendingUp,
  Download,
  Filter,
  Check,
  Search,
  ChevronRight,
  Eye,
  MessageSquare,
  Palette,
  Camera,
  FolderOpen,
  Sparkles,
} from 'lucide-react';

export const ManagerPortal: React.FC = () => {
  const {
    activeSkin,
    affiliates,
    responseCases,
    redemptions,
    pilotBusinesses,
    updateAffiliateProfile,
    updateSkinLogoOrTheme,
    resolveResponseCase,
    createMysteryAuditCase,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'affiliates' | 'branding' | 'response_watch' | 'business_config' | 'redemptions'>('affiliates');
  const [selectedCaseForReview, setSelectedCaseForReview] = useState<ResponseWatchCase | null>(null);
  const [isNewAuditModalOpen, setIsNewAuditModalOpen] = useState(false);

  // Affiliate photo editing
  const [editingAffiliatePhoto, setEditingAffiliatePhoto] = useState<AffhubAffiliate | null>(null);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);

  // New Audit State
  const [auditAffiliateId, setAuditAffiliateId] = useState(affiliates[0]?.id || '');
  const [auditBusinessId, setAuditBusinessId] = useState('biz-hitech');
  const [auditNotes, setAuditNotes] = useState('');
  const [auditSla, setAuditSla] = useState(2.0);

  // Resolve modal state
  const [reviewScore, setReviewScore] = useState(9.5);
  const [reviewRecordedHours, setReviewRecordedHours] = useState(0.5);
  const [reviewStatus, setReviewStatus] = useState<CaseStatus>('resolved');
  const [reviewNotes, setReviewNotes] = useState('');

  // Performance metrics for current skin
  const totalSkinVolume = redemptions.reduce((sum, r) => sum + r.grossAmountNgn, 0);
  const totalSkinCommission = redemptions.reduce((sum, r) => sum + r.commissionAmountNgn, 0);
  const pendingCasesCount = responseCases.filter(c => c.responseStatus === 'pending' || c.responseStatus === 'under_review').length;

  const handleSaveAffiliatePhoto = async (newUrl: string) => {
    if (!editingAffiliatePhoto) return;
    await updateAffiliateProfile(editingAffiliatePhoto.id, { photoUrl: newUrl });
    showToast(`Updated photo for ${editingAffiliatePhoto.fullName}!`, 'success');
  };

  const handleSaveSkinLogo = async (newUrl: string) => {
    if (!activeSkin) return;
    await updateSkinLogoOrTheme(activeSkin.slug, { logoUrl: newUrl });
    showToast(`Updated hub logo for ${activeSkin.displayName}!`, 'success');
  };

  const handleCreateAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    const aff = affiliates.find(a => a.id === auditAffiliateId);
    const biz = pilotBusinesses.find(b => b.id === auditBusinessId);

    await createMysteryAuditCase({
      clientId: activeSkin?.id || 'client-pw-001',
      affiliateId: auditAffiliateId,
      affiliateName: aff?.fullName || 'Affiliate',
      businessId: auditBusinessId,
      businessName: biz?.name || 'HiTech Distributors',
      customerName: 'Mystery Shopper Desk',
      customerWa: '2348099887766',
      issueType: 'mystery_audit',
      slaTargetHours: auditSla,
      mysteryShopperNotes: auditNotes || 'Routine Response Watch assessment enquiry',
    });

    setIsNewAuditModalOpen(false);
    setAuditNotes('');
  };

  const handleResolveCase = async () => {
    if (!selectedCaseForReview) return;
    await resolveResponseCase(selectedCaseForReview.id, {
      responseStatus: reviewStatus,
      recordedResponseHours: reviewRecordedHours,
      mysteryShopperScore: reviewScore,
      managerNotes: reviewNotes || 'Reviewed and verified by Manager Osita',
    });
    setSelectedCaseForReview(null);
  };

  const handlePromoteTier = async (aff: AffhubAffiliate, newTier: AffhubAffiliate['tier']) => {
    await updateAffiliateProfile(aff.id, {
      tier: newTier,
      commissionRatePct: newTier === 'prime' ? 5.5 : newTier === 'verified' ? 5.0 : 4.0,
    });
  };

  const handleExportCsv = () => {
    const headers = ['Redemption ID', 'Promo Code', 'Affiliate', 'Business', 'Order ID', 'Gross (NGN)', 'Discount (NGN)', 'Commission (NGN)', 'Date', 'Terminal'];
    const rows = redemptions.map(r => [
      r.id,
      r.promoCode,
      r.affiliateName,
      r.businessName,
      r.orderId,
      r.grossAmountNgn,
      r.discountAmountNgn,
      r.commissionAmountNgn,
      r.redeemedAt,
      r.posTerminalId,
    ]);

    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${activeSkin?.slug || 'primewell'}_redemptions_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported CSV report successfully', 'success');
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 sm:px-6 lg:px-8 text-slate-100">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Manager Header Banner */}
        <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-emerald-950/50 via-slate-900 to-slate-950 p-6 sm:p-8 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/40 mb-2">
                <ShieldCheck className="h-3.5 w-3.5" />
                Manager Desk • {activeSkin?.curatorName || 'Osita'}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                {activeSkin?.displayName || 'PrimeWell Hub'} Management Suite
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Overseeing exclusive affiliate roster, Shopperscoping audit cases, and partner discount funding models.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportCsv}
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800 border border-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition cursor-pointer"
              >
                <Download className="h-3.5 w-3.5 text-amber-400" />
                Export Payout CSV
              </button>
            </div>
          </div>
        </div>

        {/* Manager Top KPIs */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="text-xs text-slate-400 font-semibold flex items-center justify-between">
              <span>Total Redemptions Volume</span>
              <DollarSign className="h-4 w-4 text-amber-400" />
            </div>
            <div className="mt-2 text-2xl font-black text-white">
              ₦{totalSkinVolume.toLocaleString()}
            </div>
            <p className="mt-1 text-[11px] text-amber-400">Total gross order value driven</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="text-xs text-slate-400 font-semibold flex items-center justify-between">
              <span>Active Affiliates</span>
              <Users className="h-4 w-4 text-blue-400" />
            </div>
            <div className="mt-2 text-2xl font-black text-white">
              {affiliates.length} Curators
            </div>
            <p className="mt-1 text-[11px] text-blue-400">Strictly locked to {activeSkin?.displayName}</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="text-xs text-slate-400 font-semibold flex items-center justify-between">
              <span>Total Payouts Commission</span>
              <TrendingUp className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="mt-2 text-2xl font-black text-white">
              ₦{totalSkinCommission.toLocaleString()}
            </div>
            <p className="mt-1 text-[11px] text-emerald-400">Affiliate balance accrued</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="text-xs text-slate-400 font-semibold flex items-center justify-between">
              <span>Response Watch Status</span>
              <Activity className="h-4 w-4 text-purple-400" />
            </div>
            <div className="mt-2 text-2xl font-black text-white">
              {pendingCasesCount} Active Cases
            </div>
            <p className="mt-1 text-[11px] text-purple-400">Shopperscoping & SLA monitors</p>
          </div>
        </div>

        {/* Manager Tab Navigation */}
        <div className="flex flex-wrap border-b border-slate-800">
          <button
            onClick={() => setActiveTab('affiliates')}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === 'affiliates'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Affiliates Directory ({affiliates.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('branding')}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === 'branding'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Palette className="h-4 w-4" />
            <span>Hub Logo & Branding</span>
          </button>

          <button
            onClick={() => setActiveTab('response_watch')}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === 'response_watch'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="h-4 w-4" />
            <span>Response Watch / Shopperscoping ({responseCases.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('business_config')}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === 'business_config'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="h-4 w-4" />
            <span>Partner Commission & Funding</span>
          </button>

          <button
            onClick={() => setActiveTab('redemptions')}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === 'redemptions'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Redemptions Log ({redemptions.length})</span>
          </button>
        </div>

        {/* TAB 1: Affiliates Roster */}
        {activeTab === 'affiliates' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">
                  Affiliates Roster — {activeSkin?.displayName}
                </h3>
                <p className="text-xs text-slate-400">
                  Tap any affiliate avatar to replace/upload new photo from device gallery.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-800 bg-slate-950/80 text-slate-400 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Affiliate (Click Photo to Edit)</th>
                    <th className="px-4 py-3">Niche Category</th>
                    <th className="px-4 py-3">Promo Code</th>
                    <th className="px-4 py-3">Tier</th>
                    <th className="px-4 py-3">Redemptions</th>
                    <th className="px-4 py-3">Total Commission</th>
                    <th className="px-4 py-3 text-right">Actions / Promote</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {affiliates.map(aff => (
                    <tr key={aff.id} className="hover:bg-slate-800/40 transition">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {/* Interactive Avatar */}
                          <div
                            onClick={() => setEditingAffiliatePhoto(aff)}
                            className="group/av relative cursor-pointer"
                            title="Tap to replace photo from gallery"
                          >
                            <img
                              src={aff.photoUrl}
                              alt={aff.fullName}
                              className="h-10 w-10 rounded-xl object-cover ring-1 ring-slate-700 group-hover/av:ring-amber-400 transition"
                            />
                            <div className="absolute inset-0 rounded-xl bg-slate-950/60 opacity-0 group-hover/av:opacity-100 flex items-center justify-center text-amber-300 transition">
                              <Camera className="h-3.5 w-3.5" />
                            </div>
                          </div>
                          <div>
                            <div className="font-bold text-white flex items-center gap-1.5">
                              <span>{aff.fullName}</span>
                              <button
                                onClick={() => setEditingAffiliatePhoto(aff)}
                                className="text-slate-400 hover:text-amber-300"
                                title="Edit photo"
                              >
                                <Camera className="h-3 w-3" />
                              </button>
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">{aff.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-300 font-medium">{aff.niche}</td>
                      <td className="px-4 py-3 font-mono font-bold text-amber-400">{aff.promoCode}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                          aff.tier === 'prime' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                          aff.tier === 'verified' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' :
                          'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}>
                          {aff.tier} ({aff.commissionRatePct}%)
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-300">{aff.totalRedemptions} orders</td>
                      <td className="px-4 py-3 font-semibold text-emerald-400">
                        ₦{aff.commissionEarnedNgn.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setEditingAffiliatePhoto(aff)}
                            className="inline-flex items-center gap-1 rounded px-2 py-1 text-[10px] bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold"
                            title="Edit Affiliate Photo"
                          >
                            <Camera className="h-3 w-3" />
                            <span>Photo</span>
                          </button>
                          {aff.tier !== 'starter' && (
                            <button
                              onClick={() => handlePromoteTier(aff, 'starter')}
                              className="rounded px-2 py-1 text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300"
                            >
                              Starter
                            </button>
                          )}
                          {aff.tier !== 'verified' && (
                            <button
                              onClick={() => handlePromoteTier(aff, 'verified')}
                              className="rounded px-2 py-1 text-[10px] bg-blue-600/30 hover:bg-blue-600/50 text-blue-300"
                            >
                              Verified
                            </button>
                          )}
                          {aff.tier !== 'prime' && (
                            <button
                              onClick={() => handlePromoteTier(aff, 'prime')}
                              className="rounded px-2 py-1 text-[10px] bg-amber-500/30 hover:bg-amber-500/50 text-amber-300 font-bold"
                            >
                              Prime ★
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: Hub Branding & Logo Customization */}
        {activeTab === 'branding' && (
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
                <Palette className="h-5 w-5 text-amber-400" />
                <span>Hub Skin Logo & Visual Identity</span>
              </h3>
              <p className="text-xs text-slate-400 mb-6">
                Manage the visual identity and branding emblem for {activeSkin?.displayName}. Any changes update the live public portal instantly.
              </p>

              {/* Logo Card Widget */}
              <div className="max-w-xl mx-auto mb-8">
                <SkinLogoCard />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-xs">
                <div className="rounded-xl bg-slate-950 p-4 border border-slate-800">
                  <div className="text-slate-400 font-bold mb-1">Primary Color</div>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-6 w-6 rounded-lg border border-slate-700"
                      style={{ backgroundColor: activeSkin?.brandTheme.primaryColor || '#0F2C59' }}
                    />
                    <span className="font-mono text-white">{activeSkin?.brandTheme.primaryColor || '#0F2C59'}</span>
                  </div>
                </div>

                <div className="rounded-xl bg-slate-950 p-4 border border-slate-800">
                  <div className="text-slate-400 font-bold mb-1">Accent Color</div>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-6 w-6 rounded-lg border border-slate-700"
                      style={{ backgroundColor: activeSkin?.brandTheme.accentColor || '#D4AF37' }}
                    />
                    <span className="font-mono text-white">{activeSkin?.brandTheme.accentColor || '#D4AF37'}</span>
                  </div>
                </div>

                <div className="rounded-xl bg-slate-950 p-4 border border-slate-800">
                  <div className="text-slate-400 font-bold mb-1">Hub Slug & Isolation</div>
                  <div className="font-mono text-amber-400 font-bold">
                    /{activeSkin?.slug || 'primewell'} (Exclusive)
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Response Watch / Shopperscoping */}
        {activeTab === 'response_watch' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Activity className="h-5 w-5 text-amber-400" />
                  <span>Response Watch & Mystery Shopper Audits</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Monitors response times (SLA Target: 2.0 hrs) and customer satisfaction before upgrading affiliate tiers.
                </p>
              </div>

              <button
                onClick={() => setIsNewAuditModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-3.5 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                Dispatch Mystery Audit
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {responseCases.map(c => {
                const isOverdue = (c.recordedResponseHours || 0) > c.slaTargetHours;
                return (
                  <div
                    key={c.id}
                    className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                          c.responseStatus === 'resolved' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                          c.responseStatus === 'under_review' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                          'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        }`}>
                          {c.responseStatus.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          Target SLA: {c.slaTargetHours}h
                        </span>
                      </div>

                      <h4 className="mt-3 text-sm font-bold text-white">{c.affiliateName}</h4>
                      <p className="text-xs text-slate-400">{c.businessName} Enquiry</p>

                      <div className="mt-3 rounded-xl bg-slate-950 p-3 border border-slate-800/80 text-xs text-slate-300">
                        <div className="text-[10px] uppercase font-bold text-amber-400 mb-1">
                          Auditor / Customer Notes:
                        </div>
                        {c.mysteryShopperNotes}
                      </div>

                      {c.mysteryShopperScore && (
                        <div className="mt-2 flex items-center justify-between text-xs">
                          <span className="text-slate-400">Mystery Shopper Score:</span>
                          <span className="font-bold text-amber-400 font-mono">
                            {c.mysteryShopperScore}/10 ★
                          </span>
                        </div>
                      )}

                      {c.recordedResponseHours !== undefined && (
                        <div className="mt-1 flex items-center justify-between text-xs">
                          <span className="text-slate-400">Recorded Response Time:</span>
                          <span className={`font-bold font-mono ${isOverdue ? 'text-red-400' : 'text-emerald-400'}`}>
                            {c.recordedResponseHours} hours {isOverdue && '(SLA breached)'}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800">
                      <button
                        onClick={() => {
                          setSelectedCaseForReview(c);
                          setReviewRecordedHours(c.recordedResponseHours || 0.8);
                          setReviewScore(c.mysteryShopperScore || 9.0);
                          setReviewNotes(c.managerNotes || '');
                          setReviewStatus(c.responseStatus);
                        }}
                        className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white"
                      >
                        <Edit className="h-3 w-3" />
                        <span>Audit / Review Ticket</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: Partner Commission & Funding Models */}
        {activeTab === 'business_config' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="h-5 w-5 text-amber-400" />
                <span>Pilot Business Commission & Discount Funding Models</span>
              </h3>
              <p className="text-xs text-slate-400">
                Configure discount funding (business-absorbed / affiliate-absorbed / split) per external business being promoted under this skin.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {pilotBusinesses.map(biz => (
                <div key={biz.id} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <img src={biz.logoUrl} alt={biz.name} className="h-10 w-10 rounded-xl object-cover" />
                    <div>
                      <h4 className="font-bold text-white text-sm">{biz.name}</h4>
                      <p className="text-[11px] text-slate-400">{biz.industry}</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Default Discount to Shopper:</span>
                      <span className="font-bold text-amber-400">{biz.defaultDiscountPct}%</span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Default Commission to Affiliate:</span>
                      <span className="font-bold text-emerald-400">{biz.defaultCommissionPct}%</span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Funding Model:</span>
                      <span className="rounded bg-slate-950 px-2 py-0.5 text-[10px] font-mono text-purple-300 font-bold uppercase">
                        {biz.fundingModel}
                      </span>
                    </div>

                    <div className="flex justify-between py-1">
                      <span className="text-slate-400">SQL Target Table:</span>
                      <span className="font-mono text-[10px] text-slate-300">{biz.tableTarget}</span>
                    </div>
                  </div>

                  <div className="rounded-xl bg-slate-950 p-2.5 text-[11px] text-slate-400">
                    Active POS Terminals: {biz.posTerminals.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Redemptions Log */}
        {activeTab === 'redemptions' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">
                Skin Redemptions Feed ({redemptions.length})
              </h3>
              <button
                onClick={handleExportCsv}
                className="text-xs text-amber-400 hover:underline flex items-center gap-1"
              >
                <Download className="h-3 w-3" /> Download CSV
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-800 bg-slate-950/80 text-slate-400 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Order ID</th>
                    <th className="px-4 py-3">Affiliate</th>
                    <th className="px-4 py-3">Partner</th>
                    <th className="px-4 py-3">Promo Code</th>
                    <th className="px-4 py-3">Gross</th>
                    <th className="px-4 py-3">Discount</th>
                    <th className="px-4 py-3">Commission</th>
                    <th className="px-4 py-3">Terminal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {redemptions.map(r => (
                    <tr key={r.id} className="hover:bg-slate-800/40">
                      <td className="px-4 py-3 font-mono font-bold text-white">{r.orderId}</td>
                      <td className="px-4 py-3 font-medium text-slate-200">{r.affiliateName}</td>
                      <td className="px-4 py-3 text-slate-300">{r.businessName}</td>
                      <td className="px-4 py-3 font-mono font-bold text-amber-400">{r.promoCode}</td>
                      <td className="px-4 py-3 text-white">₦{r.grossAmountNgn.toLocaleString()}</td>
                      <td className="px-4 py-3 text-red-400">-₦{r.discountAmountNgn.toLocaleString()}</td>
                      <td className="px-4 py-3 font-bold text-emerald-400">+₦{r.commissionAmountNgn.toLocaleString()}</td>
                      <td className="px-4 py-3 text-[10px] text-slate-500 font-mono">{r.posTerminalId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal: Dispatch Mystery Audit */}
        {isNewAuditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl space-y-4">
              <h3 className="text-base font-bold text-white">Dispatch Mystery Audit Assignment</h3>
              <form onSubmit={handleCreateAudit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Target Affiliate</label>
                  <select
                    value={auditAffiliateId}
                    onChange={e => setAuditAffiliateId(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 text-white"
                  >
                    {affiliates.map(a => (
                      <option key={a.id} value={a.id}>{a.fullName} ({a.tier} tier)</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Partner Store Context</label>
                  <select
                    value={auditBusinessId}
                    onChange={e => setAuditBusinessId(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 text-white"
                  >
                    {pilotBusinesses.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Mystery Shopper Audit Notes</label>
                  <textarea
                    rows={3}
                    value={auditNotes}
                    onChange={e => setAuditNotes(e.target.value)}
                    placeholder="e.g. Inquire about MacBook Pro M3 stock and warranty pre-testing verification..."
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsNewAuditModalOpen(false)}
                    className="rounded-xl px-4 py-2 bg-slate-800 text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl px-4 py-2 bg-amber-500 font-bold text-slate-950"
                  >
                    Dispatch Audit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Review / Resolve Case */}
        {selectedCaseForReview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl space-y-4">
              <h3 className="text-base font-bold text-white">Review & Resolve Audit Ticket</h3>
              <div className="text-xs text-slate-300">
                <strong>{selectedCaseForReview.affiliateName}</strong> ({selectedCaseForReview.businessName})
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Status</label>
                  <select
                    value={reviewStatus}
                    onChange={e => setReviewStatus(e.target.value as CaseStatus)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 text-white"
                  >
                    <option value="pending">Pending</option>
                    <option value="under_review">Under Review</option>
                    <option value="resolved">Resolved (Approved)</option>
                    <option value="escalated">Escalated (Warning)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Recorded Response Time (Hours)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={reviewRecordedHours}
                    onChange={e => setReviewRecordedHours(parseFloat(e.target.value))}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Mystery Shopper Score (1 - 10)</label>
                  <input
                    type="number"
                    step="0.1"
                    max="10"
                    min="1"
                    value={reviewScore}
                    onChange={e => setReviewScore(parseFloat(e.target.value))}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Manager Notes & Recommendations</label>
                  <textarea
                    rows={2}
                    value={reviewNotes}
                    onChange={e => setReviewNotes(e.target.value)}
                    placeholder="Enter manager assessment..."
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setSelectedCaseForReview(null)}
                    className="rounded-xl px-4 py-2 bg-slate-800 text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleResolveCase}
                    className="rounded-xl px-4 py-2 bg-emerald-600 font-bold text-white hover:bg-emerald-500"
                  >
                    Save Verdict
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Edit Affiliate Photo */}
        {editingAffiliatePhoto && (
          <ImageUploadModal
            isOpen={!!editingAffiliatePhoto}
            onClose={() => setEditingAffiliatePhoto(null)}
            title={`Update Photo: ${editingAffiliatePhoto.fullName}`}
            description="Select or upload a new photo from the device gallery to update this affiliate's avatar."
            currentImageUrl={editingAffiliatePhoto.photoUrl}
            aspectRatio="avatar"
            category="avatar"
            onSave={handleSaveAffiliatePhoto}
          />
        )}
      </div>
    </div>
  );
};
