import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';

const router = Router();

router.get('/requests', authenticate, (_req, res) => {
  return res.json([]);
});

router.post('/submit', authenticate, (req, res) => {
  return res.status(201).json({ id: `rel-${Date.now()}`, ...req.body });
});

router.post('/approve-step', authenticate, (req, res) => {
  return res.json({ status: 'approved', ...req.body });
});

export default router;
