import apiClient from '../../lib/apiClient';

export const authApi = {
  async login(credentials) {
    return apiClient.post('/auth/login', credentials);
  },

  async registerInstitution(data) {
    return apiClient.post('/auth/register-institution', data);
  },

  async getProfile() {
    return apiClient.get('/auth/profile');
  },
};
