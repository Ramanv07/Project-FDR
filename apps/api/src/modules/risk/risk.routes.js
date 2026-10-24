import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';

const router = Router();

router.get('/queue', authenticate, authorize(['officer', 'admin']), (_req, res) => {
  return res.json([]);
});

router.get('/coverage-gaps', authenticate, authorize(['officer', 'admin']), (_req, res) => {
  return res.json([]);
});

export default router;
