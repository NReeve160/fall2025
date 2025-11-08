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

  /* #swagger.tags = ['Campaigns']
     #swagger.summary = 'Create campaign'
     #swagger.security = [{ bearerAuth: [] }]
     #swagger.requestBody = {
       required: true,
       content: {
         'application/json': {
           schema: { $ref: '#/components/schemas/Campaign' },
           examples: {
             sample: {
               value: {
                 name: 'Lost Mines Wednesday',
                 dm: 'dm@example.com',
                 description: 'Bi-weekly session',
                 players: ['p1@example.com'],
                 system: 'D&D 5e',
                 status: 'active'
               }
             }
           }
         }
       }
     }
     #swagger.responses[201] = { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Campaign' } } } }
     #swagger.responses[400] = { description: 'Validation error' }
     #swagger.responses[401] = { description: 'Unauthorized' }
  */
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const created = await Campaign.create(req.body);
    res.status(201).json(created);
  } catch (e) {
    if (e?.name === 'ValidationError') return badReq(res, e.message);
    next(e);
  }
});

  /* #swagger.tags = ['Campaigns']
     #swagger.summary = 'Get campaign by id'
     #swagger.security = []  // public
     #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
     #swagger.responses[200] = { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/Campaign' } } } }
     #swagger.responses[404] = { description: 'Not Found' }
  */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isId(id)) return badReq(res, 'Invalid id');
    const item = await Campaign.findById(id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (e) { next(e); }
});

  /* #swagger.tags = ['Campaigns']
     #swagger.summary = 'List adventurers in a campaign'
     #swagger.security = [{ bearerAuth: [] }]
     #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
     #swagger.responses[200] = {
       description: 'OK',
       content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Adventurer' } } } }
     }
     #swagger.responses[401] = { description: 'Unauthorized' }
  */
router.get('/:id/adventurers', requireAuth, async (req, res, next) => {
  try {
    const adventurers = await Adventurer.find({ campaign: req.params.id });
    res.json(adventurers);
  } catch (err) {
    next(err);
  }
});


  /* #swagger.tags = ['Campaigns']
     #swagger.summary = 'Update campaign'
     #swagger.security = [{ bearerAuth: [] }]
     #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
     #swagger.requestBody = {
       required: true,
       content: { 'application/json': { schema: { $ref: '#/components/schemas/Campaign' } } }
     }
     #swagger.responses[200] = { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/Campaign' } } } }
     #swagger.responses[400] = { description: 'Validation error' }
     #swagger.responses[401] = { description: 'Unauthorized' }
     #swagger.responses[404] = { description: 'Not Found' }
  */
router.put('/:id', requireAuth, async (req, res, next) => {
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

  /* #swagger.tags = ['Campaigns']
     #swagger.summary = 'Delete campaign'
     #swagger.security = [{ bearerAuth: [] }]
     #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
     #swagger.responses[204] = { description: 'No Content' }
     #swagger.responses[401] = { description: 'Unauthorized' }
     #swagger.responses[404] = { description: 'Not Found' }
  */
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
