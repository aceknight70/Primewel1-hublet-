import { db } from '../../src/api-lib/db';
import { getSupabaseClient } from '../../src/api-lib/supabase';

export default async function handler(req: any, res: any) {
  if (req.method === 'PATCH') {
    const slug = req.query.slug || req.params?.slug;
    const client = db.clients.find(c => c.slug === slug);
    if (!client) return res.status(404).json({ error: 'Client not found in memory' });

    client.brandTheme = { ...client.brandTheme, ...req.body };
    
    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.status(500).json({ error: 'Supabase is not configured. Cannot persist changes.' });
    }

    try {
      const { data, error } = await supabase.from('affhub_clients').update({
        theme: {
          primary_color: client.brandTheme.primaryColor,
          secondary_color: client.brandTheme.secondaryColor,
          accent_color: client.brandTheme.accentColor,
          logo_url: client.brandTheme.logoUrl,
        }
      }).eq('id', client.slug || client.id).select();
      
      console.log('Update result:', data, error);

      if (error) {
        return res.status(500).json({ error: 'Failed to save to Supabase: ' + error.message });
      }
      
      if (!data || data.length === 0) {
        return res.status(403).json({ error: 'Supabase update failed: Row Level Security (RLS) blocked the update on affhub_clients. Ensure you have a policy that allows updates.' });
      }

      return res.json(client);
    } catch (err: any) {
      return res.status(500).json({ error: 'Exception saving to Supabase: ' + err.message });
    }
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
