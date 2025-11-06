// routes/auth.js
import { Router } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();

/**
 * Dev-only login to get a JWT quickly for testing.
 * POST /auth/dev-login { "email": "you@example.com", "id": "64d..." }
 */
router.post('/dev-login', (req, res) => {
  const { email = 'dev@example.com', id = '000000000000000000000001', role = 'PLAYER' } = req.body || {};
  const token = jwt.sign({ id, email, role }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' });
  res.json({ token });
});

export default router;
