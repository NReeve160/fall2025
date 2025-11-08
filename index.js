import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'fs';

import passport from 'passport';
// side-effect import registers Google strategy using env vars
import './config/passport.js';

import { connectMongo } from './db/mongoose.js';
import authRoutes from './routes/auth.js';
import adventurersRoutes from './routes/adventurers.js';
import campaignsRoutes from './routes/campaigns.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

// app
const app = express();

// core middleware
app.use(express.json());
app.use(
  cors({
    origin: (process.env.CORS_ORIGIN || '*').split(','),
    credentials: false, // using Authorization header, not cookies
  })
);
app.use(passport.initialize());

// swagger (loads generated swagger.json)
let swaggerDoc;
try {
  swaggerDoc = JSON.parse(readFileSync('./swagger.json', 'utf8'));
} catch {
  swaggerDoc = { openapi: '3.0.3', info: { title: 'Adventurers Guild API', version: '1.0.0' }, paths: {} };
}

app.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDoc, {
    customSiteTitle: 'Adventurers Guild API Docs',
    swaggerOptions: {
      operationsSorter: 'alpha',
      tagsSorter: (a, b) => {
        const order = ['Service health', 'Authorization', 'Campaigns', 'Adventurers'];
        const ai = order.indexOf(a);
        const bi = order.indexOf(b);
        if (ai === -1 && bi === -1) return a.localeCompare(b);
        if (ai === -1) return 1;
        if (bi === -1) return -1;
        return ai - bi;
      },
    },
  })
);

// health
app.get('/healthz', (_req, res) => {
  /* #swagger.tags = ['Service health']
     #swagger.summary = 'Liveness probe'
     #swagger.security = []
     #swagger.responses[200] = { description: 'OK' } */
  res.json({ ok: true });
});

// routes
app.use('/auth', authRoutes);
app.use('/adventurers', adventurersRoutes);
app.use('/campaigns', campaignsRoutes);

// fallthrough + error handler
app.use(notFound);
app.use(errorHandler);

// start
const PORT = process.env.PORT || 8080;
connectMongo()
  .then(() => app.listen(PORT, () => console.log(`✅ API on http://localhost:${PORT}`)))
  .catch((err) => {
    console.error('❌ Mongo connection failed:', err);
    process.exit(1);
  });
