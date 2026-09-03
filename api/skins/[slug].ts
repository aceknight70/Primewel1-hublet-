import { db } from '../../src/api-lib/db';
import { getSupabaseClient } from '../../src/api-lib/supabase';
import { uploadBase64ToStorage } from '../../src/api-lib/uploadBase64';

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
    const supabase = getSupabaseClient();

    let finalLogoUrl = req.body.logoUrl;
    if (req.body.logoUrl && req.body.logoUrl.startsWith('data:image/')) {
      try {
        finalLogoUrl = await uploadBase64ToStorage(req.body.logoUrl, 'brand-assets', `logo-${slug}`);
      } catch (err: any) {
        return res.status(500).json({ error: err.message });
      }
    }

    if (supabase) {
      try {
        // We must fetch existing to merge the jsonb theme
        const { data: currentData } = await supabase.from('affhub_clients').select('theme').eq('id', slug).single();
        const currentTheme = currentData?.theme || {};

        const { data, error } = await supabase.from('affhub_clients').update({
          theme: {
            ...currentTheme,
            primary_color: req.body.primaryColor !== undefined ? req.body.primaryColor : currentTheme.primary_color,
            secondary_color: req.body.secondaryColor !== undefined ? req.body.secondaryColor : currentTheme.secondary_color,
            accent_color: req.body.accentColor !== undefined ? req.body.accentColor : currentTheme.accent_color,
            logo_url: finalLogoUrl !== undefined ? finalLogoUrl : currentTheme.logo_url,
          }
        }).eq('id', slug).select();
        
        if (error) {
          return res.status(500).json({ error: 'Failed to save to Supabase: ' + error.message });
        }
        
        if (!data || data.length === 0) {
          return res.status(403).json({ error: 'Supabase update failed: RLS blocked the update.' });
        }

        // Return the updated object
        const updatedRow = data[0];
        return res.json({
          id: updatedRow.id,
          slug: fallback?.slug || updatedRow.id,
          displayName: updatedRow.name || fallback?.displayName || updatedRow.id,
          tagline: updatedRow.tagline || fallback?.tagline || '',
          curatorName: fallback?.curatorName || 'Curator',
          curatorRole: fallback?.curatorRole || 'Manager',
          curatorAvatar: fallback?.curatorAvatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
          brandTheme: {
            primaryColor: updatedRow.theme?.primary_color || fallback?.brandTheme.primaryColor || '#0b1a2e',
            secondaryColor: updatedRow.theme?.secondary_color || fallback?.brandTheme.secondaryColor || '#1e3a8a',
            accentColor: updatedRow.theme?.accent_color || fallback?.brandTheme.accentColor || '#d9a94a',
            goldAccent: updatedRow.theme?.accent_color || fallback?.brandTheme.goldAccent || '#d9a94a',
            badgeBg: fallback?.brandTheme.badgeBg || '#fef3c7',
            badgeText: fallback?.brandTheme.badgeText || '#92400e',
            logoUrl: updatedRow.theme?.logo_url || fallback?.brandTheme.logoUrl,
            coverBannerUrl: fallback?.brandTheme.coverBannerUrl,
          },
          status: updatedRow.active ? 'active' : 'draft',
          createdAt: updatedRow.created_at || fallback?.createdAt || new Date().toISOString(),
          totalAffiliatesCount: 0,
        });

      } catch (err: any) {
        return res.status(500).json({ error: 'Exception saving to Supabase: ' + err.message });
      }
    }

    // Memory fallback
    if (!existingClient) return res.status(404).json({ error: 'Client not found in memory' });
    existingClient.brandTheme = { ...existingClient.brandTheme, ...req.body };
    if (finalLogoUrl) {
      existingClient.brandTheme.logoUrl = finalLogoUrl;
    }
    return res.json(existingClient);
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
