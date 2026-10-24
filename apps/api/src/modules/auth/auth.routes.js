import { Router } from 'express';
import { authController } from './auth.controller.js';
import { validate } from '../../middleware/validate.js';
import { loginSchema, registerInstitutionSchema } from './auth.validation.js';

const router = Router();

router.post('/login', validate(loginSchema), authController.login);
router.post('/register-institution', validate(registerInstitutionSchema), authController.register);

export default router;
