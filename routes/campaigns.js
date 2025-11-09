import { Router } from 'express';
import Campaign from '../models/campaign.js';
import Adventurer from '../models/adventurer.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();

/* List all campaigns (public) */
router.get('/', async (_req, res, next) => {
  try {
    const items = await Campaign.find().lean();
    res.json(items);
  } catch (e) {
    next(e);
  }
});

/* Create campaign (any authenticated user) */
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const body = { ...req.body };
    // Default DM to the authenticated user's email
    if (!body.dm) body.dm = req.user?.email || 'unknown@example.com';
    const created = await Campaign.create(body);
    res.status(201).json(created);
  } catch (e) {
    next(e);
  }
});

/* Get campaign by ID (public) */
router.get('/:id', async (req, res, next) => {
  try {
    const item = await Campaign.findById(req.params.id).lean();
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (e) {
    next(e);
  }
});

/* List adventurers in a campaign (auth required) */
router.get('/:id/adventurers', requireAuth, async (req, res, next) => {
  try {
    const adventurers = await Adventurer.find({ campaign: req.params.id }).lean();
    res.json(adventurers);
  } catch (err) {
    next(err);
  }
});

/* Update campaign (any authenticated user) */
router.put('/:id', requireAuth, async (req, res, next) => {
  try {
    const updated = await Campaign.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).lean();
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (e) {
    next(e);
  }
});

/* Delete campaign (any authenticated user) */
router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const deleted = await Campaign.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.status(204).end();
  } catch (e) {
    next(e);
  }
});

export default router;
