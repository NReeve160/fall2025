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
 * Lists all adventurers, optionally filtered by campaign.
 * -------------------------------------*/
router.get('/', requireAuth, async (req, res, next) => {
  /* #swagger.tags = ['Adventurers']
     #swagger.summary = 'List adventurers'
     #swagger.security = [{ bearerAuth: [] }]
     #swagger.parameters['campaign'] = {
       in: 'query',
       description: 'Filter by campaign ID',
       required: false,
       schema: { type: 'string', example: '671a0d52f23c7f1d01e0c777' }
     }
     #swagger.responses[200] = {
       description: 'Array of adventurers',
       content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Adventurer' } } } }
     }
     #swagger.responses[401] = { description: 'Unauthorized' }
  */
  try {
    if (req.query.campaign && !isId(req.query.campaign))
      return badReq(res, 'Invalid campaign id');

    const filter = req.query.campaign ? { campaign: req.query.campaign } : {};
    const items = await Adventurer.find(filter).lean();
    res.json(items);
  } catch (e) {
    next(e);
  }
});

/* -------------------------
 * POST /adventurers
 * Creates a new adventurer.
 * -----------------------*/
router.post('/', requireAuth, async (req, res, next) => {
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
  try {
    if (req.body.campaign != null) {
      if (!isId(req.body.campaign)) return badReq(res, 'Invalid campaign id');
      const exists = await Campaign.exists({ _id: req.body.campaign });
      if (!exists) return badReq(res, 'Campaign not found');
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
 * Returns a single adventurer by ID.
 * -----------------------------*/
router.get('/:id', requireAuth, async (req, res, next) => {
  /* #swagger.tags = ['Adventurers']
     #swagger.summary = 'Get an adventurer by id'
     #swagger.security = [{ bearerAuth: [] }]
  */
  try {
    const { id } = req.params;
    if (!isId(id)) return badReq(res, 'Invalid id');
    const item = await Adventurer.findById(id).lean();
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (e) {
    next(e);
  }
});

/* -------------------------------
 * PUT /adventurers/:id
 * Updates an existing adventurer.
 * -----------------------------*/
router.put('/:id', requireAuth, async (req, res, next) => {
  /* #swagger.tags = ['Adventurers']
     #swagger.summary = 'Update an adventurer'
     #swagger.security = [{ bearerAuth: [] }]
  */
  try {
    const { id } = req.params;
    if (!isId(id)) return badReq(res, 'Invalid id');

    if ('campaign' in req.body && req.body.campaign) {
      if (!isId(req.body.campaign)) return badReq(res, 'Invalid campaign id');
      const exists = await Campaign.exists({ _id: req.body.campaign });
      if (!exists) return badReq(res, 'Campaign not found');
    }

    const updated = await Adventurer.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
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
 * Deletes an adventurer.
 * ------------------------------*/
router.delete('/:id', requireAuth, async (req, res, next) => {
  /* #swagger.tags = ['Adventurers']
     #swagger.summary = 'Delete an adventurer'
     #swagger.security = [{ bearerAuth: [] }]
  */
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
