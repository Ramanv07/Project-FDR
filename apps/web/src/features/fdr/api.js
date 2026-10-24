import apiClient from '../../lib/apiClient';

export const fdrApi = {
  async getFdrs(params = {}) {
    return apiClient.get('/fdrs', params);
  },

  async getFdrById(id) {
    return apiClient.get('/fdrs/detail', { id });
  },

  async createFdr(data) {
    return apiClient.post('/fdrs/create', data);
  },

  async renewFdr(data) {
    return apiClient.post('/fdrs/renew', data);
  },
};
