import apiClient from '../../lib/apiClient';

export const reportsApi = {
  async generateReport(params = {}) {
    return apiClient.get('/reports/generate', params);
  },
};
