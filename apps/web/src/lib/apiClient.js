/**
 * Axios-like API client stub. Currently returns mock data;
 * swap the base URL and remove mock handlers when the backend is ready.
 */

const USE_MOCKS = true;

let mockHandlers = {};

export function registerMockHandler(path, handler) {
  mockHandlers[path] = handler;
}

const apiClient = {
  async get(path, params = {}) {
    if (USE_MOCKS && mockHandlers[path]) {
      return mockHandlers[path]({ method: 'GET', params });
    }
    throw new Error(`No mock handler for GET ${path}`);
  },

  async post(path, data = {}) {
    if (USE_MOCKS && mockHandlers[path]) {
      return mockHandlers[path]({ method: 'POST', data });
    }
    throw new Error(`No mock handler for POST ${path}`);
  },

  async put(path, data = {}) {
    if (USE_MOCKS && mockHandlers[path]) {
      return mockHandlers[path]({ method: 'PUT', data });
    }
    throw new Error(`No mock handler for PUT ${path}`);
  },

  async delete(path) {
    if (USE_MOCKS && mockHandlers[path]) {
      return mockHandlers[path]({ method: 'DELETE' });
    }
    throw new Error(`No mock handler for DELETE ${path}`);
  },
};

export default apiClient;
