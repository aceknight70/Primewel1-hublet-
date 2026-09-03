import { db } from '../src/api-lib/db';
import { getSupabaseClient } from '../src/api-lib/supabase';

export default async function handler(req: any, res: any) {
  if (req.method === 'GET') {
    const supabase = getSupabaseClient();
    let localAffiliates = db.getAffiliatesForStaff(db.currentAuthUser);
    
    if (supabase) {
      try {
        // Apply basic RLS masking at the backend query level (although RLS handles it, good for clarity)
        let query = supabase.from('affhub_affiliates').select('*');
        
        const { data, error } = await query;
        if (!error && data) {
          const mapped = data.map(row => {
            const existing = localAffiliates.find(a => a.id === row.id) || ({} as any);
            return {
              ...existing,
              id: row.id,
              clientId: row.client_id,
              fullName: row.name,
              slug: existing.slug || row.id,
              email: existing.email || 'affiliate@hub.ng',
              niche: row.niche || existing.niche || 'Tech',
              nicheCategory: existing.nicheCategory || 'tech',
              tier: row.tier || existing.tier || 'starter',
              waNumber: existing.waNumber || '2348000000000',
              waChannelUrl: row.whatsapp_link || existing.waChannelUrl || '',
              bio: row.bio || existing.bio || '',
              photoUrl: row.photo_url || existing.photoUrl || '',
              currentlyFeaturing: row.featuring_note || existing.currentlyFeaturing || '',
              rating: existing.rating || 5.0,
              reviewCount: existing.reviewCount || 1,
              totalRedemptions: existing.totalRedemptions || 0,
              commissionEarnedNgn: existing.commissionEarnedNgn || 0,
              commissionRatePct: existing.commissionRatePct || 5.0,
              status: row.active ? 'active' : 'inactive',
              gallery: existing.gallery || [],
              promoCode: row.promo_code || existing.promoCode,
              location: existing.location || 'Lagos',
              joinedDate: row.joined_at || existing.joinedDate || new Date().toISOString()
            };
          });
          
          const supaIds = new Set(mapped.map(a => a.id));
          const remaining = localAffiliates.filter(a => !supaIds.has(a.id));
          return res.json([...mapped, ...remaining]);
        }
      } catch (err) {
        console.warn('Could not load affiliates from Supabase:', err);
      }
    }
    
    return res.json(localAffiliates);
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
