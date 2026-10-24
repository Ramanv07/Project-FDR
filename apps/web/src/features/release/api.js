import apiClient from '../../lib/apiClient';

export const releaseApi = {
  async getRequests(params = {}) {
    return apiClient.get('/release/requests', params);
  },

  async checkEligibility(fdrId) {
    return apiClient.get('/release/check-eligibility', { fdrId });
  },

  async submitRelease(data) {
    return apiClient.post('/release/submit', data);
  },

  async approveStep(data) {
    return apiClient.post('/release/approve-step', data);
  },
};
