export type StaffRole = 'affiliate' | 'manager' | 'master';
export type AffiliateTier = 'starter' | 'verified' | 'prime';
export type FundingModel = 'business-absorbed' | 'affiliate-absorbed' | 'split' | 'none';
export type CaseStatus = 'pending' | 'under_review' | 'resolved' | 'escalated';
export type CaseIssueType = 'delayed_response' | 'pricing_discrepancy' | 'out_of_stock' | 'mystery_audit' | 'general_enquiry';

export interface BrandTheme {
  primaryColor: string; // e.g. '#0F2C59'
  secondaryColor: string; // e.g. '#1E3A8A'
  accentColor: string; // e.g. '#D4AF37'
  goldAccent: string; // e.g. '#E5BA73'
  badgeBg: string;
  badgeText: string;
  logoUrl?: string;
  coverBannerUrl?: string;
}

export interface AffhubClient {
  id: string;
  slug: string; // e.g. 'primewell'
  displayName: string; // e.g. 'PrimeWell Hub'
  tagline: string; // e.g. 'Verified Lifestyle & Tech Affiliates'
  curatorName: string; // e.g. 'Osita'
  curatorRole: string;
  curatorAvatar: string;
  brandTheme: BrandTheme;
  status: 'active' | 'maintenance' | 'draft';
  createdAt: string;
  totalAffiliatesCount?: number;
  totalRedemptionsCount?: number;
  totalVolumeNgn?: number;
}

export interface AffhubStaff {
  id: string;
  clientId: string | null; // null for master role
  email: string;
  name: string;
  role: StaffRole;
  affiliateId?: string | null;
  avatarUrl: string;
  title: string;
  createdAt: string;
}

export interface AffhubAffiliate {
  id: string;
  clientId: string; // strictly isolated to skin
  fullName: string;
  slug: string;
  email: string;
  niche: string; // e.g. 'Apple Ecosystem & Pro Audio', 'Smart Home & Solar'
  nicheCategory: 'tech' | 'interior' | 'audio' | 'appliances' | 'lifestyle' | 'gaming';
  tier: AffiliateTier;
  waNumber: string; // e.g. '2348012345678'
  waChannelUrl?: string;
  bio: string;
  photoUrl: string;
  currentlyFeaturing: string; // e.g. 'HiTech M3 MacBook Pro Batch + Jotra Ergonomic Desks'
  rating: number; // e.g. 4.9
  reviewCount: number;
  totalRedemptions: number;
  commissionEarnedNgn: number;
  commissionRatePct: number; // e.g. 5%
  status: 'active' | 'pending' | 'suspended';
  gallery: string[];
  promoCode: string; // e.g. 'PW-CHIDI-TECH'
  location: string;
  joinedDate: string;
}

export interface PilotBusiness {
  id: string;
  name: string; // e.g. 'HiTech Distributors'
  industry: string;
  slug: string; // e.g. 'hitech'
  logoUrl: string;
  defaultDiscountPct: number; // e.g. 7.5%
  defaultCommissionPct: number; // e.g. 5.0%
  fundingModel: FundingModel;
  tableTarget: string; // e.g. 'hitech_enquiries' / 'hitech_checkouts'
  posTerminals: string[];
  contactEmail: string;
  contactWa: string;
  isActive: boolean;
}

export interface SkinBusinessConfig {
  id: string;
  clientId: string;
  businessId: string;
  customCommissionPct: number;
  customDiscountPct: number;
  fundingModel: FundingModel;
  isActive: boolean;
  notes?: string;
}

export interface PromoRedemption {
  id: string;
  promoCode: string;
  affiliateId: string;
  affiliateName: string;
  clientId: string;
  clientName: string;
  businessId: string;
  businessName: string;
  orderId: string;
  grossAmountNgn: number;
  discountAmountNgn: number;
  commissionAmountNgn: number;
  customerPhone: string;
  customerName: string;
  itemsSummary: string;
  redeemedAt: string;
  posTerminalId: string;
  status: 'verified' | 'paid' | 'flagged';
  fundingModel: FundingModel;
}

export interface ResponseWatchCase {
  id: string;
  clientId: string;
  affiliateId: string;
  affiliateName: string;
  customerName: string;
  customerWa: string;
  businessId: string;
  businessName: string;
  issueType: CaseIssueType;
  responseStatus: CaseStatus;
  slaTargetHours: number;
  recordedResponseHours?: number;
  mysteryShopperScore?: number; // 1 to 10
  mysteryShopperNotes: string;
  managerNotes?: string;
  assignedManagerId?: string;
  assignedManagerName?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface RlsAuditReport {
  timestamp: string;
  currentAuthUser: AffhubStaff;
  targetClientScope: string | null;
  tests: {
    name: string;
    description: string;
    passed: boolean;
    reason: string;
    recordCountVisible: number;
  }[];
}
