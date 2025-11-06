// routes/auth.js
import { Router } from 'express';

const router = Router();

// Placeholder endpoints so the app starts
router.get('/google', (_req, res) => {
  res.json({ todo: 'Implement Google OAuth here' });
});

router.get('/success', (_req, res) => {
  res.json({ message: 'OAuth success placeholder' });
});

router.get('/failure', (_req, res) => {
  res.status(401).json({ error: 'OAuth failed (placeholder)' });
});

export default router;
