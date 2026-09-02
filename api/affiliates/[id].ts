import { db } from '../../src/api-lib/db';
import { getSupabaseClient } from '../../src/api-lib/supabase';

export default async function handler(req: any, res: any) {
  if (req.method === 'PATCH') {
    const id = req.query.id || req.params?.id;
    const aff = db.affiliates.find(a => a.id === id);
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
