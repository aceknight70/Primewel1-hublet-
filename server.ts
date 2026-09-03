import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

// Import our new Vercel serverless functions
import authStaff from './api/auth/staff.js';
import skins from './api/skins.js';
import skinsSlug from './api/skins/[slug].js';
import businesses from './api/businesses.js';
import affiliates from './api/affiliates.js';
import affiliatesId from './api/affiliates/[id].js';
import promoRedeem from './api/promo/redeem.js';
import redemptions from './api/redemptions.js';
import responseWatch from './api/response-watch.js';
import responseWatchId from './api/response-watch/[id].js';
import auditRls from './api/audit-rls.js';



async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Mount Vercel functions as Express routes to simulate Vercel locally
  // This allows the AI Studio preview to continue working perfectly while
  // giving the user the exact Vercel structure they requested.
  app.all('/api/auth/staff', (req, res) => authStaff(req, res));
  
  app.all('/api/skins', (req, res) => skins(req, res));
  app.all('/api/skins/:slug', (req, res) => skinsSlug(req, res));
  
  app.all('/api/businesses', (req, res) => businesses(req, res));
  
  app.all('/api/affiliates', (req, res) => affiliates(req, res));
  app.all('/api/affiliates/:id', (req, res) => affiliatesId(req, res));
  
  app.post('/api/promo/redeem', (req, res) => promoRedeem(req, res));
  app.all('/api/redemptions', (req, res) => redemptions(req, res));
  
  app.all('/api/response-watch', (req, res) => responseWatch(req, res));
  app.all('/api/response-watch/:id', (req, res) => responseWatchId(req, res));
  
  app.all('/api/audit-rls', (req, res) => auditRls(req, res));

  // --- VITE MIDDLEWARE / SPA SERVING (For local preview only) ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Vercel Emulator running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
