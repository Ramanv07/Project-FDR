export const fdrService = {
  async getFdrs(query = {}) {
    // In full deployment connects to MongoDB
    return [];
  },

  async getFdrById(id) {
    return { id };
  },

  async createFdr(data) {
    return { id: `fdr-${Date.now()}`, ...data };
  },

  async renewFdr(data) {
    return { id: `fdr-${Date.now()}`, ...data };
  },
};
