// routes/adventurers.js
import { Router } from 'express';
import mongoose from 'mongoose';
import Adventurer from '../models/adventurer.js';

const router = Router();

const isId = (id) => mongoose.Types.ObjectId.isValid(id);
const badReq = (res, msg) => res.status(400).json({ error: msg });

// #swagger.tags = ['Adventurers']
// #swagger.summary = 'List adventurers'
// #swagger.security = [{ "bearerAuth": [] }]
router.get('/', async (req, res, next) => {
  try {
    const filter = req.query.campaign && isId(req.query.campaign)
      ? { campaign: req.query.campaign }
      : {};
    const items = await Adventurer.find(filter).lean();
    res.json(items);
  } catch (e) { next(e); }
});

// #swagger.tags = ['Adventurers']
// #swagger.summary = 'Create adventurer'
// #swagger.security = [{ "bearerAuth": [] }]
router.post('/', async (req, res, next) => {
  try {
    const created = await Adventurer.create(req.body);
    res.status(201).json(created);
  } catch (e) {
    if (e?.name === 'ValidationError') return badReq(res, e.message);
    next(e);
  }
});

// #swagger.tags = ['Adventurers']
// #swagger.summary = 'Get adventurer by id'
// #swagger.security = [{ "bearerAuth": [] }]
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isId(id)) return badReq(res, 'Invalid id');

    const item = await Adventurer.findById(id);
    if (!item) return res.status(404).json({ error: 'Not found' });

    res.json(item);
  } catch (e) { next(e); }
});

// #swagger.tags = ['Adventurers']
// #swagger.summary = 'Update adventurer'
// #swagger.security = [{ "bearerAuth": [] }]
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isId(id)) return badReq(res, 'Invalid id');

    const updated = await Adventurer.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updated) return res.status(404).json({ error: 'Not found' });

    res.json(updated);
  } catch (e) {
    if (e?.name === 'ValidationError') return badReq(res, e.message);
    next(e);
  }
});

// #swagger.tags = ['Adventurers']
// #swagger.summary = 'Delete adventurer'
// #swagger.security = [{ "bearerAuth": [] }]
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isId(id)) return badReq(res, 'Invalid id');

    const deleted = await Adventurer.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });

    res.status(204).send();
  } catch (e) { next(e); }
});

export default router;
