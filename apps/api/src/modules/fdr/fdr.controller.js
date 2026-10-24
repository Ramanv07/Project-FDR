import { fdrService } from './fdr.service.js';

export const fdrController = {
  async getFdrs(req, res, next) {
    try {
      const data = await fdrService.getFdrs(req.query);
      return res.json(data);
    } catch (err) {
      next(err);
    }
  },

  async getFdrById(req, res, next) {
    try {
      const data = await fdrService.getFdrById(req.params.id);
      return res.json(data);
    } catch (err) {
      next(err);
    }
  },

  async createFdr(req, res, next) {
    try {
      const data = await fdrService.createFdr(req.body);
      return res.status(201).json(data);
    } catch (err) {
      next(err);
    }
  },

  async renewFdr(req, res, next) {
    try {
      const data = await fdrService.renewFdr(req.body);
      return res.status(201).json(data);
    } catch (err) {
      next(err);
    }
  },
};
