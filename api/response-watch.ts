import { db } from '../src/api-lib/db';
import { ResponseWatchCase } from '../src/types';

export default function handler(req: any, res: any) {
  if (req.method === 'GET') {
    const skinSlug = req.query.skinSlug;
    const list = db.getResponseWatchForStaff(db.currentAuthUser, skinSlug ? String(skinSlug) : undefined);
    return res.json(list);
  }
  if (req.method === 'POST') {
    const { clientId, affiliateId, customerName, customerWa, businessId, issueType, mysteryShopperNotes, slaTargetHours } = req.body;
    const aff = db.affiliates.find(a => a.id === affiliateId);
    const biz = db.pilotBusinesses.find(b => b.id === businessId);

    const newCase: ResponseWatchCase = {
      id: `rw-case-${Date.now()}`,
      clientId: clientId || aff?.clientId || 'client-pw-001',
      affiliateId,
      affiliateName: aff?.fullName || 'Affiliate',
      customerName: customerName || 'Mystery Auditor',
      customerWa: customerWa || '2348000000000',
      businessId: businessId || 'biz-hitech',
      businessName: biz?.name || 'HiTech Distributors',
      issueType: issueType || 'mystery_audit',
      responseStatus: 'pending',
      slaTargetHours: Number(slaTargetHours) || 2.0,
      mysteryShopperNotes: mysteryShopperNotes || 'Routine Response Watch assessment ticket',
      assignedManagerName: 'Osita',
      createdAt: new Date().toISOString(),
    };
    db.responseWatchCases.unshift(newCase);
    return res.status(201).json(newCase);
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
