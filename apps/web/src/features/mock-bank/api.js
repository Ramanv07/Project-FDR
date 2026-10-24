import apiClient from '../../lib/apiClient';

export const mockBankApi = {
  async getRequests() {
    return apiClient.get('/mock-bank/requests');
  },

  async respondToRequest(data) {
    return apiClient.post('/mock-bank/respond', data);
  },
};
