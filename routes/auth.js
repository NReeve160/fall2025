// routes/auth.js
import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import Adventurer from '../models/adventurer.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();
const isId = (id) => mongoose.Types.ObjectId.isValid(id);

/* Promote an adventurer to DM (requires auth) */
router.put('/adventurers/:id/role', requireAuth, async (req, res, next) => {
  /* #swagger.tags = ['Authorization']
     #swagger.summary = 'Promote adventurer to DM'
     #swagger.description = "Sets the specified adventurer's role to DM so they can create campaigns."
     #swagger.security = [{ bearerAuth: [] }]
     #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
     #swagger.responses[200] = {
       description: 'Adventurer role updated',
       content: { 'application/json': { schema: { type: 'object', properties: {
         _id: { type: 'string' }, name: { type: 'string' }, role: { type: 'string' }
       } } } }
     }
     #swagger.responses[400] = { description: 'Invalid id' }
     #swagger.responses[401] = { description: 'Unauthorized' }
     #swagger.responses[404] = { description: 'Not Found' }
  */
  try {
    const { id } = req.params;
    if (!isId(id)) return res.status(400).json({ error: 'Invalid id' });

    const updated = await Adventurer.findByIdAndUpdate(
      id,
      { role: 'DM' },
      { new: true, runValidators: true }
    ).lean();

    if (!updated) return res.status(404).json({ error: 'Not found' });
    return res.json({ _id: updated._id, name: updated.name, role: updated.role });
  } catch (e) {
    next(e);
  }
});

/* Ping (router mounted check) */
router.get('/ping', (_req, res) => {
  /* #swagger.tags = ['Authorization']
     #swagger.summary = 'Ping (router mounted check)'
     #swagger.security = []  // public
     #swagger.responses[200] = { description: 'OK' }
  */
  res.json({ ok: true });
});

/* Start Google OAuth (open in browser; not usable via Try it out) */
router.get(
  '/google',
  (req, res, next) => {
    /* #swagger.tags = ['Authorization']
       #swagger.summary = 'Login with Google (browser redirect)'
       #swagger.description = 'Opens Google sign-in and redirects back to /auth/google/callback. Use a browser, not Swagger "Try it out".'
       #swagger.security = []  // public
       #swagger.responses[302] = { description: 'Redirect to Google' }
    */
    next();
  },
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

/* Google OAuth callback → issue JWT (renders HTML with token) */
router.get(
  '/google/callback',
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

/* Auth failure */
router.get('/failure', (_req, res) => {
  /* #swagger.tags = ['Authorization']
     #swagger.summary = 'OAuth failure'
     #swagger.security = []  // public
     #swagger.responses[401] = { description: 'Login failed' }
  */
  res.status(401).json({ error: 'Login failed' });
});

/* DEV-ONLY: mint a JWT without Google (works in Swagger) */
router.get('/dev-token', (req, res) => {
  /* #swagger.tags = ['Authorization']
     #swagger.summary = 'DEV ONLY: issue a JWT without Google'
     #swagger.description = 'Public in development; returns a short-lived JWT for Swagger testing.'
     #swagger.security = []   // public (no Bearer)
     #swagger.parameters['key']   = { in: 'query', required: true, schema: { type: 'string' }, description: 'DEV_TOKEN_KEY from .env' }
     #swagger.parameters['email'] = { in: 'query', required: false, schema: { type: 'string' }, example: 'demo@example.com' }
     #swagger.parameters['role']  = { in: 'query', required: false, schema: { type: 'string' }, example: 'PLAYER' }
     #swagger.parameters['id']    = { in: 'query', required: false, schema: { type: 'string' }, example: 'demo' }
     #swagger.responses[200] = { description: 'JWT issued', content: { 'application/json': { schema: { type: 'object', properties: { token: { type: 'string' } } } } } }
     #swagger.responses[403] = { description: 'Forbidden' }
     #swagger.responses[500] = { description: 'Server misconfig' }
  */
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: 'Disabled in production' });
  }
  if (!process.env.DEV_TOKEN_KEY) {
    return res.status(500).json({ error: 'Server missing DEV_TOKEN_KEY' });
  }

  const { key, email = 'demo@example.com', role = 'PLAYER', id = 'demo' } = req.query;
  if (key !== process.env.DEV_TOKEN_KEY) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const token = jwt.sign({ id, email, role }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '1h' });
  return res.json({ token });
});

/* Who am I? (decode JWT) */
router.get('/me', requireAuth, (req, res) => {
  /* #swagger.tags = ['Authorization']
     #swagger.summary = 'Who am I? (requires Bearer JWT)'
     #swagger.security = [{ bearerAuth: [] }]
     #swagger.responses[200] = { description: 'User payload' }
  */
  res.json({ user: req.user });
});

export default router;
