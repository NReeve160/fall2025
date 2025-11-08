// routes/adventurers.js
import { Router } from 'express';
import mongoose from 'mongoose';
import Adventurer from '../models/adventurer.js';
import Campaign from '../models/campaign.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();

const isId = (id) => mongoose.Types.ObjectId.isValid(id);
const badReq = (res, msg) => res.status(400).json({ error: msg });

/* ---------------------------------------
 * GET /adventurers?campaign=<campaignId>
 * -------------------------------------*/
  /* #swagger.tags = ['Adventurers']
     #swagger.summary = 'List adventurers'
     #swagger.security = [{ bearerAuth: [] }]
     #swagger.parameters['campaign'] = {
       in: 'query',
       description: 'Filter by campaign id',
       required: false,
       schema: { type: 'string', example: '671a0d52f23c7f1d01e0c777' }
     }
     #swagger.responses[200] = {
       description: 'Array of adventurers',
       content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Adventurer' } } } }
     }
     #swagger.responses[401] = { description: 'Unauthorized' }
  */
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const filter =
      req.query.campaign && isId(req.query.campaign)
        ? { campaign: req.query.campaign }
        : {};
    const items = await Adventurer.find(filter).lean();
    res.json(items);
  } catch (e) {
    next(e);
  }
});

/* -------------------------
 * POST /adventurers
 * -----------------------*/
  /* #swagger.tags = ['Adventurers']
     #swagger.summary = 'Create an adventurer'
     #swagger.security = [{ bearerAuth: [] }]
     #swagger.requestBody = {
       required: true,
       content: {
         'application/json': {
           schema: { $ref: '#/components/schemas/Adventurer' },
           examples: {
             sample: {
               value: {
                 name: 'Arannis',
                 race: 'Elf',
                 class: 'Ranger',
                 level: 3,
                 alignment: 'CG',
                 background: 'Outlander',
                 hitPoints: 24,
                 campaign: null
               }
             }
           }
         }
       }
     }
     #swagger.responses[201] = {
       description: 'Created',
       content: { 'application/json': { schema: { $ref: '#/components/schemas/Adventurer' } } }
     }
     #swagger.responses[400] = { description: 'Validation error' }
     #swagger.responses[401] = { description: 'Unauthorized' }
  */
router.post('/', requireAuth, async (req, res, next) => {
  try {
    // If campaign is provided, validate it exists
    if (req.body.campaign != null) {
      if (req.body.campaign !== null && !isId(req.body.campaign)) {
        return badReq(res, 'Invalid campaign id');
      }
      if (req.body.campaign !== null) {
        const exists = await Campaign.exists({ _id: req.body.campaign });
        if (!exists) return badReq(res, 'Campaign not found');
      }
    }

    const created = await Adventurer.create(req.body);
    res.status(201).json(created);
  } catch (e) {
    if (e?.name === 'ValidationError') return badReq(res, e.message);
    next(e);
  }
});

/* -------------------------------
 * GET /adventurers/:id
 * -----------------------------*/
  /* #swagger.tags = ['Adventurers']
     #swagger.summary = 'Get an adventurer by id'
     #swagger.security = [{ bearerAuth: [] }]
     #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
     #swagger.responses[200] = { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/Adventurer' } } } }
     #swagger.responses[401] = { description: 'Unauthorized' }
     #swagger.responses[404] = { description: 'Not Found' }
  */
router.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isId(id)) return badReq(res, 'Invalid id');

    const item = await Adventurer.findById(id);
    if (!item) return res.status(404).json({ error: 'Not found' });

    res.json(item);
  } catch (e) {
    next(e);
  }
});

/* -------------------------------
 * PUT /adventurers/:id
 * -----------------------------*/
  /* #swagger.tags = ['Adventurers']
     #swagger.summary = 'Update an adventurer'
     #swagger.security = [{ bearerAuth: [] }]
     #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
     #swagger.requestBody = {
       required: true,
       content: {
         'application/json': {
           schema: { $ref: '#/components/schemas/Adventurer' }
         }
       }
     }
     #swagger.responses[200] = { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/Adventurer' } } } }
     #swagger.responses[400] = { description: 'Validation error' }
     #swagger.responses[401] = { description: 'Unauthorized' }
     #swagger.responses[404] = { description: 'Not Found' }
  */
router.put('/:id', requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isId(id)) return badReq(res, 'Invalid id');

    // Optional: validate campaign on update if present (allow null to unlink)
    if (Object.prototype.hasOwnProperty.call(req.body, 'campaign')) {
      const cid = req.body.campaign;
      if (cid !== null && cid !== undefined) {
        if (!isId(cid)) return badReq(res, 'Invalid campaign id');
        const exists = await Campaign.exists({ _id: cid });
        if (!exists) return badReq(res, 'Campaign not found');
      }
    }

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

/* --------------------------------
 * DELETE /adventurers/:id
 * ------------------------------*/
  /* #swagger.tags = ['Campaigns']
     #swagger.summary = 'List campaigns'
     #swagger.security = []  // public
     #swagger.responses[200] = {
       description: 'Array of campaigns',
       content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Campaign' } } } }
     }
  */
router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isId(id)) return badReq(res, 'Invalid id');

    const deleted = await Adventurer.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });

    res.status(204).send();
  } catch (e) {
    next(e);
  }
});

export default router;
