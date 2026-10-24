import apiClient from '../../lib/apiClient';

export const adminApi = {
  async getUsers() {
    return apiClient.get('/admin/users');
  },

  async createUser(data) {
    return apiClient.post('/admin/users/create', data);
  },

  async getAlertSettings() {
    return apiClient.get('/admin/alerts');
  },

  async updateAlertSettings(data) {
    return apiClient.post('/admin/alerts/update', data);
  },
};
