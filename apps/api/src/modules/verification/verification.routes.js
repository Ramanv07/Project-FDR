import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';

const router = Router();

router.get('/queue', authenticate, authorize(['officer', 'admin']), (_req, res) => {
  return res.json([]);
});

router.post('/action', authenticate, authorize(['officer', 'admin']), (req, res) => {
  const { fdrId, action } = req.body;
  return res.json({ status: 'success', fdrId, action });
});

export default router;
