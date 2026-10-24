import apiClient from '../../lib/apiClient';

export const riskApi = {
  async getRiskQueue() {
    return apiClient.get('/risk/queue');
  },

  async getCoverageGaps(institutionId = null) {
    return apiClient.get('/risk/coverage-gaps', { institutionId });
  },
};
