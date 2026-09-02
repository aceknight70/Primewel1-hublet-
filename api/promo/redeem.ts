import { db } from '../../src/api-lib/db';
import { PromoRedemption } from '../../src/types';

export default function handler(req: any, res: any) {
  if (req.method === 'POST') {
    const {
      promoCode,
      businessId,
      orderId,
      grossAmountNgn,
      customerPhone,
      customerName,
      itemsSummary,
      posTerminalId,
    } = req.body;

    const cleanCode = String(promoCode).trim().toUpperCase();
    const affiliate = db.affiliates.find(a => a.promoCode.toUpperCase() === cleanCode);
    if (!affiliate) {
      return res.status(400).json({ error: 'Cannot redeem: Promo code not found' });
    }

    const client = db.clients.find(c => c.id === affiliate.clientId);
    const business = db.pilotBusinesses.find(b => b.id === businessId || b.slug === businessId) || db.pilotBusinesses[0];
    
    const skinConfig = db.skinConfigs.find(c => c.clientId === affiliate.clientId && c.businessId === business.id);
    const discountPct = skinConfig ? skinConfig.customDiscountPct : business.defaultDiscountPct;
    const commissionPct = skinConfig ? skinConfig.customCommissionPct : affiliate.commissionRatePct;
    const fundingModel = skinConfig ? skinConfig.fundingModel : business.fundingModel;

    const gross = Number(grossAmountNgn) || 2500000;
    const discountAmount = Math.round((gross * discountPct) / 100);
    const commissionAmount = Math.round((gross * commissionPct) / 100);

    const newRedemption: PromoRedemption = {
      id: `red-${Date.now()}`,
      promoCode: affiliate.promoCode,
      affiliateId: affiliate.id,
      affiliateName: affiliate.fullName,
      clientId: client?.id || 'client-pw-001',
      clientName: client?.displayName || 'PrimeWell Hub',
      businessId: business.id,
      businessName: business.name,
      orderId: orderId || `POS-${Math.floor(100000 + Math.random() * 900000)}`,
      grossAmountNgn: gross,
      discountAmountNgn: discountAmount,
      commissionAmountNgn: commissionAmount,
      customerPhone: customerPhone || '+234 800 000 0000',
      customerName: customerName || 'Retail Customer',
      itemsSummary: itemsSummary || 'Direct Store Checkout Transaction',
      redeemedAt: new Date().toISOString(),
      posTerminalId: posTerminalId || business.posTerminals[0] || 'POS-DEFAULT-01',
      status: 'verified',
      fundingModel,
    };

    db.redemptions.unshift(newRedemption);
    affiliate.totalRedemptions += 1;
    affiliate.commissionEarnedNgn += commissionAmount;

    return res.status(201).json({
      success: true,
      message: `Redemption logged successfully for ${affiliate.fullName}`,
      redemption: newRedemption,
      updatedAffiliateBalance: affiliate.commissionEarnedNgn,
    });
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
