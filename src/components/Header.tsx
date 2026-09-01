import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  ShieldCheck,
  Building2,
  UserCheck,
  Layers,
  ChevronDown,
  ShoppingBag,
  ExternalLink,
  Lock,
  Globe,
  PlusCircle,
  Activity,
  CheckCircle2,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activePath,
    navigate,
    activeSkinSlug,
    activeSkin,
    currentUser,
    availableStaff,
    switchUser,
    allSkins,
    setIsPosModalOpen,
    setIsRlsModalOpen,
  } = useApp();

  const [isSkinDropdownOpen, setIsSkinDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const isPrimeWell = activeSkinSlug.toLowerCase() === 'primewell';
  const theme = activeSkin?.brandTheme;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl transition-colors">
      {/* Top Universal System Backbone Bar */}
      <div className="border-b border-slate-800/50 bg-slate-900/60 px-4 py-1.5 text-xs text-slate-400">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-mono text-slate-300 font-medium tracking-wide">
              UNIVERSAL AFFILIATE HUB BACKBONE
            </span>
            <span className="hidden sm:inline-block text-slate-600">|</span>
            <span className="hidden sm:inline-block text-slate-400">
              Multi-Tenant Architecture Pattern (Manifest Shared Engine)
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Pilot POS Terminal Launcher */}
            <button
              id="header-launch-pos-btn"
              onClick={() => setIsPosModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 hover:border-amber-400 transition-all cursor-pointer shadow-sm"
            >
              <ShoppingBag className="h-3 w-3" />
              <span>Pilot POS Simulator (HiTech / Jotra / O Frank)</span>
            </button>

            {/* RLS Security Verification Modal */}
            <button
              id="header-rls-inspector-btn"
              onClick={() => setIsRlsModalOpen(true)}
              className="inline-flex items-center gap-1 rounded bg-slate-800/80 px-2 py-0.5 text-[11px] text-slate-300 hover:text-white hover:bg-slate-700 transition"
              title="Inspect Row Level Security (RLS) policies and auth isolation"
            >
              <Lock className="h-2.5 w-2.5 text-blue-400" />
              <span>RLS Inspector</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Skin Brand Header */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Left: Active Skin Brand Identity */}
        <div className="flex items-center gap-3">
          {/* Skin Logo / Icon badge */}
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl font-bold shadow-lg border border-amber-500/30 transition-transform hover:scale-105"
            style={{
              backgroundColor: theme?.primaryColor || '#0F2C59',
              color: theme?.accentColor || '#D4AF37',
            }}
          >
            {isPrimeWell ? (
              <span className="font-extrabold text-sm tracking-wider font-mono">PW</span>
            ) : (
              <Layers className="h-5 w-5" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-bold text-white tracking-tight">
                {activeSkin?.displayName || 'Universal Affiliate Hub'}
              </span>
              <span
                className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border"
                style={{
                  backgroundColor: theme?.badgeBg || 'rgba(212, 175, 55, 0.15)',
                  color: theme?.goldAccent || '#F59E0B',
                  borderColor: theme?.accentColor ? `${theme.accentColor}40` : 'rgba(245, 158, 11, 0.3)',
                }}
              >
                <ShieldCheck className="h-2.5 w-2.5" />
                Verified Skin
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="font-mono text-amber-400/90 font-medium">/{activeSkinSlug}</span>
              <span>•</span>
              <span className="truncate max-w-[200px] sm:max-w-xs">{activeSkin?.tagline}</span>
            </div>
          </div>
        </div>

        {/* Center/Right: Navigation Tabs & Role Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Path / Role Navigation Pill Group */}
          <nav className="hidden md:flex items-center gap-1 rounded-xl bg-slate-900/90 p-1 border border-slate-800 text-xs font-medium">
            <button
              id="nav-public-hub"
              onClick={() => navigate(`/${activeSkinSlug}`)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all cursor-pointer ${
                activePath === `/${activeSkinSlug}`
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Globe className="h-3.5 w-3.5" />
              Public Directory
            </button>

            <button
              id="nav-affiliate-portal"
              onClick={() => navigate(`/${activeSkinSlug}/affiliate`)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all cursor-pointer ${
                activePath === `/${activeSkinSlug}/affiliate`
                  ? 'bg-blue-600 text-white font-bold shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <UserCheck className="h-3.5 w-3.5" />
              Affiliate Card
            </button>

            <button
              id="nav-manager-portal"
              onClick={() => navigate(`/${activeSkinSlug}/manager`)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all cursor-pointer ${
                activePath === `/${activeSkinSlug}/manager`
                  ? 'bg-emerald-600 text-white font-bold shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              Manager Desk ({activeSkin?.curatorName || 'Osita'})
            </button>

            <button
              id="nav-master-overview"
              onClick={() => navigate('/master')}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all cursor-pointer ${
                activePath === '/' || activePath === '/master'
                  ? 'bg-purple-600 text-white font-bold shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Building2 className="h-3.5 w-3.5" />
              Master Overview
            </button>
          </nav>

          {/* Skin Switcher Dropdown */}
          <div className="relative">
            <button
              id="skin-switcher-btn"
              onClick={() => {
                setIsSkinDropdownOpen(!isSkinDropdownOpen);
                setIsUserDropdownOpen(false);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 border border-slate-700/80 px-2.5 py-1.5 text-xs font-semibold text-slate-200 hover:border-amber-400 hover:text-white transition"
            >
              <Layers className="h-3.5 w-3.5 text-amber-400" />
              <span className="hidden sm:inline">Skin:</span>
              <span className="text-amber-300 font-mono">/{activeSkinSlug}</span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            {isSkinDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-800 bg-slate-900/95 p-2 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Select Active Hub Skin
                </div>
                <div className="space-y-1">
                  {allSkins.map(skin => (
                    <button
                      key={skin.id}
                      onClick={() => {
                        setIsSkinDropdownOpen(false);
                        navigate(`/${skin.slug}`);
                      }}
                      className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs transition ${
                        skin.slug === activeSkinSlug
                          ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: skin.brandTheme.accentColor }}
                        />
                        <div>
                          <div className="font-semibold">{skin.displayName}</div>
                          <div className="font-mono text-[10px] text-slate-400">/{skin.slug}</div>
                        </div>
                      </div>
                      {skin.slug === activeSkinSlug && (
                        <CheckCircle2 className="h-3.5 w-3.5 text-amber-400" />
                      )}
                    </button>
                  ))}
                </div>

                {currentUser.role === 'master' && (
                  <div className="mt-2 border-t border-slate-800 pt-2">
                    <button
                      onClick={() => {
                        setIsSkinDropdownOpen(false);
                        navigate('/master');
                      }}
                      className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-purple-500/10 px-2 py-1.5 text-xs font-semibold text-purple-300 hover:bg-purple-500/20 transition"
                    >
                      <PlusCircle className="h-3.5 w-3.5" />
                      Deploy New Skin (Master)
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Auth Session Role Switcher */}
          <div className="relative">
            <button
              id="user-session-switcher-btn"
              onClick={() => {
                setIsUserDropdownOpen(!isUserDropdownOpen);
                setIsSkinDropdownOpen(false);
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900/90 border border-slate-700/80 p-1.5 sm:px-3 text-xs text-slate-200 hover:border-blue-400 hover:text-white transition"
            >
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="h-6 w-6 rounded-full object-cover ring-1 ring-amber-400/50"
              />
              <div className="hidden sm:block text-left">
                <div className="font-semibold leading-tight">{currentUser.name.split(' ')[0]}</div>
                <div className="text-[10px] uppercase font-bold text-amber-400">
                  {currentUser.role}
                </div>
              </div>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            {isUserDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-xl border border-slate-800 bg-slate-900/95 p-2 shadow-2xl backdrop-blur-xl z-50">
                <div className="px-3 py-2 border-b border-slate-800">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Active Auth Session (RLS Identity)
                  </div>
                  <div className="mt-1 text-xs text-slate-200 font-medium">{currentUser.email}</div>
                  <div className="text-[10px] text-amber-400 font-mono">
                    Role: {currentUser.role.toUpperCase()} {currentUser.clientId ? `• Skin: ${currentUser.clientId}` : '• Global Master'}
                  </div>
                </div>

                <div className="py-1 text-[11px] text-slate-400 font-medium px-2">
                  Switch Auth Session (Simulate Real Tiers):
                </div>

                <div className="space-y-1 max-h-60 overflow-y-auto">
                  {availableStaff.map(staff => (
                    <button
                      key={staff.id}
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        switchUser(staff.email);
                      }}
                      className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs transition ${
                        staff.id === currentUser.id
                          ? 'bg-blue-600/20 text-blue-300 font-bold border border-blue-500/30'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <img
                        src={staff.avatarUrl}
                        alt={staff.name}
                        className="h-6 w-6 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="truncate font-semibold">{staff.name}</div>
                        <div className="truncate text-[10px] text-slate-400">{staff.title}</div>
                      </div>
                      <span className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded ${
                        staff.role === 'master' ? 'bg-purple-500/20 text-purple-300' :
                        staff.role === 'manager' ? 'bg-emerald-500/20 text-emerald-300' :
                        'bg-blue-500/20 text-blue-300'
                      }`}>
                        {staff.role}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Path Nav Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-800/80 bg-slate-950 px-2 py-2 text-xs">
        <button
          onClick={() => navigate(`/${activeSkinSlug}`)}
          className={`flex items-center gap-1 px-2 py-1 rounded ${
            activePath === `/${activeSkinSlug}` ? 'text-amber-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Globe className="h-3.5 w-3.5" />
          Directory
        </button>
        <button
          onClick={() => navigate(`/${activeSkinSlug}/affiliate`)}
          className={`flex items-center gap-1 px-2 py-1 rounded ${
            activePath === `/${activeSkinSlug}/affiliate` ? 'text-blue-400 font-bold' : 'text-slate-400'
          }`}
        >
          <UserCheck className="h-3.5 w-3.5" />
          Card
        </button>
        <button
          onClick={() => navigate(`/${activeSkinSlug}/manager`)}
          className={`flex items-center gap-1 px-2 py-1 rounded ${
            activePath === `/${activeSkinSlug}/manager` ? 'text-emerald-400 font-bold' : 'text-slate-400'
          }`}
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          Manager
        </button>
        <button
          onClick={() => navigate('/master')}
          className={`flex items-center gap-1 px-2 py-1 rounded ${
            activePath === '/' || activePath === '/master' ? 'text-purple-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Building2 className="h-3.5 w-3.5" />
          Master
        </button>
      </div>
    </header>
  );
};
