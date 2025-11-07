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
router.get(
  '/',
  requireAuth,
  /*
    #swagger.tags = ['Adventurers']
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.description = 'List adventurers. Optional filter by campaign id.'
    #swagger.parameters['campaign'] = { in: 'query', required: false, type: 'string', description: 'Filter by campaign id' }
    #swagger.responses[200] = {
      description: 'List of adventurers',
      schema: { type: 'array', items: { $ref: '#/definitions/Adventurer' } }
    }
  */
  async (req, res, next) => {
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
  }
);

/* -------------------------
 * POST /adventurers
 * -----------------------*/
router.post(
  '/',
  requireAuth,
  /*
    #swagger.tags = ['Adventurers']
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.summary = 'Create adventurer'
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: { $ref: '#/definitions/AdventurerCreate' }
    }
    #swagger.responses[201] = {
      description: 'Created',
      schema: { $ref: '#/definitions/Adventurer' }
    }
    #swagger.responses[400] = { description: 'Validation or bad request' }
  */
  async (req, res, next) => {
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
  }
);

/* -------------------------------
 * GET /adventurers/:id
 * -----------------------------*/
router.get(
  '/:id',
  requireAuth,
  /*
    #swagger.tags = ['Adventurers']
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.parameters['id'] = { in: 'path', required: true, type: 'string' }
    #swagger.responses[200] = { schema: { $ref: '#/definitions/Adventurer' } }
    #swagger.responses[400] = { description: 'Invalid id' }
    #swagger.responses[404] = { description: 'Not found' }
  */
  async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!isId(id)) return badReq(res, 'Invalid id');

      const item = await Adventurer.findById(id);
      if (!item) return res.status(404).json({ error: 'Not found' });

      res.json(item);
    } catch (e) {
      next(e);
    }
  }
);

/* -------------------------------
 * PUT /adventurers/:id
 * -----------------------------*/
router.put(
  '/:id',
  requireAuth,
  /*
    #swagger.tags = ['Adventurers']
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.summary = 'Replace/update adventurer'
    #swagger.parameters['id'] = { in: 'path', required: true, type: 'string' }
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: { $ref: '#/definitions/AdventurerUpdate' }
    }
    #swagger.responses[200] = { schema: { $ref: '#/definitions/Adventurer' } }
    #swagger.responses[400] = { description: 'Invalid id or validation error' }
    #swagger.responses[404] = { description: 'Not found' }
  */
  async (req, res, next) => {
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
  }
);

/* --------------------------------
 * DELETE /adventurers/:id
 * ------------------------------*/
router.delete(
  '/:id',
  requireAuth,
  /*
    #swagger.tags = ['Adventurers']
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.parameters['id'] = { in: 'path', required: true, type: 'string' }
    #swagger.responses[204] = { description: 'Deleted' }
    #swagger.responses[400] = { description: 'Invalid id' }
    #swagger.responses[404] = { description: 'Not found' }
  */
  async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!isId(id)) return badReq(res, 'Invalid id');

      const deleted = await Adventurer.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ error: 'Not found' });

      res.status(204).send();
    } catch (e) {
      next(e);
    }
  }
);

export default router;
