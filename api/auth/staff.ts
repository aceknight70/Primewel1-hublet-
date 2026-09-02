import { db } from '../../src/api-lib/db';

export default function handler(req: any, res: any) {
  if (req.method === 'GET') {
    return res.json({ user: db.currentAuthUser, availableStaff: db.staff });
  }
  if (req.method === 'POST') {
    const { email } = req.body;
    const user = db.staff.find(s => s.email === email);
    if (!user) return res.status(404).json({ error: 'User not found' });
    db.currentAuthUser = user;
    return res.json({ success: true, user: db.currentAuthUser });
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
