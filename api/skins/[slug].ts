import { db } from '../../src/api-lib/db';

export default function handler(req: any, res: any) {
  if (req.method === 'PATCH') {
    const slug = req.query.slug || req.params?.slug;
    const client = db.clients.find(c => c.slug === slug);
    if (!client) return res.status(404).json({ error: 'Client not found' });
    client.brandTheme = { ...client.brandTheme, ...req.body };
    return res.json(client);
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
