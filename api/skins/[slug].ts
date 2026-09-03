import { db } from '../../src/api-lib/db';
import { getSupabaseClient } from '../../src/api-lib/supabase';

export default async function handler(req: any, res: any) {
  const slug = req.query.slug || req.params?.slug;
  const existingClient = db.clients.find(c => c.slug === slug);
  const fallback = existingClient || db.clients[0];

  if (req.method === 'GET') {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('affhub_clients').select('*').eq('id', slug).maybeSingle();
        if (!error && data) {
          const skinAffiliates = db.affiliates.filter(a => a.clientId === data.id);
          return res.json({
            id: data.id,
            slug: fallback?.slug || data.id,
            displayName: data.name || fallback?.displayName || data.id,
            tagline: data.tagline || fallback?.tagline || '',
            curatorName: fallback?.curatorName || 'Curator',
            curatorRole: fallback?.curatorRole || 'Manager',
            curatorAvatar: fallback?.curatorAvatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
            brandTheme: {
              primaryColor: data.theme?.primary_color || fallback?.brandTheme.primaryColor || '#0b1a2e',
              secondaryColor: data.theme?.secondary_color || fallback?.brandTheme.secondaryColor || '#1e3a8a',
              accentColor: data.theme?.accent_color || fallback?.brandTheme.accentColor || '#d9a94a',
              goldAccent: data.theme?.accent_color || fallback?.brandTheme.goldAccent || '#d9a94a',
              badgeBg: fallback?.brandTheme.badgeBg || '#fef3c7',
              badgeText: fallback?.brandTheme.badgeText || '#92400e',
              logoUrl: data.theme?.logo_url || fallback?.brandTheme.logoUrl,
              coverBannerUrl: fallback?.brandTheme.coverBannerUrl,
            },
            status: data.active ? 'active' : 'draft',
            createdAt: data.created_at || fallback?.createdAt || new Date().toISOString(),
            totalAffiliatesCount: skinAffiliates.length,
          });
        }
      } catch (err) {
        console.warn('Could not load from Supabase affhub_clients GET by slug:', err);
      }
    }
    // Return fallback if Supabase fails or not found
    return res.json(fallback);
  }

  if (req.method === 'PATCH') {
    if (!existingClient) return res.status(404).json({ error: 'Client not found in memory' });
    existingClient.brandTheme = { ...existingClient.brandTheme, ...req.body };
    
    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.status(500).json({ error: 'Supabase is not configured. Cannot persist changes.' });
    }

    try {
      const { data, error } = await supabase.from('affhub_clients').update({
        theme: {
          primary_color: existingClient.brandTheme.primaryColor,
          secondary_color: existingClient.brandTheme.secondaryColor,
          accent_color: existingClient.brandTheme.accentColor,
          logo_url: existingClient.brandTheme.logoUrl,
        }
      }).eq('id', existingClient.slug || existingClient.id).select();
      
      if (error) {
        return res.status(500).json({ error: 'Failed to save to Supabase: ' + error.message });
      }
      
      if (!data || data.length === 0) {
        return res.status(403).json({ error: 'Supabase update failed: Row Level Security (RLS) blocked the update on affhub_clients. Ensure you have a policy that allows updates.' });
      }

      return res.json(existingClient);
    } catch (err: any) {
      return res.status(500).json({ error: 'Exception saving to Supabase: ' + err.message });
    }
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
