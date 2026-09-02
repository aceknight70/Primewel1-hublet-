import { db } from '../../src/api-lib/db';

export default function handler(req: any, res: any) {
  if (req.method === 'PATCH') {
    const id = req.query.id || req.params?.id;
    const targetCase = db.responseWatchCases.find(c => c.id === id);
    if (!targetCase) return res.status(404).json({ error: 'Case not found' });

    const { responseStatus, recordedResponseHours, mysteryShopperScore, managerNotes } = req.body;
    if (responseStatus) targetCase.responseStatus = responseStatus;
    if (recordedResponseHours !== undefined) targetCase.recordedResponseHours = Number(recordedResponseHours);
    if (mysteryShopperScore !== undefined) targetCase.mysteryShopperScore = Number(mysteryShopperScore);
    if (managerNotes) targetCase.managerNotes = managerNotes;
    if (responseStatus === 'resolved') targetCase.resolvedAt = new Date().toISOString();
    
    return res.json(targetCase);
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
