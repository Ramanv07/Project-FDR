import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { verifyChain } from '../../utils/hash.js';

const router = Router();

router.get('/ledger', authenticate, authorize(['admin', 'officer']), (_req, res) => {
  return res.json([]);
});

router.post('/verify', authenticate, authorize(['admin', 'officer']), (req, res) => {
  const result = verifyChain(req.body.entries || []);
  return res.json(result);
});

export default router;
