import { authService } from './auth.service.js';

export const authController = {
  async login(req, res, next) {
    try {
      const result = await authService.authenticateUser(req.body);
      return res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async register(req, res, next) {
    try {
      const result = await authService.registerInstitution(req.body);
      return res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  },
};
