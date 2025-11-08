import dotenv from 'dotenv';
dotenv.config();
const { default: passport, configurePassport } = await import('./config/passport.js');
configurePassport();

import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
const tagOrder = ['Service health', 'Authorization', 'Campaigns', 'Adventurers'];

import { readFileSync } from 'fs';
configurePassport();

import { connectMongo } from './db/mongoose.js';
import authRoutes from './routes/auth.js';
import adventurersRoutes from './routes/adventurers.js';
import campaignsRoutes from './routes/campaigns.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

// 1) CREATE APP FIRST
const app = express();

// 2) CORE MIDDLEWARE
app.use(express.json());
app.use(cors({
  origin: (process.env.CORS_ORIGIN || '*').split(','),
  // For JWT in Authorization header, no cookies are needed:
  credentials: false
}));
app.use(passport.initialize());

// 3) SWAGGER (load file safely)
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
      // Sort operations alphabetically to keep each tag tidy
      operationsSorter: 'alpha',

      // Force tag order without relying on an outer variable
      tagsSorter: (a, b) => {
        const order = ['Service health', 'Authorization', 'Campaigns', 'Adventurers'];
        const ai = order.indexOf(a);
        const bi = order.indexOf(b);
        if (ai === -1 && bi === -1) return a.localeCompare(b); // any unexpected tags → alpha
        if (ai === -1) return 1;  // unknown tags go last
        if (bi === -1) return -1;
        return ai - bi;
      }
    }
  })
);


// 4) HEALTH
// #swagger.tags = ['Health']
// #swagger.summary = 'Liveness probe'
app.get('/healthz', (_req, res) => {
  /* #swagger.tags = ['Service health']
     #swagger.summary = 'Liveness probe'
     #swagger.security = []  // public
     #swagger.responses[200] = { description: 'OK' }
  */
  res.json({ ok: true });
});

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
