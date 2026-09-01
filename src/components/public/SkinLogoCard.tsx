import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { ImageUploadModal } from '../common/ImageUploadModal';
import {
  Upload,
  Camera,
  Sparkles,
  ShieldCheck,
  Check,
  Crown,
  FolderOpen,
} from 'lucide-react';

export const SkinLogoCard: React.FC = () => {
  const { activeSkin, activeSkinSlug, updateSkinLogoOrTheme, showToast } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const theme = activeSkin?.brandTheme;
  const currentLogo = theme?.logoUrl;
  const displayName = activeSkin?.displayName || 'PrimeWell Hub';
  const isPrimeWell = activeSkinSlug === 'primewell';

  const handleSaveLogo = async (newUrl: string) => {
    if (!activeSkin) return;
    await updateSkinLogoOrTheme(activeSkin.slug, { logoUrl: newUrl });
    showToast(`Logo updated successfully for ${displayName}!`, 'success');
  };

  // Direct 1-tap quick file upload from device gallery
  const handleDirectFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select an image file (PNG, JPG, SVG, WebP)', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      if (typeof reader.result === 'string') {
        await handleSaveLogo(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <div className="my-6 mx-auto max-w-md w-full">
        {/* Hidden direct file input for instant gallery access */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleDirectFileSelect}
          className="hidden"
          id="direct-skin-logo-input"
        />

        {/* The Interactive Logo Card */}
        <div
          id="hub-logo-card"
          onClick={() => setIsModalOpen(true)}
          className="group relative cursor-pointer overflow-hidden rounded-3xl border-2 border-amber-500/40 bg-gradient-to-br from-slate-900/95 via-slate-950 to-slate-900 p-5 sm:p-6 shadow-2xl transition-all duration-300 hover:border-amber-400 hover:shadow-amber-500/10 hover:scale-[1.02]"
        >
          {/* Ambient Glow Accent */}
          <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-amber-500/15 blur-2xl group-hover:bg-amber-500/25 transition duration-500" />
          <div className="pointer-events-none absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-blue-500/10 blur-2xl" />

          <div className="relative flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            {/* Logo Emblem Frame */}
            <div className="relative">
              <div className="flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center overflow-hidden rounded-2xl border-2 border-amber-400/80 bg-slate-950 shadow-inner group-hover:border-amber-300 transition">
                {currentLogo ? (
                  <img
                    src={currentLogo}
                    alt={`${displayName} Logo`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-2 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 font-extrabold text-lg border border-amber-500/30">
                      {isPrimeWell ? 'PW' : displayName.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="text-[9px] font-bold text-amber-300 mt-1 uppercase tracking-wider">
                      Official
                    </span>
                  </div>
                )}
              </div>

              {/* Camera / Upload Badge overlay */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-amber-500 text-slate-950 shadow-lg ring-2 ring-slate-900 transition hover:bg-amber-400 hover:scale-110 cursor-pointer"
                title="Tap to select photo from gallery"
              >
                <Camera className="h-3.5 w-3.5 stroke-[2.5]" />
              </button>
            </div>

            {/* Card Content & Upload Guidance */}
            <div className="flex-1 min-w-0">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-300 border border-amber-500/30 mb-1.5">
                <Crown className="h-3 w-3 text-amber-400" />
                <span>Hub Brand Identity Card</span>
              </div>

              <h3 className="text-base sm:text-lg font-black text-white group-hover:text-amber-300 transition">
                {displayName} Logo
              </h3>

              <p className="text-xs text-slate-300 mt-0.5 leading-snug">
                Tap card to customize or upload official emblem from your device gallery.
              </p>

              {/* Action Buttons */}
              <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-3 py-1.5 text-xs font-bold text-slate-950 shadow-md hover:bg-amber-400 transition cursor-pointer"
                >
                  <FolderOpen className="h-3.5 w-3.5" />
                  <span>Choose from Gallery</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800 border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition cursor-pointer"
                >
                  <Camera className="h-3.5 w-3.5 text-amber-400" />
                  <span>Presets / URL</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Modal for presets, gallery, or URL */}
      <ImageUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Upload Logo for ${displayName}`}
        description="Choose a photo from your gallery, paste an image URL, or select from curated emblems."
        currentImageUrl={currentLogo}
        aspectRatio="square"
        category="logo"
        onSave={handleSaveLogo}
      />
    </>
  );
};
