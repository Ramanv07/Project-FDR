import { FDR } from './fdr.model.js';

export const fdrService = {
  async getFdrs(query = {}) {
    try {
      const filter = {};
      if (query.institutionId) filter.institutionId = query.institutionId;
      if (query.status && query.status !== 'all') filter.status = query.status;
      if (query.bank && query.bank !== 'all') filter.bank = query.bank;
      if (query.search) {
        filter.$or = [
          { fdrNumber: new RegExp(query.search, 'i') },
          { institutionName: new RegExp(query.search, 'i') },
          { bank: new RegExp(query.search, 'i') },
        ];
      }
      return await FDR.find(filter).sort({ createdAt: -1 }).lean();
    } catch {
      return [];
    }
  },

  async getFdrById(id) {
    try {
      const fdr = await FDR.findOne({ $or: [{ _id: id }, { fdrNumber: id }] }).lean();
      return fdr || { id };
    } catch {
      return { id };
    }
  },

  async createFdr(data) {
    try {
      // Check for duplicate FDR certificate number
      const existing = await FDR.findOne({ fdrNumber: data.fdrNumber });
      const isDuplicate = Boolean(existing);

      const fdr = new FDR({
        ...data,
        isDuplicate,
        status: isDuplicate ? 'flagged' : 'submitted',
        trustLevel: 'submitted',
        timeline: [
          {
            event: 'Uploaded to regulatory ledger',
            date: new Date().toISOString().slice(0, 10),
            user: data.institutionName || 'Institution Official',
          },
        ],
      });
      await fdr.save();
      return fdr;
    } catch {
      return { id: `fdr-${Date.now()}`, ...data };
    }
  },

  async renewFdr(data) {
    try {
      if (data.oldFdrId) {
        await FDR.updateOne({ _id: data.oldFdrId }, { $set: { status: 'renewed' } });
      }
      const fdr = new FDR({
        ...data,
        fdrNumber: data.newFdrNumber,
        status: 'submitted',
        trustLevel: 'submitted',
        timeline: [
          {
            event: `Renewed against predecessor FDR ${data.oldFdrId || ''}`,
            date: new Date().toISOString().slice(0, 10),
            user: 'Institution Official',
          },
        ],
      });
      await fdr.save();
      return fdr;
    } catch {
      return { id: `fdr-${Date.now()}`, ...data };
    }
  },
};
