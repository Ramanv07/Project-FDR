import apiClient from '../../lib/apiClient';

export const institutionApi = {
  async getInstitutions(params = {}) {
    return apiClient.get('/institutions', params);
  },

  async getInstitutionDetail(id) {
    return apiClient.get('/institutions/detail', { id });
  },
};
