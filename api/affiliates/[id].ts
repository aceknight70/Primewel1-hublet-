import { db } from '../../src/api-lib/db';
import { getSupabaseClient } from '../../src/api-lib/supabase';
import { uploadBase64ToStorage } from '../../src/api-lib/uploadBase64';

export default async function handler(req: any, res: any) {
  const id = req.query.id || req.params?.id;
  const aff = db.affiliates.find(a => a.id === id);

  if (req.method === 'GET') {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('affhub_affiliates').select('*').eq('id', id).maybeSingle();
        if (!error && data) {
          const existing = aff || ({} as any);
          return res.json({
            ...existing,
            id: data.id,
            clientId: data.client_id,
            fullName: data.name,
            slug: existing.slug || data.id,
            email: existing.email || 'affiliate@hub.ng',
            niche: data.niche || existing.niche || 'Tech',
            nicheCategory: existing.nicheCategory || 'tech',
            tier: data.tier || existing.tier || 'starter',
            waNumber: existing.waNumber || '2348000000000',
            waChannelUrl: data.whatsapp_link || existing.waChannelUrl || '',
            bio: data.bio || existing.bio || '',
            photoUrl: data.photo_url || existing.photoUrl || '',
            currentlyFeaturing: data.featuring_note || existing.currentlyFeaturing || '',
            rating: existing.rating || 5.0,
            reviewCount: existing.reviewCount || 1,
            totalRedemptions: existing.totalRedemptions || 0,
            commissionEarnedNgn: existing.commissionEarnedNgn || 0,
            commissionRatePct: existing.commissionRatePct || 5.0,
            status: data.active ? 'active' : 'inactive',
            gallery: existing.gallery || [],
            promoCode: data.promo_code || existing.promoCode,
            location: existing.location || 'Lagos',
            joinedDate: data.joined_at || existing.joinedDate || new Date().toISOString()
          });
        }
      } catch (err) {
        console.warn('Could not load affiliate from Supabase GET by id:', err);
      }
    }
    if (!aff) return res.status(404).json({ error: 'Affiliate not found' });
    return res.json(aff);
  }

  if (req.method === 'PATCH') {
    const supabase = getSupabaseClient();
    
    let finalPhotoUrl = req.body.photoUrl;
    if (req.body.photoUrl && req.body.photoUrl.startsWith('data:image/')) {
      try {
        finalPhotoUrl = await uploadBase64ToStorage(req.body.photoUrl, 'brand-assets', `affiliate-${id}`);
      } catch (err: any) {
        return res.status(500).json({ error: err.message });
      }
    }

    if (supabase) {
      const updatePayload: any = {};
      if (req.body.fullName !== undefined) updatePayload.name = req.body.fullName;
      if (req.body.promoCode !== undefined) updatePayload.promo_code = req.body.promoCode;
      if (req.body.tier !== undefined) updatePayload.tier = req.body.tier;
      if (req.body.niche !== undefined || req.body.category !== undefined) updatePayload.niche = req.body.niche || req.body.category;
      if (req.body.bio !== undefined) updatePayload.bio = req.body.bio;
      if (req.body.waChannelUrl !== undefined) updatePayload.whatsapp_link = req.body.waChannelUrl;
      if (finalPhotoUrl !== undefined) updatePayload.photo_url = finalPhotoUrl;
      if (req.body.status !== undefined) updatePayload.active = req.body.status === 'active';

      if (Object.keys(updatePayload).length > 0) {
        const { data, error } = await supabase.from('affhub_affiliates').update(updatePayload).eq('id', id).select();
        if (error) {
          return res.status(500).json({ error: 'Failed to save to Supabase: ' + error.message });
        }
        if (!data || data.length === 0) {
          return res.status(403).json({ error: 'Supabase update failed: RLS blocked the update.' });
        }
      }

      // Re-fetch to return complete object
      const { data: fetchBack } = await supabase.from('affhub_affiliates').select('*').eq('id', id).maybeSingle();
      if (fetchBack) {
        const existing = aff || ({} as any);
        return res.json({
          ...existing,
          id: fetchBack.id,
          clientId: fetchBack.client_id,
          fullName: fetchBack.name,
          slug: existing.slug || fetchBack.id,
          email: existing.email || 'affiliate@hub.ng',
          niche: fetchBack.niche || existing.niche || 'Tech',
          nicheCategory: existing.nicheCategory || 'tech',
          tier: fetchBack.tier || existing.tier || 'starter',
          waNumber: existing.waNumber || '2348000000000',
          waChannelUrl: fetchBack.whatsapp_link || existing.waChannelUrl || '',
          bio: fetchBack.bio || existing.bio || '',
          photoUrl: fetchBack.photo_url || existing.photoUrl || '',
          currentlyFeaturing: fetchBack.featuring_note || existing.currentlyFeaturing || '',
          rating: existing.rating || 5.0,
          reviewCount: existing.reviewCount || 1,
          totalRedemptions: existing.totalRedemptions || 0,
          commissionEarnedNgn: existing.commissionEarnedNgn || 0,
          commissionRatePct: existing.commissionRatePct || 5.0,
          status: fetchBack.active ? 'active' : 'inactive',
          gallery: existing.gallery || [],
          promoCode: fetchBack.promo_code || existing.promoCode,
          location: existing.location || 'Lagos',
          joinedDate: fetchBack.joined_at || existing.joinedDate || new Date().toISOString()
        });
      }
    }

    // Memory fallback
    if (!aff) return res.status(404).json({ error: 'Affiliate not found in memory' });
    Object.assign(aff, { ...req.body, photoUrl: finalPhotoUrl || aff.photoUrl });
    return res.json(aff);
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
