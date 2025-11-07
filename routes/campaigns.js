// routes/campaigns.js
import { Router } from 'express';
import mongoose from 'mongoose';
import Campaign from '../models/campaign.js';
import { requireAuth } from '../middleware/requireAuth.js';
import Adventurer from '../models/adventurer.js';

const router = Router();
const isId = (id) => mongoose.Types.ObjectId.isValid(id);
const badReq = (res, msg) => res.status(400).json({ error: msg });

// List campaigns
router.get(
  '/',
  /*
    #swagger.tags = ['Campaigns']
    #swagger.summary = 'List campaigns'
    #swagger.responses[200] = {
      description: 'List of campaigns',
      schema: { type: 'array', items: { $ref: '#/definitions/Campaign' } }
    }
  */
  async (_req, res, next) => {
    try {
      const items = await Campaign.find().lean();
      res.json(items);
    } catch (e) { next(e); }
  }
);

// Create campaign
router.post(
  '/',
  /*
    #swagger.tags = ['Campaigns']
    #swagger.summary = 'Create campaign'
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: { $ref: '#/definitions/CampaignCreate' }
    }
    #swagger.responses[201] = { description: 'Created', schema: { $ref: '#/definitions/Campaign' } }
    #swagger.responses[400] = { description: 'Validation error' }
  */
  async (req, res, next) => {
    try {
      const created = await Campaign.create(req.body);
      res.status(201).json(created);
    } catch (e) {
      if (e?.name === 'ValidationError') return badReq(res, e.message);
      next(e);
    }
  }
);

// Get campaign by id
router.get(
  '/:id',
  /*
    #swagger.tags = ['Campaigns']
    #swagger.summary = 'Get campaign by id'
    #swagger.parameters['id'] = { in: 'path', required: true, type: 'string' }
    #swagger.responses[200] = { schema: { $ref: '#/definitions/Campaign' } }
    #swagger.responses[400] = { description: 'Invalid id' }
    #swagger.responses[404] = { description: 'Not found' }
  */
  async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!isId(id)) return badReq(res, 'Invalid id');
      const item = await Campaign.findById(id);
      if (!item) return res.status(404).json({ error: 'Not found' });
      res.json(item);
    } catch (e) { next(e); }
  }
);

// Adventurers in a campaign
router.get(
  '/:id/adventurers',
  requireAuth,
  /*
    #swagger.tags = ['Campaigns']
    #swagger.summary = 'List adventurers in a campaign'
    #swagger.description = 'Returns all adventurers that reference this campaign ID'
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.parameters['id'] = { in: 'path', required: true, type: 'string' }
    #swagger.responses[200] = {
      schema: { type: 'array', items: { $ref: '#/definitions/Adventurer' } }
    }
    #swagger.responses[400] = { description: 'Invalid id' }
  */
  async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!isId(id)) return badReq(res, 'Invalid id');
      const adventurers = await Adventurer.find({ campaign: id });
      res.json(adventurers);
    } catch (err) {
      next(err);
    }
  }
);

// Update campaign
router.put(
  '/:id',
  /*
    #swagger.tags = ['Campaigns']
    #swagger.summary = 'Update campaign'
    #swagger.parameters['id'] = { in: 'path', required: true, type: 'string' }
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: { $ref: '#/definitions/CampaignUpdate' }
    }
    #swagger.responses[200] = { schema: { $ref: '#/definitions/Campaign' } }
    #swagger.responses[400] = { description: 'Invalid id or validation error' }
    #swagger.responses[404] = { description: 'Not found' }
  */
  async (req, res, next) => {
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
  }
);

// Delete campaign
router.delete(
  '/:id',
  /*
    #swagger.tags = ['Campaigns']
    #swagger.summary = 'Delete campaign'
    #swagger.parameters['id'] = { in: 'path', required: true, type: 'string' }
    #swagger.responses[204] = { description: 'Deleted' }
    #swagger.responses[400] = { description: 'Invalid id' }
    #swagger.responses[404] = { description: 'Not found' }
  */
  async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!isId(id)) return badReq(res, 'Invalid id');
      const deleted = await Campaign.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ error: 'Not found' });
      res.status(204).send();
    } catch (e) { next(e); }
  }
);

export default router;
