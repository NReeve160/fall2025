// routes/auth.js
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/user.js';

const router = Router();

const baseUrl = process.env.PUBLIC_BASE_URL || 'http://localhost:8080';
const client = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: `${baseUrl}/auth/google/callback`,
});

// Utility
const encodeState = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64url');
const decodeState = (s) => {
  try { return JSON.parse(Buffer.from(s, 'base64url').toString('utf8')); }
  catch { return {}; }
};

// 1) Start OAuth: preserve json/next inside state
router.get('/google', (req, res) => {
  const stateObj = {
    json: req.query.json === '1',                                 // ← keep this!
    next: req.query.state ? decodeURIComponent(req.query.state) : (process.env.CLIENT_APP_ORIGIN || '/')
  };
  const url = client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: ['openid', 'email', 'profile'],
    state: encodeState(stateObj),                                 // ← encoded state
  });
  res.redirect(url);
});

// 2) Callback: read state → choose JSON vs redirect
router.get('/google/callback', async (req, res) => {
  try {
    const { code, state } = req.query;
    const st = decodeState(state || '');
    const { tokens } = await client.getToken(code);

    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const googleId = payload.sub;

    let user = await User.findOne({ googleId });
    if (!user) {
      user = await User.create({
        googleId,
        email: payload.email,
        name: payload.name,
        picture: payload.picture
      });
    } else {
      // optional: refresh profile
      const dirty = (user.email !== payload.email) || (user.name !== payload.name) || (user.picture !== payload.picture);
      if (dirty) { user.email = payload.email; user.name = payload.name; user.picture = payload.picture; await user.save(); }
    }

    const token = jwt.sign(
      { id: user._id.toString(), email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { algorithm: 'HS256', expiresIn: '8h' }
    );

    if (st.json) {
      // return JSON to make Swagger/REST testing trivial
      return res.json({
        token,
        user: { id: user._id, email: user.email, role: user.role, name: user.name, picture: user.picture }
      });
    }

    // otherwise redirect back to app with token in the URL fragment
    const next = st.next || process.env.CLIENT_APP_ORIGIN || '/';
    return res.redirect(`${next}#token=${encodeURIComponent(token)}`);
  } catch (err) {
    console.error('OAuth callback failed:', err);
    return res.status(400).json({ error: 'OAuth callback failed' });
  }
});

export default router;
