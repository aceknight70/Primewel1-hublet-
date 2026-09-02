import { db } from '../src/api-lib/db';
import { getSupabaseClient } from '../src/api-lib/supabase';

export default async function handler(req: any, res: any) {
  if (req.method === 'GET') {
    return res.json(db.getAffiliatesForStaff(db.currentAuthUser));
  }
  if (req.method === 'POST') {
    const newAff = req.body;
    db.affiliates.push(newAff);
    
    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.status(500).json({ error: 'Supabase is not configured. Cannot persist changes.' });
    }

    try {
      const { data, error } = await supabase.from('affhub_affiliates').insert({
        id: newAff.id,
        client_id: newAff.clientId,
        name: newAff.fullName,
        promo_code: newAff.promoCode,
        tier: newAff.tier || 'starter',
        niche: newAff.category,
        bio: newAff.bio,
        whatsapp_link: newAff.waChannelUrl,
        photo_url: newAff.photoUrl,
        active: newAff.status === 'active'
      });

      if (error) {
        return res.status(500).json({ error: 'Failed to save new affiliate to Supabase: ' + error.message });
      }
    } catch (err: any) {
      return res.status(500).json({ error: 'Exception saving to Supabase: ' + err.message });
    }

    return res.status(201).json(newAff);
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
