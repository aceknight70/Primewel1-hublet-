import { db } from '../src/api-lib/db';

export default function handler(req: any, res: any) {
  if (req.method === 'GET') {
    return res.json(db.pilotBusinesses);
  }
  if (req.method === 'POST') {
    db.pilotBusinesses.push(req.body);
    return res.status(201).json(req.body);
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
