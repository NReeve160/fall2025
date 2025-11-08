// routes/auth.js
import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = Router();

// Quick ping to confirm the router is mounted
router.get('/ping', (_req, res) => res.json({ ok: true }));

// Start Google OAuth
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

// Callback → issue JWT and show it
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/auth/failure' }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user.id, email: req.user.email, role: req.user.role },
      process.env.JWT_SECRET || 'dev_secret',
      { expiresIn: '1h' }
    );
    res.type('html').send(`
      <h1>JWT Issued</h1>
      <p>Copy this token, click "Authorize" in /docs (Bearer), and paste it.</p>
      <textarea style="width:100%;height:180px;">${token}</textarea>
      <p><a href="/docs">Go to API Docs</a></p>
    `);
  }
);

router.get('/failure', (_req, res) => res.status(401).json({ error: 'Login failed' }));

export default router;
