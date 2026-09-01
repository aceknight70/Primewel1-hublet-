import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { AffhubAffiliate } from '../../types';
import { ImageUploadModal } from '../common/ImageUploadModal';
import {
  UserCheck,
  Award,
  Wallet,
  ShoppingBag,
  TrendingUp,
  Save,
  QrCode,
  Share2,
  ExternalLink,
  MessageCircle,
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  ShieldAlert,
  Layers,
  ArrowUpRight,
  Camera,
  Upload,
  FolderOpen,
  Edit2,
} from 'lucide-react';

export const AffiliatePortal: React.FC = () => {
  const {
    currentUser,
    affiliates,
    updateAffiliateProfile,
    redemptions,
    activeSkin,
    activeSkinSlug,
    showToast,
  } = useApp();

  // Find the logged-in affiliate record (or fall back to first active affiliate for PrimeWell)
  const currentAffiliate = affiliates.find(
    a => a.id === currentUser.affiliateId || a.email === currentUser.email
  ) || affiliates[0];

  const [formData, setFormData] = useState<Partial<AffhubAffiliate>>({});
  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showShareCard, setShowShareCard] = useState(false);

  // Modals for image upload
  const [isEditingAvatarModal, setIsEditingAvatarModal] = useState(false);
  const [editingGalleryIndex, setEditingGalleryIndex] = useState<number | null>(null);
  const [isAddingGalleryModal, setIsAddingGalleryModal] = useState(false);

  useEffect(() => {
    if (currentAffiliate) {
      setFormData({
        fullName: currentAffiliate.fullName,
        niche: currentAffiliate.niche,
        bio: currentAffiliate.bio,
        waNumber: currentAffiliate.waNumber,
        waChannelUrl: currentAffiliate.waChannelUrl || '',
        currentlyFeaturing: currentAffiliate.currentlyFeaturing,
        photoUrl: currentAffiliate.photoUrl,
        gallery: [...currentAffiliate.gallery],
      });
    }
  }, [currentAffiliate]);

  if (!currentAffiliate) {
    return (
      <div className="p-8 text-center text-slate-400">
        <ShieldAlert className="mx-auto h-12 w-12 text-amber-500 mb-2" />
        <h2 className="text-lg font-bold text-white">No Affiliate Record Linked</h2>
        <p className="text-xs">Your active staff account is not mapped to an affiliate card in this skin.</p>
      </div>
    );
  }

  // Personal redemptions
  const myRedemptions = redemptions.filter(r => r.affiliateId === currentAffiliate.id || r.promoCode === currentAffiliate.promoCode);
  const totalVolume = myRedemptions.reduce((acc, r) => acc + r.grossAmountNgn, 0);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      await updateAffiliateProfile(currentAffiliate.id, formData);
      showToast('Affiliate card profile saved successfully!', 'success');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateAvatar = async (newUrl: string) => {
    setFormData(prev => ({ ...prev, photoUrl: newUrl }));
    await updateAffiliateProfile(currentAffiliate.id, { photoUrl: newUrl });
    showToast('Profile photo updated successfully!', 'success');
  };

  const handleReplaceGalleryPhoto = async (newUrl: string) => {
    if (editingGalleryIndex === null) return;
    const updated = [...(formData.gallery || [])];
    updated[editingGalleryIndex] = newUrl;
    setFormData(prev => ({ ...prev, gallery: updated }));
    await updateAffiliateProfile(currentAffiliate.id, { gallery: updated });
    setEditingGalleryIndex(null);
    showToast(`Replaced showcase photo #${editingGalleryIndex + 1}!`, 'success');
  };

  const handleAddGalleryPhoto = async (newUrl: string) => {
    const updated = [...(formData.gallery || []), newUrl];
    setFormData(prev => ({ ...prev, gallery: updated }));
    await updateAffiliateProfile(currentAffiliate.id, { gallery: updated });
    setIsAddingGalleryModal(false);
    showToast('Added new photo to showcase gallery!', 'success');
  };

  const handleRemoveGalleryImage = async (index: number) => {
    const updated = (formData.gallery || []).filter((_, idx) => idx !== index);
    setFormData(prev => ({ ...prev, gallery: updated }));
    await updateAffiliateProfile(currentAffiliate.id, { gallery: updated });
    showToast('Photo removed from showcase', 'info');
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 sm:px-6 lg:px-8 text-slate-100">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Workspace Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-r from-blue-950/60 via-slate-900 to-slate-950 p-6 sm:p-8 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Interactive Profile Photo */}
              <div
                onClick={() => setIsEditingAvatarModal(true)}
                className="group relative cursor-pointer"
                title="Tap to change avatar photo from gallery"
              >
                <img
                  src={formData.photoUrl || currentAffiliate.photoUrl}
                  alt={currentAffiliate.fullName}
                  className="h-20 w-20 rounded-2xl object-cover ring-2 ring-amber-400 group-hover:ring-amber-300 transition"
                />
                <div className="absolute inset-0 rounded-2xl bg-slate-950/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition backdrop-blur-xs text-[9px] font-bold text-amber-300">
                  <Camera className="h-4 w-4 mb-0.5" />
                  <span>Edit</span>
                </div>
                <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-slate-950 shadow-md ring-2 ring-slate-900">
                  <Camera className="h-3 w-3 stroke-[2.5]" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black text-white">{currentAffiliate.fullName}</h1>
                  <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs font-bold text-amber-300 border border-amber-500/40 uppercase">
                    {currentAffiliate.tier} Tier
                  </span>
                </div>
                <p className="text-xs text-amber-400 font-medium mt-0.5">{currentAffiliate.niche}</p>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  <span className="font-mono text-slate-300">
                    Promo Code: <strong className="text-amber-400">{currentAffiliate.promoCode}</strong>
                  </span>
                  <span>•</span>
                  <span>Locked Skin: <strong>{activeSkin?.displayName || 'PrimeWell Hub'}</strong></span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsEditingAvatarModal(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition cursor-pointer"
              >
                <Camera className="h-3.5 w-3.5 text-amber-400" />
                Change Photo
              </button>

              <button
                onClick={() => setShowShareCard(!showShareCard)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 px-3.5 py-2 text-xs font-bold text-amber-300 hover:bg-amber-500/30 transition cursor-pointer"
              >
                <Share2 className="h-3.5 w-3.5" />
                Shareable Promo Card
              </button>
            </div>
          </div>
        </div>

        {/* Shareable Card Preview Modal/Drawer */}
        {showShareCard && (
          <div className="rounded-3xl border border-amber-500/40 bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <QrCode className="h-4 w-4" />
                <span>Verified WhatsApp & Instagram Share Card</span>
              </div>
              <button
                onClick={() => setShowShareCard(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="mx-auto max-w-md rounded-2xl border border-amber-500/30 bg-slate-900/90 p-5 text-center shadow-xl">
              <div className="font-mono text-xs text-amber-400 uppercase tracking-wider font-bold">
                {activeSkin?.displayName || 'PrimeWell Hub'}
              </div>
              <h3 className="mt-1 text-lg font-extrabold text-white">{currentAffiliate.fullName}</h3>
              <p className="text-xs text-slate-300">{currentAffiliate.niche}</p>

              <div className="my-4 rounded-xl bg-slate-950 p-4 border border-slate-800">
                <div className="text-[11px] text-slate-400 uppercase">Use Promo Code at Checkout:</div>
                <div className="text-2xl font-black text-amber-400 font-mono tracking-widest my-1">
                  {currentAffiliate.promoCode}
                </div>
                <div className="text-[10px] text-emerald-400 font-medium">
                  Valid at HiTech Distributors • Jotra Interiors • O Frank Electronics
                </div>
              </div>

              <p className="text-[11px] text-slate-400">
                Direct WhatsApp Orders: +{currentAffiliate.waNumber}
              </p>
            </div>
          </div>
        )}

        {/* Key Metrics Row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>Commission Earned</span>
              <Wallet className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="mt-2 text-2xl font-black text-white">
              ₦{currentAffiliate.commissionEarnedNgn.toLocaleString()}
            </div>
            <p className="mt-1 text-[11px] text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> Payouts verified via Hub backbone
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>Verified Redemptions</span>
              <ShoppingBag className="h-4 w-4 text-amber-400" />
            </div>
            <div className="mt-2 text-2xl font-black text-white">
              {currentAffiliate.totalRedemptions} Orders
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Across 3 pilot partner POS stores
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>Total Volume Driven</span>
              <TrendingUp className="h-4 w-4 text-blue-400" />
            </div>
            <div className="mt-2 text-2xl font-black text-white">
              ₦{totalVolume.toLocaleString()}
            </div>
            <p className="mt-1 text-[11px] text-blue-400">
              Gross merchandise value (GMV)
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>Commission Rate</span>
              <Award className="h-4 w-4 text-purple-400" />
            </div>
            <div className="mt-2 text-2xl font-black text-white">
              {currentAffiliate.commissionRatePct}%
            </div>
            <p className="mt-1 text-[11px] text-purple-400">
              {currentAffiliate.tier.toUpperCase()} tier tier-bonus active
            </p>
          </div>
        </div>

        {/* 2-Column: Card Editor & Redemptions Log */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Card Editor (Left 2 cols) */}
          <div className="lg:col-span-2 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-amber-400" />
                  <span>Edit Exclusive Affiliate Card</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Per the brief: Affiliates edit ONLY their own card within their assigned skin.
                </p>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={formData.fullName || ''}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">WhatsApp Direct Number (wa.me)</label>
                  <input
                    type="text"
                    value={formData.waNumber || ''}
                    onChange={e => setFormData({ ...formData, waNumber: e.target.value })}
                    placeholder="e.g. 2348039827101"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Niche Tagline</label>
                <input
                  type="text"
                  value={formData.niche || ''}
                  onChange={e => setFormData({ ...formData, niche: e.target.value })}
                  placeholder="e.g. Apple Pro Ecosystem, Camera Rigs & Studio Workflow"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">WhatsApp Channel Link (Optional)</label>
                <input
                  type="text"
                  value={formData.waChannelUrl || ''}
                  onChange={e => setFormData({ ...formData, waChannelUrl: e.target.value })}
                  placeholder="https://whatsapp.com/channel/..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">"Currently Featuring" Product Highlight</label>
                <input
                  type="text"
                  value={formData.currentlyFeaturing || ''}
                  onChange={e => setFormData({ ...formData, currentlyFeaturing: e.target.value })}
                  placeholder="e.g. HiTech M3 Max MacBook Pros & Sony A7 IV Bundles"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Curator Bio & Credentials</label>
                <textarea
                  rows={3}
                  value={formData.bio || ''}
                  onChange={e => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-amber-400 focus:outline-none"
                />
              </div>

              {/* Curator Profile Photo Editor */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <label className="block text-xs font-bold text-slate-200 mb-2">
                  Profile Avatar Photo
                </label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div
                    onClick={() => setIsEditingAvatarModal(true)}
                    className="group relative cursor-pointer"
                    title="Tap to change avatar from gallery"
                  >
                    <img
                      src={formData.photoUrl || currentAffiliate.photoUrl}
                      alt="Avatar Preview"
                      className="h-16 w-16 rounded-2xl object-cover ring-2 ring-amber-400 group-hover:ring-amber-300 transition"
                    />
                    <div className="absolute inset-0 rounded-2xl bg-slate-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition text-[10px] font-bold text-amber-300">
                      <Camera className="h-4 w-4" />
                    </div>
                  </div>

                  <div className="flex-1 space-y-1.5">
                    <p className="text-xs text-slate-300">
                      Your photo is displayed on the public skin directory & shared WhatsApp cards.
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsEditingAvatarModal(true)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition cursor-pointer"
                      >
                        <FolderOpen className="h-3.5 w-3.5" />
                        <span>Upload from Gallery</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Exclusive Gallery Photos Editor */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-200">
                      Exclusive Portfolio Showcase Photos
                    </label>
                    <p className="text-[11px] text-slate-400">
                      These photos are strictly locked to {activeSkin?.displayName || 'PrimeWell Hub'}. Tap any photo to replace from gallery.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsAddingGalleryModal(true)}
                    className="inline-flex items-center gap-1 rounded-xl bg-amber-500/20 border border-amber-500/40 px-3 py-1.5 text-xs font-bold text-amber-300 hover:bg-amber-500/30 transition cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>+ Upload Photo</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {(formData.gallery || []).map((url, idx) => (
                    <div
                      key={idx}
                      className="group relative aspect-video rounded-xl overflow-hidden border border-slate-700 bg-slate-950"
                    >
                      <img
                        src={url}
                        alt={`Gallery item ${idx + 1}`}
                        className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      {/* Overlay Controls */}
                      <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1.5 p-1">
                        <button
                          type="button"
                          onClick={() => setEditingGalleryIndex(idx)}
                          className="inline-flex items-center gap-1 rounded-lg bg-amber-500 px-2 py-1 text-[10px] font-bold text-slate-950 shadow hover:bg-amber-400 transition cursor-pointer"
                          title="Replace photo from gallery"
                        >
                          <Camera className="h-3 w-3" />
                          <span>Replace</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryImage(idx)}
                          className="rounded-lg bg-red-600/80 p-1 text-white hover:bg-red-500 transition cursor-pointer"
                          title="Remove photo"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>

                      <span className="absolute bottom-1 right-1 rounded bg-slate-950/80 px-1 py-0.5 text-[9px] font-mono text-slate-300">
                        #{idx + 1}
                      </span>
                    </div>
                  ))}

                  {/* Add photo card button */}
                  <button
                    type="button"
                    onClick={() => setIsAddingGalleryModal(true)}
                    className="flex flex-col items-center justify-center aspect-video rounded-xl border-2 border-dashed border-slate-700 hover:border-amber-400 bg-slate-950/50 hover:bg-slate-900/60 p-3 text-center transition cursor-pointer text-slate-400 hover:text-amber-300"
                  >
                    <Upload className="h-5 w-5 mb-1 text-amber-400" />
                    <span className="text-xs font-bold">+ Upload Photo</span>
                    <span className="text-[9px] text-slate-500">From gallery</span>
                  </button>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  <Save className="h-4 w-4" />
                  <span>{isSaving ? 'Saving Changes...' : 'Save Affiliate Card'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Personal Redemption History & Tier Roadmap */}
          <div className="space-y-6">
            {/* Tier Progression Card */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5 mb-3">
                <Award className="h-4 w-4 text-amber-400" />
                <span>Tier Progression Roadmap</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="rounded-xl bg-slate-950 p-3 border border-slate-800">
                  <div className="flex justify-between font-bold">
                    <span className="text-amber-400">Prime Tier (Active)</span>
                    <span className="text-slate-400">5.5% Payout</span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400">
                    Highest tier: Top priority stock verification & exclusive brand showcase placement.
                  </p>
                </div>

                <div className="rounded-xl bg-slate-950/50 p-3 border border-slate-800/60 opacity-70">
                  <div className="flex justify-between font-semibold">
                    <span className="text-blue-400">Verified Tier</span>
                    <span className="text-slate-500">5.0% Payout</span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500">
                    Requirement: 5+ verified pilot redemptions.
                  </p>
                </div>

                <div className="rounded-xl bg-slate-950/50 p-3 border border-slate-800/60 opacity-60">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-400">Starter Tier</span>
                    <span className="text-slate-500">4.0% Payout</span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500">
                    Base entry level for new curators.
                  </p>
                </div>
              </div>
            </div>

            {/* Live Personal Redemptions Feed */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
              <h3 className="text-sm font-bold text-white flex items-center justify-between mb-3">
                <span className="flex items-center gap-1.5">
                  <ShoppingBag className="h-4 w-4 text-emerald-400" />
                  <span>My POS Redemptions</span>
                </span>
                <span className="text-xs text-slate-400 font-mono">{myRedemptions.length} records</span>
              </h3>

              {myRedemptions.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-500">
                  No redemptions logged yet. Share your promo code to start earning!
                </div>
              ) : (
                <div className="space-y-2.5 max-h-80 overflow-y-auto">
                  {myRedemptions.map(r => (
                    <div
                      key={r.id}
                      className="rounded-xl bg-slate-950 p-3 border border-slate-800/80 text-xs"
                    >
                      <div className="flex justify-between font-semibold text-white">
                        <span>{r.businessName}</span>
                        <span className="text-emerald-400">+₦{r.commissionAmountNgn.toLocaleString()}</span>
                      </div>
                      <div className="mt-0.5 text-[11px] text-slate-400 truncate">{r.itemsSummary}</div>
                      <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                        <span>Order #{r.orderId}</span>
                        <span>{new Date(r.redeemedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Edit Avatar */}
      {isEditingAvatarModal && (
        <ImageUploadModal
          isOpen={isEditingAvatarModal}
          onClose={() => setIsEditingAvatarModal(false)}
          title={`Update Avatar Photo`}
          description="Upload a photo from your gallery, pick a preset avatar, or paste an image URL."
          currentImageUrl={formData.photoUrl || currentAffiliate.photoUrl}
          aspectRatio="avatar"
          category="avatar"
          onSave={handleUpdateAvatar}
        />
      )}

      {/* Modal: Replace Gallery Image */}
      {editingGalleryIndex !== null && (
        <ImageUploadModal
          isOpen={editingGalleryIndex !== null}
          onClose={() => setEditingGalleryIndex(null)}
          title={`Replace Showcase Photo #${editingGalleryIndex + 1}`}
          description="Upload an image from your device gallery to replace this showcase item."
          currentImageUrl={(formData.gallery || [])[editingGalleryIndex]}
          aspectRatio="wide"
          category="showcase"
          onSave={handleReplaceGalleryPhoto}
        />
      )}

      {/* Modal: Add New Gallery Image */}
      {isAddingGalleryModal && (
        <ImageUploadModal
          isOpen={isAddingGalleryModal}
          onClose={() => setIsAddingGalleryModal(false)}
          title="Add New Showcase Photo"
          description="Choose a photo from your gallery or presets to add to your exclusive portfolio."
          aspectRatio="wide"
          category="showcase"
          onSave={handleAddGalleryPhoto}
        />
      )}
    </div>
  );
};
