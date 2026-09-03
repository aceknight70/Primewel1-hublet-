import { db } from '../../src/api-lib/db';
import { getSupabaseClient } from '../../src/api-lib/supabase';

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
    if (!aff) return res.status(404).json({ error: 'Affiliate not found in memory' });
    
    Object.assign(aff, req.body);
    
    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.status(500).json({ error: 'Supabase is not configured. Cannot persist changes.' });
    }

    try {
      const { data, error } = await supabase.from('affhub_affiliates').update({
        name: aff.fullName,
        promo_code: aff.promoCode,
        tier: aff.tier,
        niche: aff.category,
        bio: aff.bio,
        whatsapp_link: aff.waChannelUrl,
        photo_url: aff.photoUrl,
        active: aff.status === 'active'
      }).eq('id', aff.id).select();

      if (error) {
        return res.status(500).json({ error: 'Failed to save to Supabase: ' + error.message });
      }

      if (!data || data.length === 0) {
        return res.status(403).json({ error: 'Supabase update failed: Row Level Security (RLS) blocked the update on affhub_affiliates. Ensure you have a policy that allows updates.' });
      }

      return res.json(aff);
    } catch (err: any) {
      return res.status(500).json({ error: 'Exception saving to Supabase: ' + err.message });
    }
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
