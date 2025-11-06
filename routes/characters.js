import { Router } from 'express';
const router = Router();

// #swagger.tags = ['Characters']
// #swagger.summary = 'List characters'
// #swagger.security = [{ "bearerAuth": [] }]
router.get('/', (_req, res) => res.json([]));

// #swagger.tags = ['Characters']
// #swagger.summary = 'Create character'
// #swagger.security = [{ "bearerAuth": [] }]
// #swagger.requestBody = { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/Character" } } } }
// #swagger.responses[201] = { description: 'Created' }
router.post('/', (req, res) => res.status(201).json({ created: req.body || {} }));

// #swagger.tags = ['Characters']
// #swagger.summary = 'Get character by id'
// #swagger.security = [{ "bearerAuth": [] }]
router.get('/:id', (req, res) => res.json({ id: req.params.id }));

// #swagger.tags = ['Characters']
// #swagger.summary = 'Update character'
// #swagger.security = [{ "bearerAuth": [] }]
// #swagger.requestBody = { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/Character" } } } }
router.put('/:id', (req, res) => res.json({ id: req.params.id, updated: req.body || {} }));

// #swagger.tags = ['Characters']
// #swagger.summary = 'Delete character'
// #swagger.security = [{ "bearerAuth": [] }]
router.delete('/:id', (_req, res) => res.status(204).send());

export default router;
