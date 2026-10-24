import apiClient from '../../lib/apiClient';

export const verificationApi = {
  async getQueue(filter = 'all') {
    return apiClient.get('/verifications', { filter });
  },

  async getReviewData(id) {
    return apiClient.get('/verifications/review-data', { id });
  },

  async submitAction(data) {
    return apiClient.post('/verifications/action', data);
  },
};
