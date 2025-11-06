import express from 'express';
import cors from 'cors';
import cookieSession from 'cookie-session';
import passport from 'passport';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'fs';

import { connectMongo } from './db/mongoose.js';
import authRoutes from './routes/auth.js';
import adventurersRoutes from './routes/adventurers.js';
import campaignsRoutes from './routes/campaigns.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

dotenv.config();

// 1) CREATE APP FIRST
const app = express();

// 2) CORE MIDDLEWARE
app.use(express.json());
app.use(cors({ origin: (process.env.CORS_ORIGIN || '*').split(','), credentials: true }));
app.use(cookieSession({
  name: 'session',
  keys: [process.env.COOKIE_KEY || 'fallback_key'],
  maxAge: 10 * 60 * 1000
}));
app.use(passport.initialize());
app.use(passport.session());

// 3) SWAGGER (load file safely)
let swaggerDoc;
try {
  swaggerDoc = JSON.parse(readFileSync('./swagger.json', 'utf8'));
} catch {
  swaggerDoc = { openapi: '3.0.3', info: { title: 'Adventurers Guild API', version: '1.0.0' }, paths: {} };
}
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// 4) HEALTH
// #swagger.tags = ['Health']
// #swagger.summary = 'Liveness probe'
app.get('/healthz', (_req, res) => res.json({ ok: true }));


// 5) ROUTES
app.use('/auth', authRoutes);
app.use('/adventurers', adventurersRoutes);
app.use('/campaigns', campaignsRoutes);

// 6) 404 + ERROR HANDLER
app.use(notFound);
app.use(errorHandler);

// 7) START AFTER DB CONNECTS
const PORT = process.env.PORT || 8080;
connectMongo()
  .then(() => app.listen(PORT, () => console.log(`✅ API on http://localhost:${PORT}`)))
  .catch((err) => {
    console.error('❌ Mongo connection failed:', err);
    process.exit(1);
  });
