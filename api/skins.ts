import { db } from '../src/api-lib/db';
import { getSupabaseClient } from '../src/api-lib/supabase';
import { AffhubClient } from '../src/types';

export default async function handler(req: any, res: any) {
  if (req.method === 'GET') {
    const supabase = getSupabaseClient();
    let clients: AffhubClient[] = [...db.clients];

    if (supabase) {
      try {
        const { data, error } = await supabase.from('affhub_clients').select('*');
        if (!error && data && data.length > 0) {
          // Merge Supabase clients
          const supaClients: AffhubClient[] = data.map((row: any) => {
            const existing = db.clients.find(c => c.id === row.id || c.slug === row.id);
            return {
              id: row.id,
              slug: existing?.slug || row.id,
              displayName: row.name || existing?.displayName || row.id,
              tagline: row.tagline || existing?.tagline || '',
              curatorName: existing?.curatorName || 'Curator',
              curatorRole: existing?.curatorRole || 'Manager',
              curatorAvatar: existing?.curatorAvatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
              brandTheme: {
                primaryColor: row.theme?.primary_color || existing?.brandTheme.primaryColor || '#0b1a2e',
                secondaryColor: row.theme?.secondary_color || existing?.brandTheme.secondaryColor || '#1e3a8a',
                accentColor: row.theme?.accent_color || existing?.brandTheme.accentColor || '#d9a94a',
                goldAccent: row.theme?.accent_color || existing?.brandTheme.goldAccent || '#d9a94a',
                badgeBg: existing?.brandTheme.badgeBg || '#fef3c7',
                badgeText: existing?.brandTheme.badgeText || '#92400e',
                logoUrl: row.theme?.logo_url || existing?.brandTheme.logoUrl,
                coverBannerUrl: existing?.brandTheme.coverBannerUrl,
              },
              status: row.active ? 'active' : 'draft',
              createdAt: row.created_at || existing?.createdAt || new Date().toISOString(),
              totalAffiliatesCount: 0,
            };
          });

          // Add any existing seed skins that are not in Supabase yet (like apex)
          const supaIds = new Set(supaClients.map(c => c.id));
          const remaining = db.clients.filter(c => !supaIds.has(c.id));
          clients = [...supaClients, ...remaining];
        }
      } catch (err) {
        console.warn('Could not load from Supabase affhub_clients:', err);
      }
    }

    const enriched = clients.map(client => {
      const skinAffiliates = db.affiliates.filter(a => a.clientId === client.id);
      return {
        ...client,
        totalAffiliatesCount: skinAffiliates.length,
      };
    });
    return res.json(enriched);
  }
  if (req.method === 'POST') {
    const newSkin = req.body;
    db.clients.push(newSkin);

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('affhub_clients').insert({
          id: newSkin.id || newSkin.slug,
          name: newSkin.displayName,
          tagline: newSkin.tagline,
          theme: {
            primary_color: newSkin.brandTheme?.primaryColor,
            secondary_color: newSkin.brandTheme?.secondaryColor,
            accent_color: newSkin.brandTheme?.accentColor,
            logo_url: newSkin.brandTheme?.logoUrl || null,
          },
          active: true,
        });
      } catch (err) {
        console.warn('Could not insert skin into Supabase:', err);
      }
    }

    return res.status(201).json(newSkin);
  }
  return res.status(405).json({ error: 'Method not allowed' });
}

