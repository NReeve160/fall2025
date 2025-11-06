import express from 'express';
import cors from 'cors';
import cookieSession from 'cookie-session';
import passport from 'passport';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';

import { readFileSync } from 'fs';
const swaggerDoc = JSON.parse(readFileSync('./swagger.json', 'utf8'));
import { connectMongo } from './db/mongoose.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors({ origin: (process.env.CORS_ORIGIN || '*').split(','), credentials: true }));

app.use(cookieSession({
  name: 'session',
  keys: [process.env.COOKIE_KEY || 'fallback_key'],
  maxAge: 10 * 60 * 1000
}));

app.use(passport.initialize());
app.use(passport.session());

// ✅ Updated to swagger.json
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.get('/healthz', (_req, res) => res.json({ ok: true }));

app.use('/', apiRoutes);

app.use(notFound);
app.use(errorHandler);

connectMongo()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`✅ Adventurers Guild API running at http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error('❌ Mongo connection failed:', err);
    process.exit(1);
  });
