import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  AffhubAffiliate,
  AffhubClient,
  AffhubStaff,
  PilotBusiness,
  PromoRedemption,
  ResponseWatchCase,
} from '../types';
import { api } from '../services/api';

export type ActiveView = 
  | 'public_skin' 
  | 'affiliate_portal' 
  | 'manager_portal' 
  | 'master_overview' 
  | 'pos_simulator';

interface AppContextType {
  // Navigation & Skin Resolution
  activePath: string;
  navigate: (path: string) => void;
  activeSkinSlug: string;
  activeSkin: AffhubClient | null;
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  
  // Auth & Staff Session
  currentUser: AffhubStaff;
  availableStaff: AffhubStaff[];
  switchUser: (email: string) => Promise<void>;
  
  // Data Collections
  allSkins: AffhubClient[];
  affiliates: AffhubAffiliate[];
  pilotBusinesses: PilotBusiness[];
  redemptions: PromoRedemption[];
  responseCases: ResponseWatchCase[];
  
  // UI & Modals
  isPosModalOpen: boolean;
  setIsPosModalOpen: (open: boolean) => void;
  isRlsModalOpen: boolean;
  setIsRlsModalOpen: (open: boolean) => void;
  selectedAffiliateModal: AffhubAffiliate | null;
  setSelectedAffiliateModal: (aff: AffhubAffiliate | null) => void;
  toastMessage: { text: string; type: 'success' | 'info' | 'error' } | null;
  showToast: (text: string, type?: 'success' | 'info' | 'error') => void;
  
  // Actions
  refreshAllData: () => Promise<void>;
  updateAffiliateProfile: (id: string, updates: Partial<AffhubAffiliate>) => Promise<void>;
  updateSkinLogoOrTheme: (slug: string, updates: Partial<AffhubClient['brandTheme']>) => Promise<void>;
  addNewSkin: (data: Parameters<typeof api.createSkin>[0]) => Promise<void>;
  addBusiness: (data: Parameters<typeof api.addBusiness>[0]) => Promise<void>;
  logNewRedemption: (data: Parameters<typeof api.redeemPromo>[0]) => Promise<PromoRedemption>;
  resolveResponseCase: (id: string, updates: Partial<ResponseWatchCase>) => Promise<void>;
  createMysteryAuditCase: (data: Partial<ResponseWatchCase>) => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Path state (defaults to /primewell for immediate immersion, or reads from browser URL)
  const initialPath = typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/';

  const [activePath, setActivePath] = useState<string>(initialPath);
  const [activeSkinSlug, setActiveSkinSlug] = useState<string>('primewell');
  const [activeSkin, setActiveSkin] = useState<AffhubClient | null>(null);
  const [activeView, setActiveView] = useState<ActiveView>('public_skin');

  // Staff User Session
  const [currentUser, setCurrentUser] = useState<AffhubStaff>({
    id: 'staff-osita-02',
    clientId: 'client-pw-001',
    email: 'osita@primewell.ng',
    name: 'Osita (PrimeWell Manager)',
    role: 'manager',
    affiliateId: null,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    title: 'PrimeWell Managing Curator',
    createdAt: '2026-01-10T09:00:00.000Z',
  });
  const [availableStaff, setAvailableStaff] = useState<AffhubStaff[]>([]);

  // Collections
  const [allSkins, setAllSkins] = useState<AffhubClient[]>([]);
  const [affiliates, setAffiliates] = useState<AffhubAffiliate[]>([]);
  const [pilotBusinesses, setPilotBusinesses] = useState<PilotBusiness[]>([]);
  const [redemptions, setRedemptions] = useState<PromoRedemption[]>([]);
  const [responseCases, setResponseCases] = useState<ResponseWatchCase[]>([]);

  // Modals & Feedback
  const [isPosModalOpen, setIsPosModalOpen] = useState(false);
  const [isRlsModalOpen, setIsRlsModalOpen] = useState(false);
  const [selectedAffiliateModal, setSelectedAffiliateModal] = useState<AffhubAffiliate | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = useCallback((text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(prev => (prev?.text === text ? null : prev));
    }, 4000);
  }, []);

  // Sync route and determine view mode
  const parsePath = useCallback((path: string) => {
    let url;
    try {
      // Use a dummy origin for relative paths
      url = new URL(path, typeof window !== 'undefined' ? window.location.origin : 'http://localhost');
    } catch {
      url = new URL(path, 'http://localhost');
    }
    
    const store = url.searchParams.get('store');
    const cleanPath = url.pathname;
    const segments = cleanPath.split('/').filter(Boolean);

    // Backward compatibility: redirect old path-based links (/primewell, /apex/manager) to new query format
    if (!store && segments.length > 0 && cleanPath !== '/master') {
      const legacyStore = segments[0];
      const viewOrAffiliate = segments.length > 1 ? segments[1] : '';
      const newPath = viewOrAffiliate ? `/${viewOrAffiliate}?store=${legacyStore}` : `/?store=${legacyStore}`;
      
      if (typeof window !== 'undefined') {
        window.history.replaceState({}, '', newPath);
      }
      
      setActiveSkinSlug(legacyStore.toLowerCase());
      if (viewOrAffiliate === 'manager') {
        setActiveView('manager_portal');
      } else if (viewOrAffiliate === 'affiliate') {
        setActiveView('affiliate_portal');
      } else {
        setActiveView('public_skin');
      }
      return;
    }

    // Default or Master view
    if (cleanPath === '/master' || (!store && segments.length === 0)) {
      setActiveSkinSlug('primewell');
      setActiveView('master_overview');
      return;
    }

    if (store) {
      setActiveSkinSlug(store.toLowerCase());
    }

    if (segments.length === 0) {
      setActiveView('public_skin');
    } else if (segments[0] === 'manager') {
      setActiveView('manager_portal');
    } else if (segments[0] === 'affiliate') {
      setActiveView('affiliate_portal');
    } else {
      setActiveView('public_skin');
    }
  }, []);

  const navigate = useCallback((path: string) => {
    setActivePath(path);
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
    }
    parsePath(path);
  }, [parsePath]);

  // Load all initial data
  const refreshAllData = useCallback(async () => {
    try {
      const [skins, staffList, pilots, authInfo] = await Promise.all([
        api.getSkins(),
        api.getDemoUsers(),
        api.getPilotBusinesses(),
        api.getCurrentUser(),
      ]);

      setAllSkins(skins);
      setAvailableStaff(staffList);
      setPilotBusinesses(pilots);
      if (authInfo?.user) {
        setCurrentUser(authInfo.user);
      }

      // Determine active skin
      const currentSlug = activeSkinSlug || 'primewell';
      const resolvedSkin = skins.find(s => s.slug.toLowerCase() === currentSlug.toLowerCase()) || skins[0] || null;
      setActiveSkin(resolvedSkin);

      // Load skin-specific or filtered data
      const [affList, reds, cases] = await Promise.all([
        api.getAffiliates(currentSlug),
        api.getRedemptions(currentSlug),
        api.getResponseWatchCases(currentSlug),
      ]);

      setAffiliates(affList);
      setRedemptions(reds);
      setResponseCases(cases);
    } catch (err) {
      console.error('Error fetching affiliate hub data:', err);
    }
  }, [activeSkinSlug]);

  useEffect(() => {
    parsePath(activePath);
  }, [activePath, parsePath]);

  useEffect(() => {
    refreshAllData();
  }, [activeSkinSlug, refreshAllData]);

  // Switch demo staff user
  const switchUser = async (email: string) => {
    try {
      const res = await api.switchDemoUser(email);
      if (res.success) {
        setCurrentUser(res.user);
        showToast(`Switched active session to ${res.user.name} (${res.user.role.toUpperCase()})`, 'info');
        
        // Auto-navigate to appropriate view context if requested
        if (res.user.role === 'master') {
          navigate('/master');
        } else if (res.user.role === 'manager') {
          const skin = allSkins.find(s => s.id === res.user.clientId) || allSkins[0];
          navigate(`/manager?store=${skin ? skin.slug : "primewell"}`);
        } else if (res.user.role === 'affiliate') {
          const skin = allSkins.find(s => s.id === res.user.clientId) || allSkins[0];
          navigate(`/affiliate?store=${skin ? skin.slug : "primewell"}`);
        }
        await refreshAllData();
      }
    } catch (err) {
      showToast('Failed to switch user', 'error');
    }
  };

  const updateAffiliateProfile = async (id: string, updates: Partial<AffhubAffiliate>) => {
    try {
      const updated = await api.updateAffiliate(id, updates);
      setAffiliates(prev => prev.map(a => (a.id === id ? updated : a)));
      showToast(`Affiliate profile updated for ${updated.fullName}`, 'success');
      await refreshAllData();
    } catch (err: any) {
      showToast(err.message || 'Failed to update affiliate', 'error');
    }
  };

  const updateSkinLogoOrTheme = async (slug: string, updates: Partial<AffhubClient['brandTheme']>) => {
    try {
      const updatedSkin = await api.updateSkinTheme(slug, updates);
      setAllSkins(prev => prev.map(s => (s.slug === slug ? updatedSkin : s)));
      if (activeSkin && activeSkin.slug === slug) {
        setActiveSkin(updatedSkin);
      }
      showToast(`Skin branding & logo updated for ${updatedSkin.displayName}`, 'success');
      await refreshAllData();
    } catch (err: any) {
      showToast(err.message || 'Failed to update skin branding', 'error');
    }
  };

  const addNewSkin = async (data: Parameters<typeof api.createSkin>[0]) => {
    try {
      const result = await api.createSkin(data);
      showToast(`Provisioned new skin: ${result.skin.displayName} (/${result.skin.slug})`, 'success');
      await refreshAllData();
      navigate(`/?store=${result.skin.slug}`);
    } catch (err: any) {
      showToast(err.message || 'Failed to provision skin', 'error');
    }
  };

  const addBusiness = async (data: Parameters<typeof api.addBusiness>[0]) => {
    try {
      const biz = await api.addBusiness(data);
      showToast(`Registered new pilot business: ${biz.name}`, 'success');
      await refreshAllData();
    } catch (err: any) {
      showToast(err.message || 'Failed to register business', 'error');
    }
  };

  const logNewRedemption = async (data: Parameters<typeof api.redeemPromo>[0]) => {
    try {
      const result = await api.redeemPromo(data);
      showToast(`Promo ${result.redemption.promoCode} redeemed at ${result.redemption.businessName}! +₦${result.redemption.commissionAmountNgn.toLocaleString()} earned`, 'success');
      await refreshAllData();
      return result.redemption;
    } catch (err: any) {
      showToast(err.message || 'Failed to redeem promo code', 'error');
      throw err;
    }
  };

  const resolveResponseCase = async (id: string, updates: Partial<ResponseWatchCase>) => {
    try {
      const updated = await api.updateResponseWatchCase(id, updates);
      setResponseCases(prev => prev.map(c => (c.id === id ? updated : c)));
      showToast(`Response Watch ticket updated (${updated.responseStatus.toUpperCase()})`, 'success');
      await refreshAllData();
    } catch (err: any) {
      showToast(err.message || 'Failed to update ticket', 'error');
    }
  };

  const createMysteryAuditCase = async (data: Partial<ResponseWatchCase>) => {
    try {
      const newCase = await api.createResponseWatchCase(data);
      setResponseCases(prev => [newCase, ...prev]);
      showToast(`Mystery Shopper audit ticket dispatched for ${newCase.affiliateName}`, 'success');
      await refreshAllData();
    } catch (err: any) {
      showToast(err.message || 'Failed to create audit case', 'error');
    }
  };

  return (
    <AppContext.Provider
      value={{
        activePath,
        navigate,
        activeSkinSlug,
        activeSkin,
        activeView,
        setActiveView,
        currentUser,
        availableStaff,
        switchUser,
        allSkins,
        affiliates,
        pilotBusinesses,
        redemptions,
        responseCases,
        isPosModalOpen,
        setIsPosModalOpen,
        isRlsModalOpen,
        setIsRlsModalOpen,
        selectedAffiliateModal,
        setSelectedAffiliateModal,
        toastMessage,
        showToast,
        refreshAllData,
        updateAffiliateProfile,
        updateSkinLogoOrTheme,
        addNewSkin,
        addBusiness,
        logNewRedemption,
        resolveResponseCase,
        createMysteryAuditCase,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
