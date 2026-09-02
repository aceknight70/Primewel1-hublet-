import { db } from '../../src/api-lib/db';

export default function handler(req: any, res: any) {
  if (req.method === 'PATCH') {
    const id = req.query.id || req.params?.id;
    const aff = db.affiliates.find(a => a.id === id);
    if (!aff) return res.status(404).json({ error: 'Affiliate not found' });
    Object.assign(aff, req.body);
    return res.json(aff);
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
