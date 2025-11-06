import { Router } from 'express';
const router = Router();

// #swagger.tags = ['Campaigns']
// #swagger.summary = 'List campaigns'
// #swagger.security = [{ "bearerAuth": [] }]
router.get('/', (_req, res) => res.json([]));

// #swagger.tags = ['Campaigns']
// #swagger.summary = 'Create campaign'
// #swagger.security = [{ "bearerAuth": [] }]
// #swagger.requestBody = { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/Campaign" } } } }
router.post('/', (req, res) => res.status(201).json({ created: req.body || {} }));

// #swagger.tags = ['Campaigns']
// #swagger.summary = 'Get campaign by id'
// #swagger.security = [{ "bearerAuth": [] }]
router.get('/:id', (req, res) => res.json({ id: req.params.id }));

// #swagger.tags = ['Campaigns']
// #swagger.summary = 'Update campaign'
// #swagger.security = [{ "bearerAuth": [] }]
// #swagger.requestBody = { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/Campaign" } } } }
router.put('/:id', (req, res) => res.json({ id: req.params.id, updated: req.body || {} }));

// #swagger.tags = ['Campaigns']
// #swagger.summary = 'Delete campaign'
// #swagger.security = [{ "bearerAuth": [] }]
router.delete('/:id', (_req, res) => res.status(204).send());

export default router;
