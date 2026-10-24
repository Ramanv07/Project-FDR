import apiClient from '../../lib/apiClient';

export const auditApi = {
  async getLedger() {
    return apiClient.get('/audit/ledger');
  },

  async verifyIntegrity() {
    return apiClient.get('/audit/verify');
  },

  async tamperChain() {
    return apiClient.post('/audit/tamper');
  },

  async restoreChain() {
    return apiClient.post('/audit/restore');
  },
};
