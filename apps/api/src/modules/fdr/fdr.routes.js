import { Router } from 'express';
import { fdrController } from './fdr.controller.js';
import { authenticate } from '../../middleware/authenticate.js';

const router = Router();

router.get('/', authenticate, fdrController.getFdrs);
router.get('/:id', authenticate, fdrController.getFdrById);
router.post('/', authenticate, fdrController.createFdr);
router.post('/renew', authenticate, fdrController.renewFdr);

export default router;
