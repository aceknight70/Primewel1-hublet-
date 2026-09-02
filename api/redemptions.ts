import { db } from '../src/api-lib/db';

export default function handler(req: any, res: any) {
  if (req.method === 'GET') {
    const skinSlug = req.query.skinSlug;
    const list = db.getRedemptionsForStaff(db.currentAuthUser, skinSlug ? String(skinSlug) : undefined);
    return res.json(list);
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
