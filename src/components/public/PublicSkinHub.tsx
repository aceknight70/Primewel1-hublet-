import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { AffhubAffiliate } from '../../types';
import { SkinLogoCard } from './SkinLogoCard';
import { ImageUploadModal } from '../common/ImageUploadModal';
import {
  Search,
  Sparkles,
  ShieldCheck,
  CheckCircle,
  MessageCircle,
  ExternalLink,
  Copy,
  Check,
  Award,
  Tag,
  Store,
  Layers,
  Flame,
  Info,
  ChevronRight,
  Filter,
  Eye,
  Camera,
  Edit2,
} from 'lucide-react';

export const PublicSkinHub: React.FC = () => {
  const { activeSkin, activeSkinSlug, affiliates, updateAffiliateProfile, setSelectedAffiliateModal, showToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [editingAffiliatePhoto, setEditingAffiliatePhoto] = useState<AffhubAffiliate | null>(null);

  const theme = activeSkin?.brandTheme;

  const handleSaveAffiliatePhoto = async (newUrl: string) => {
    if (!editingAffiliatePhoto) return;
    await updateAffiliateProfile(editingAffiliatePhoto.id, { photoUrl: newUrl });
    showToast(`Photo updated for ${editingAffiliatePhoto.fullName}!`, 'success');
  };

  // Filter affiliates
  const filteredAffiliates = useMemo(() => {
    return affiliates.filter(aff => {
      const matchesSearch =
        aff.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        aff.niche.toLowerCase().includes(searchQuery.toLowerCase()) ||
        aff.currentlyFeaturing.toLowerCase().includes(searchQuery.toLowerCase()) ||
        aff.promoCode.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat = selectedCategory === 'all' || aff.nicheCategory === selectedCategory;
      const matchesTier = selectedTier === 'all' || aff.tier === selectedTier;

      return matchesSearch && matchesCat && matchesTier;
    });
  }, [affiliates, searchQuery, selectedCategory, selectedTier]);

  const handleCopyCode = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast(`Copied promo code ${code} to clipboard!`, 'success');
    setTimeout(() => {
      setCopiedCode(prev => (prev === code ? null : prev));
    }, 2000);
  };

  const getTierBadge = (tier: AffhubAffiliate['tier']) => {
    switch (tier) {
      case 'prime':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs font-bold text-amber-300 border border-amber-500/40 shadow-sm shadow-amber-500/10">
            <Award className="h-3 w-3 text-amber-400" />
            Prime Affiliate
          </span>
        );
      case 'verified':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/20 px-2.5 py-0.5 text-xs font-bold text-blue-300 border border-blue-500/40">
            <ShieldCheck className="h-3 w-3 text-blue-400" />
            Verified Partner
          </span>
        );
      case 'starter':
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-slate-300 border border-slate-700">
            <CheckCircle className="h-3 w-3 text-slate-400" />
            Starter Tier
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-20 text-slate-100">
      {/* Exclusive Skin Hero Banner */}
      <section className="relative overflow-hidden border-b border-slate-800/80 bg-gradient-to-b from-slate-900 to-slate-950 py-12 px-4 sm:px-6 lg:px-8">
        {/* Glow ambient background styled from skin colors */}
        <div
          className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-96 w-full max-w-4xl rounded-full opacity-20 blur-3xl"
          style={{
            background: `radial-gradient(circle, ${theme?.accentColor || '#D4AF37'} 0%, ${theme?.primaryColor || '#0F2C59'} 100%)`,
          }}
        />

        <div className="relative mx-auto max-w-5xl text-center">
          {/* Curator & Skin Header Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-slate-900/80 px-3.5 py-1 text-xs text-slate-300 backdrop-blur-md mb-4 shadow-lg">
            <span className="flex h-2 w-2 rounded-full bg-amber-400"></span>
            <span className="font-semibold text-amber-300">
              Curated by {activeSkin?.curatorName || 'Osita'}
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400 font-mono text-[11px]">/{activeSkinSlug} exclusive directory</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            {activeSkin?.displayName || 'PrimeWell Hub'}
          </h1>

          {/* Interactive Brand Logo Card (Tap to upload from gallery) */}
          <SkinLogoCard />

          <p className="mx-auto mt-3 max-w-2xl text-base sm:text-lg text-slate-300 leading-relaxed">
            {activeSkin?.tagline ||
              'A curated collective of verified tech, interior, sound, and lifestyle affiliates across Nigeria.'}
          </p>

          {/* Pilot Retail Partners Tagline Bar */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs text-slate-400">
            <span className="font-semibold text-slate-300">Official Pilot Redemption Partners:</span>
            <span className="rounded-md bg-slate-900 px-2.5 py-1 border border-slate-800 text-slate-200 font-medium">
              ⚡ HiTech Distributors (Tech/MacBooks)
            </span>
            <span className="rounded-md bg-slate-900 px-2.5 py-1 border border-slate-800 text-slate-200 font-medium">
              🛋️ Jotra Interiors (Living/Lighting)
            </span>
            <span className="rounded-md bg-slate-900 px-2.5 py-1 border border-slate-800 text-slate-200 font-medium">
              🔊 O Frank Electronics (Sound Systems)
            </span>
          </div>

          {/* Quick Search & Filter Controls */}
          <div className="mt-8 mx-auto max-w-3xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                id="search-affiliates-input"
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by affiliate name, niche, featured items (e.g. 'MacBook', 'Acoustics', 'Jotra')..."
                className="w-full rounded-2xl border border-slate-700/80 bg-slate-900/90 pl-12 pr-4 py-3.5 text-sm text-white placeholder-slate-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20 shadow-xl backdrop-blur-md"
              />
            </div>

            {/* Category / Niche Filter Buttons */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5">
              {[
                { id: 'all', label: 'All Niches' },
                { id: 'tech', label: '💻 Tech & Apple' },
                { id: 'interior', label: '🛋️ Interior Living' },
                { id: 'audio', label: '🔊 Sound & Staging' },
                { id: 'appliances', label: '⚡ Smart Solar' },
                { id: 'gaming', label: '🎮 Studio & Gaming' },
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                      : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Tier Filter Pills */}
            <div className="mt-2 flex items-center justify-center gap-2 text-xs">
              <span className="text-slate-500 flex items-center gap-1">
                <Filter className="h-3 w-3" /> Tier:
              </span>
              {['all', 'prime', 'verified', 'starter'].map(tier => (
                <button
                  key={tier}
                  onClick={() => setSelectedTier(tier)}
                  className={`capitalize px-2 py-0.5 rounded text-[11px] transition ${
                    selectedTier === tier
                      ? 'bg-blue-600/30 text-blue-300 font-bold border border-blue-500/50'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tier === 'all' ? 'All Tiers' : tier}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Affiliate Directory Grid */}
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>{activeSkin?.displayName || 'PrimeWell'} Affiliate Collective</span>
              <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-amber-400 font-mono">
                {filteredAffiliates.length} active
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Each affiliate profile, gallery, and WhatsApp direct channel is exclusive to this hub skin.
            </p>
          </div>
        </div>

        {filteredAffiliates.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-12 text-center">
            <Info className="mx-auto h-8 w-8 text-slate-500 mb-2" />
            <h3 className="text-base font-bold text-white">No affiliates found matching your filter</h3>
            <p className="mt-1 text-xs text-slate-400">Try adjusting your search keywords or resetting filters.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedTier('all');
              }}
              className="mt-4 rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredAffiliates.map(aff => {
              const waDirectLink = `https://wa.me/${aff.waNumber}?text=${encodeURIComponent(
                `Hi ${aff.fullName}, I found your verified card on ${activeSkin?.displayName || 'PrimeWell Hub'}. I want to inquire about purchasing through promo code ${aff.promoCode}.`
              )}`;

              return (
                <div
                  key={aff.id}
                  id={`affiliate-card-${aff.id}`}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/70 p-5 shadow-xl transition-all duration-300 hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-500/5 hover:-translate-y-1"
                >
                  {/* Top Bar: Tier & Location */}
                  <div>
                    <div className="flex items-center justify-between">
                      {getTierBadge(aff.tier)}
                      <span className="text-[11px] font-medium text-slate-400">
                        {aff.location}
                      </span>
                    </div>

                    {/* Affiliate Identity Profile with Editable Photo */}
                    <div className="mt-4 flex items-start gap-3.5">
                      <div
                        onClick={() => setEditingAffiliatePhoto(aff)}
                        className="group/avatar relative cursor-pointer"
                        title="Tap to change / upload photo from gallery"
                      >
                        <img
                          src={aff.photoUrl}
                          alt={aff.fullName}
                          className="h-16 w-16 rounded-2xl object-cover ring-2 ring-slate-700 group-hover:ring-amber-400 group-hover/avatar:ring-amber-400 transition"
                        />
                        {/* Hover/Touch Photo Edit Overlay Badge */}
                        <div className="absolute inset-0 rounded-2xl bg-slate-950/60 opacity-0 group-hover/avatar:opacity-100 flex flex-col items-center justify-center transition backdrop-blur-xs text-[9px] font-bold text-amber-300">
                          <Camera className="h-4 w-4 mb-0.5" />
                          <span>Edit</span>
                        </div>
                        <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white shadow ring-2 ring-slate-900">
                          <Check className="h-3 w-3 stroke-[3]" />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="truncate text-base font-bold text-white group-hover:text-amber-300 transition">
                          {aff.fullName}
                        </h3>
                        <p className="line-clamp-2 text-xs font-medium text-amber-400/90 mt-0.5">
                          {aff.niche}
                        </p>
                        <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
                          <span className="flex items-center gap-0.5 text-amber-400 font-semibold">
                            ★ {aff.rating}
                          </span>
                          <span>•</span>
                          <span>{aff.totalRedemptions} verified orders</span>
                        </div>
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="mt-3.5 line-clamp-2 text-xs text-slate-300 leading-relaxed">
                      {aff.bio}
                    </p>

                    {/* "Currently Featuring" Spotlight Box */}
                    <div className="mt-3.5 rounded-xl border border-amber-500/20 bg-amber-500/5 p-2.5">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-400">
                        <Flame className="h-3 w-3" />
                        Currently Featuring:
                      </div>
                      <p className="mt-1 text-xs font-semibold text-slate-200">
                        {aff.currentlyFeaturing}
                      </p>
                    </div>

                    {/* Promo Code & Discount Tag */}
                    <div className="mt-3.5 flex items-center justify-between rounded-xl bg-slate-950/80 p-2.5 border border-slate-800">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-amber-400" />
                        <div>
                          <div className="text-[10px] text-slate-400 font-medium">Exclusive Promo Code</div>
                          <span className="font-mono text-xs font-bold text-amber-300 tracking-wider">
                            {aff.promoCode}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={e => handleCopyCode(aff.promoCode, e)}
                        className="inline-flex items-center gap-1 rounded-lg bg-slate-800 px-2.5 py-1 text-xs font-bold text-slate-200 hover:bg-amber-500 hover:text-slate-950 transition cursor-pointer"
                        title="Copy code for HiTech / Jotra / O Frank"
                      >
                        {copiedCode === aff.promoCode ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-400" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Actions & WhatsApp Outreach */}
                  <div className="mt-5 space-y-2 pt-3 border-t border-slate-800/80">
                    {/* Primary WhatsApp Chat Button */}
                    <a
                      href={waDirectLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-500 shadow-md shadow-emerald-950/50 transition cursor-pointer"
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      <span>Chat on WhatsApp (wa.me)</span>
                    </a>

                    {/* Secondary Actions: Gallery & Channel */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedAffiliateModal(aff)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-slate-800/90 px-2.5 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700 hover:text-white transition cursor-pointer"
                      >
                        <Eye className="h-3 w-3 text-amber-400" />
                        <span>View Portfolio ({aff.gallery.length})</span>
                      </button>

                      {aff.waChannelUrl && (
                        <a
                          href={aff.waChannelUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1 rounded-lg bg-emerald-900/30 px-2.5 py-1.5 text-xs font-medium text-emerald-400 border border-emerald-500/20 hover:bg-emerald-900/50 transition cursor-pointer"
                          title="Join WhatsApp Channel for stock drops"
                        >
                          <ExternalLink className="h-3 w-3" />
                          <span>Channel</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Affiliate Photo Quick Editor Modal */}
      {editingAffiliatePhoto && (
        <ImageUploadModal
          isOpen={!!editingAffiliatePhoto}
          onClose={() => setEditingAffiliatePhoto(null)}
          title={`Update Photo for ${editingAffiliatePhoto.fullName}`}
          description="Upload a new curator avatar from your device gallery, select a preset, or paste an image URL."
          currentImageUrl={editingAffiliatePhoto.photoUrl}
          aspectRatio="avatar"
          category="avatar"
          onSave={handleSaveAffiliatePhoto}
        />
      )}
    </div>
  );
};
