import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Image as ImageIcon,
  Check,
  Sparkles,
  Link as LinkIcon,
  RefreshCw,
  FolderOpen,
} from 'lucide-react';

export interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  currentImageUrl?: string;
  aspectRatio?: 'square' | 'wide' | 'avatar' | 'banner';
  category?: 'logo' | 'avatar' | 'showcase' | 'general';
  onSave: (newImageUrl: string) => void | Promise<void>;
}

// Curated high-res presets for instant one-click testing
const PRESET_COLLECTIONS: Record<string, { label: string; url: string }[]> = {
  logo: [
    {
      label: 'Prime Emblem (Gold & Navy)',
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
    },
    {
      label: 'Minimalist Tech Crest',
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
    },
    {
      label: 'Luxe Gold Monogram',
      url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=400&auto=format&fit=crop&q=80',
    },
    {
      label: 'Bright Future Geometric Seal',
      url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&auto=format&fit=crop&q=80',
    },
  ],
  avatar: [
    {
      label: 'Tech Curator (Pro Male)',
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    },
    {
      label: 'Interior Curator (Pro Female)',
      url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    },
    {
      label: 'Sound & Audio Specialist',
      url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    },
    {
      label: 'Creative Director',
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    },
    {
      label: 'Studio Gaming Advisor',
      url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80',
    },
  ],
  showcase: [
    {
      label: 'MacBook Studio Setup',
      url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
    },
    {
      label: 'Jotra Scandinavian Interior',
      url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&auto=format&fit=crop&q=80',
    },
    {
      label: 'O Frank Concert Stage Sound',
      url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    },
    {
      label: 'HiTech Dual Ultrawide Rig',
      url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
    },
    {
      label: 'Modern Minimal Living Room',
      url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80',
    },
    {
      label: 'Smart Solar Inverter Station',
      url: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=600&auto=format&fit=crop&q=80',
    },
  ],
};

export const ImageUploadModal: React.FC<ImageUploadModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  currentImageUrl,
  aspectRatio = 'square',
  category = 'general',
  onSave,
}) => {
  const [selectedImage, setSelectedImage] = useState<string>(currentImageUrl || '');
  const [inputUrl, setInputUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'gallery' | 'url' | 'presets'>('gallery');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const presets = PRESET_COLLECTIONS[category] || PRESET_COLLECTIONS.showcase;

  // Handle local file selection from device gallery
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if image file
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, WebP, GIF, SVG)');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setSelectedImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUrlApply = () => {
    if (inputUrl.trim()) {
      setSelectedImage(inputUrl.trim());
      setInputUrl('');
    }
  };

  const handleSave = async () => {
    if (!selectedImage) return;
    setIsUploading(true);
    try {
      await onSave(selectedImage);
      onClose();
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-700/80 bg-slate-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/70 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Upload className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">{title}</h3>
              {description && <p className="text-[11px] text-slate-400">{description}</p>}
            </div>
          </div>

          <button
            id="close-image-modal-btn"
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Live Preview Area */}
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-950/60 p-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Live Preview
            </div>

            <div
              className={`relative overflow-hidden rounded-2xl border-2 border-amber-400/80 shadow-xl bg-slate-900 flex items-center justify-center ${
                aspectRatio === 'banner'
                  ? 'h-32 w-full object-cover'
                  : aspectRatio === 'wide'
                  ? 'aspect-video w-full max-w-xs'
                  : 'h-28 w-28'
              }`}
            >
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-500 p-4 text-center">
                  <ImageIcon className="h-8 w-8 mb-1 opacity-50" />
                  <span className="text-[10px]">No image selected</span>
                </div>
              )}
            </div>
          </div>

          {/* Tab Selector */}
          <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('gallery')}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 transition cursor-pointer ${
                activeTab === 'gallery'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FolderOpen className="h-3.5 w-3.5" />
              <span>Device Gallery</span>
            </button>

            <button
              onClick={() => setActiveTab('url')}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 transition cursor-pointer ${
                activeTab === 'url'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LinkIcon className="h-3.5 w-3.5" />
              <span>Paste URL</span>
            </button>

            <button
              onClick={() => setActiveTab('presets')}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 transition cursor-pointer ${
                activeTab === 'presets'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Curated Presets</span>
            </button>
          </div>

          {/* TAB 1: Gallery Upload */}
          {activeTab === 'gallery' && (
            <div className="space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="gallery-file-input"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-amber-500/40 bg-amber-500/5 p-6 text-center cursor-pointer transition hover:border-amber-400 hover:bg-amber-500/10"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 group-hover:scale-110 transition mb-2">
                  <FolderOpen className="h-6 w-6" />
                </div>
                <div className="text-xs font-bold text-white">
                  Tap to Choose Photo from Device Gallery
                </div>
                <p className="mt-1 text-[11px] text-slate-400">
                  Supports PNG, JPG, WebP, SVG from your phone or computer photos
                </p>
                <span className="mt-3 inline-flex items-center gap-1 rounded-lg bg-amber-500 px-3.5 py-1.5 text-xs font-bold text-slate-950 shadow">
                  <Upload className="h-3.5 w-3.5" /> Select File
                </span>
              </div>
            </div>
          )}

          {/* TAB 2: Direct URL */}
          {activeTab === 'url' && (
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-300">
                Image Web Address (URL)
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={inputUrl}
                  onChange={e => setInputUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleUrlApply}
                  className="rounded-xl bg-slate-800 px-3 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 hover:text-white transition"
                >
                  Load
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Curated Presets */}
          {activeTab === 'presets' && (
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-300">
                Tap Any Preset to Select:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                {presets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(preset.url)}
                    className={`group relative aspect-video rounded-xl overflow-hidden border transition text-left cursor-pointer ${
                      selectedImage === preset.url
                        ? 'border-amber-400 ring-2 ring-amber-400/40'
                        : 'border-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.label}
                      className="h-full w-full object-cover group-hover:scale-105 transition"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent flex items-end p-1.5">
                      <span className="text-[10px] font-semibold text-white truncate">
                        {preset.label}
                      </span>
                    </div>
                    {selectedImage === preset.url && (
                      <div className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-slate-950">
                        <Check className="h-2.5 w-2.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 border-t border-slate-800 bg-slate-950/70 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-800 hover:text-white transition cursor-pointer"
          >
            Cancel
          </button>

          <button
            id="apply-image-save-btn"
            type="button"
            disabled={!selectedImage || isUploading}
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition shadow-lg shadow-amber-500/20 disabled:opacity-50 cursor-pointer"
          >
            {isUploading ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                <span>Saving Photo...</span>
              </>
            ) : (
              <>
                <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                <span>Save Photo</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
