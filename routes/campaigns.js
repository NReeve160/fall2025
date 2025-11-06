// routes/campaigns.js
import { Router } from 'express';
import mongoose from 'mongoose';
import Campaign from '../models/campaign.js';
import { requireAuth } from '../middleware/requireAuth.js';
import Adventurer from '../models/adventurer.js';

const router = Router();
const isId = (id) => mongoose.Types.ObjectId.isValid(id);
const badReq = (res, msg) => res.status(400).json({ error: msg });

// #swagger.tags = ['Campaigns']
// #swagger.summary = 'List campaigns'
router.get('/', async (_req, res, next) => {
  try {
    const items = await Campaign.find().lean();
    res.json(items);
  } catch (e) { next(e); }
});

// #swagger.tags = ['Campaigns']
// #swagger.summary = 'Create campaign'
// #swagger.requestBody = { required: true, content: { "application/json": { schema: {
//    type: "object",
//    required: ["name","dm"],
//    properties: {
//      name:{type:"string"}, description:{type:"string"},
//      dm:{type:"string"}, players:{type:"array",items:{type:"string"}},
//      system:{type:"string"}, status:{type:"string",enum:["active","paused","finished"]}
//    } } } } }
// #swagger.responses[201] = { description: 'Created' }
router.post('/', async (req, res, next) => {
  try {
    const created = await Campaign.create(req.body);
    res.status(201).json(created);
  } catch (e) {
    if (e?.name === 'ValidationError') return badReq(res, e.message);
    next(e);
  }
});

// #swagger.tags = ['Campaigns']
// #swagger.summary = 'Get campaign by id'
// #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isId(id)) return badReq(res, 'Invalid id');
    const item = await Campaign.findById(id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (e) { next(e); }
});

// GET all adventurers linked to a campaign
//#swagger.tags = ['Campaigns']
//#swagger.summary = 'List adventurers in a campaign'
//#swagger.description = 'Returns all adventurers that reference this campaign ID'
//#swagger.security = [{ bearerAuth: [] }]
router.get('/:id/adventurers', requireAuth, async (req, res, next) => {
  try {
    const adventurers = await Adventurer.find({ campaign: req.params.id });
    res.json(adventurers);
  } catch (err) {
    next(err);
  }
});


// #swagger.tags = ['Campaigns']
// #swagger.summary = 'Update campaign'
// #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
// #swagger.requestBody = { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/Campaign" } } } }
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isId(id)) return badReq(res, 'Invalid id');
    const updated = await Campaign.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (e) {
    if (e?.name === 'ValidationError') return badReq(res, e.message);
    next(e);
  }
});

// #swagger.tags = ['Campaigns']
// #swagger.summary = 'Delete campaign'
// #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isId(id)) return badReq(res, 'Invalid id');
    const deleted = await Campaign.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.status(204).send();
  } catch (e) { next(e); }
});

export default router;
