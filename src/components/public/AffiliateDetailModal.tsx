import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ImageUploadModal } from '../common/ImageUploadModal';
import {
  X,
  ShieldCheck,
  MessageCircle,
  ExternalLink,
  Award,
  Sparkles,
  Store,
  Copy,
  Check,
  Tag,
  MapPin,
  Calendar,
  Send,
  Camera,
  Plus,
  Trash2,
  Upload,
} from 'lucide-react';

export const AffiliateDetailModal: React.FC = () => {
  const { selectedAffiliateModal, setSelectedAffiliateModal, activeSkin, pilotBusinesses, updateAffiliateProfile, showToast } = useApp();
  const [selectedPartner, setSelectedPartner] = useState<string>('biz-hitech');
  const [itemInterest, setItemInterest] = useState<string>('MacBook Pro M3 Max');
  const [copied, setCopied] = useState(false);

  // Photo editing modal states
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [editingGalleryIndex, setEditingGalleryIndex] = useState<number | null>(null);
  const [isAddingNewGalleryPhoto, setIsAddingNewGalleryPhoto] = useState(false);

  if (!selectedAffiliateModal) return null;
  const aff = selectedAffiliateModal;

  const currentPartner = pilotBusinesses.find(b => b.id === selectedPartner) || pilotBusinesses[0];

  const generatedWhatsAppMessage = `Hi ${aff.fullName}! I saw your verified profile on ${activeSkin?.displayName || 'PrimeWell Hub'}. I want to purchase from ${currentPartner.name} (Item: ${itemInterest || 'Product Enquiry'}) using your exclusive discount code *${aff.promoCode}*. Can you assist with verification and stock?`;

  const waUrl = `https://wa.me/${aff.waNumber}?text=${encodeURIComponent(generatedWhatsAppMessage)}`;

  // Save updated avatar
  const handleSaveAvatar = async (newUrl: string) => {
    await updateAffiliateProfile(aff.id, { photoUrl: newUrl });
    setSelectedAffiliateModal({ ...aff, photoUrl: newUrl });
    showToast(`Updated avatar photo for ${aff.fullName}`, 'success');
  };

  // Replace existing gallery photo
  const handleReplaceGalleryPhoto = async (newUrl: string) => {
    if (editingGalleryIndex === null) return;
    const updatedGallery = [...aff.gallery];
    updatedGallery[editingGalleryIndex] = newUrl;
    await updateAffiliateProfile(aff.id, { gallery: updatedGallery });
    setSelectedAffiliateModal({ ...aff, gallery: updatedGallery });
    setEditingGalleryIndex(null);
    showToast(`Updated showcase photo #${editingGalleryIndex + 1}`, 'success');
  };

  // Add brand new photo to gallery
  const handleAddGalleryPhoto = async (newUrl: string) => {
    const updatedGallery = [...aff.gallery, newUrl];
    await updateAffiliateProfile(aff.id, { gallery: updatedGallery });
    setSelectedAffiliateModal({ ...aff, gallery: updatedGallery });
    setIsAddingNewGalleryPhoto(false);
    showToast(`Added new photo to showcase gallery!`, 'success');
  };

  // Remove photo from gallery
  const handleRemoveGalleryPhoto = async (indexToRemove: number) => {
    const updatedGallery = aff.gallery.filter((_, idx) => idx !== indexToRemove);
    await updateAffiliateProfile(aff.id, { gallery: updatedGallery });
    setSelectedAffiliateModal({ ...aff, gallery: updatedGallery });
    showToast(`Removed photo from showcase`, 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/60 px-6 py-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-amber-400" />
            <span className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              {activeSkin?.displayName || 'PrimeWell Hub'} Verified Card
            </span>
          </div>

          <button
            onClick={() => setSelectedAffiliateModal(null)}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="max-h-[80vh] overflow-y-auto p-6 space-y-6">
          {/* Profile Overview with Editable Photo */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div
              onClick={() => setIsEditingAvatar(true)}
              className="group relative cursor-pointer"
              title="Tap to change avatar photo from gallery"
            >
              <img
                src={aff.photoUrl}
                alt={aff.fullName}
                className="h-20 w-20 rounded-2xl object-cover ring-2 ring-amber-400 group-hover:ring-amber-300 transition"
              />
              <div className="absolute inset-0 rounded-2xl bg-slate-950/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition backdrop-blur-xs text-[9px] font-bold text-amber-300">
                <Camera className="h-4 w-4 mb-0.5" />
                <span>Edit Photo</span>
              </div>
              <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-slate-950 shadow-md ring-2 ring-slate-900">
                <Camera className="h-3 w-3 stroke-[2.5]" />
              </div>
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold text-white">{aff.fullName}</h2>
                <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs font-bold text-amber-300 border border-amber-500/40 uppercase">
                  {aff.tier} tier
                </span>
              </div>
              <p className="text-xs font-medium text-amber-400/90 mt-1">{aff.niche}</p>
              <div className="mt-1 flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {aff.location}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Joined {aff.joinedDate}
                </span>
              </div>
            </div>
          </div>

          {/* Full Bio */}
          <div className="rounded-2xl bg-slate-950/60 p-4 border border-slate-800 text-xs text-slate-300 leading-relaxed">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Curator Biography
            </div>
            {aff.bio}
          </div>

          {/* Exclusive Gallery (Editable: tap any photo to change or add new) */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Exclusive Portfolio Showcase ({aff.gallery.length} Photos)
                </h4>
                <p className="text-[11px] text-slate-400">Tap any picture to replace from device gallery</p>
              </div>

              <button
                type="button"
                onClick={() => setIsAddingNewGalleryPhoto(true)}
                className="inline-flex items-center gap-1 rounded-xl bg-amber-500/20 border border-amber-500/40 px-2.5 py-1 text-xs font-bold text-amber-300 hover:bg-amber-500/30 transition cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Photo</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {aff.gallery.map((img, idx) => (
                <div
                  key={idx}
                  className="group relative aspect-video overflow-hidden rounded-xl bg-slate-800 border border-slate-700/80 cursor-pointer"
                >
                  <img
                    src={img}
                    alt={`Showcase ${idx + 1}`}
                    className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                  />

                  {/* Overlay Controls */}
                  <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2 p-2">
                    <button
                      type="button"
                      onClick={() => setEditingGalleryIndex(idx)}
                      className="inline-flex items-center gap-1 rounded-lg bg-amber-500 px-2 py-1 text-[10px] font-bold text-slate-950 shadow hover:bg-amber-400 transition"
                      title="Replace photo from gallery"
                    >
                      <Camera className="h-3 w-3" />
                      <span>Replace</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveGalleryPhoto(idx);
                      }}
                      className="rounded-lg bg-red-600/80 p-1 text-white hover:bg-red-500 transition"
                      title="Remove photo"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>

                  <span className="absolute bottom-1 right-1 rounded bg-slate-950/80 px-1.5 py-0.5 text-[9px] font-mono text-slate-300">
                    #{idx + 1}
                  </span>
                </div>
              ))}

              {/* Upload Card placeholder in grid */}
              <button
                type="button"
                onClick={() => setIsAddingNewGalleryPhoto(true)}
                className="flex flex-col items-center justify-center aspect-video rounded-xl border-2 border-dashed border-slate-700 hover:border-amber-400 bg-slate-950/40 hover:bg-slate-900/60 p-3 text-center transition cursor-pointer text-slate-400 hover:text-amber-300"
              >
                <Upload className="h-5 w-5 mb-1 text-amber-400" />
                <span className="text-[11px] font-bold">+ Upload Photo</span>
                <span className="text-[9px] text-slate-500">From gallery</span>
              </button>
            </div>
          </div>

          {/* Interactive WhatsApp Order Pre-Filler */}
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 mb-3">
              <MessageCircle className="h-4 w-4" />
              <span>Direct WhatsApp Order Generator</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Select Pilot Partner:</label>
                <div className="grid grid-cols-3 gap-2">
                  {pilotBusinesses.map(biz => (
                    <button
                      key={biz.id}
                      onClick={() => setSelectedPartner(biz.id)}
                      className={`rounded-lg px-2 py-1.5 text-left text-xs font-medium transition cursor-pointer ${
                        selectedPartner === biz.id
                          ? 'bg-emerald-600 text-white font-bold'
                          : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
                      }`}
                    >
                      <div className="truncate font-semibold">{biz.name.split(' ')[0]}</div>
                      <div className="text-[10px] opacity-80">{biz.defaultDiscountPct}% OFF</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Item / Product Focus:</label>
                <input
                  type="text"
                  value={itemInterest}
                  onChange={e => setItemInterest(e.target.value)}
                  placeholder="e.g. MacBook Pro M3 Max, Jotra Velvet Sofa..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <div className="rounded-xl bg-slate-950 p-3 border border-slate-800 text-[11px] text-slate-300 font-mono">
                {generatedWhatsAppMessage}
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 transition cursor-pointer shadow-lg shadow-emerald-950/60"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Send Enquiry via WhatsApp ({aff.waNumber})</span>
                </a>

                {aff.waChannelUrl && (
                  <a
                    href={aff.waChannelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 rounded-xl bg-slate-800 px-3 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>Channel</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Edit Curator Avatar */}
      {isEditingAvatar && (
        <ImageUploadModal
          isOpen={isEditingAvatar}
          onClose={() => setIsEditingAvatar(false)}
          title={`Update Avatar for ${aff.fullName}`}
          description="Upload a photo from your gallery, pick a preset, or paste a direct image URL."
          currentImageUrl={aff.photoUrl}
          aspectRatio="avatar"
          category="avatar"
          onSave={handleSaveAvatar}
        />
      )}

      {/* Modal: Replace Gallery Photo */}
      {editingGalleryIndex !== null && (
        <ImageUploadModal
          isOpen={editingGalleryIndex !== null}
          onClose={() => setEditingGalleryIndex(null)}
          title={`Replace Showcase Photo #${editingGalleryIndex + 1}`}
          description="Choose a photo from your gallery to replace this showcase picture."
          currentImageUrl={aff.gallery[editingGalleryIndex]}
          aspectRatio="wide"
          category="showcase"
          onSave={handleReplaceGalleryPhoto}
        />
      )}

      {/* Modal: Add New Gallery Photo */}
      {isAddingNewGalleryPhoto && (
        <ImageUploadModal
          isOpen={isAddingNewGalleryPhoto}
          onClose={() => setIsAddingNewGalleryPhoto(false)}
          title="Add New Showcase Photo to Portfolio"
          description="Upload an image from your device gallery to add to your showcase."
          aspectRatio="wide"
          category="showcase"
          onSave={handleAddGalleryPhoto}
        />
      )}
    </div>
  );
};

