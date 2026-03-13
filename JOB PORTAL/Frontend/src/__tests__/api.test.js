import axios from 'axios';

describe('api service wrappers', () => {
  let apiInstance;

  beforeEach(() => {
    apiInstance = {
      interceptors: { request: { use: jest.fn() } },
      post: jest.fn().mockResolvedValue({ data: {} }),
      get: jest.fn().mockResolvedValue({ data: {} }),
      put: jest.fn().mockResolvedValue({ data: {} }),
      delete: jest.fn().mockResolvedValue({ data: {} }),
    };

    axios.create = jest.fn().mockReturnValue(apiInstance);
    jest.resetModules();
  });

  test('creates axios instance and registers request interceptor; authAPI.register posts to correct endpoint', async () => {
    const { authAPI } = require('../services/api');

    expect(axios.create).toHaveBeenCalled();
    expect(apiInstance.interceptors.request.use).toHaveBeenCalled();

    const payload = { email: 'a@a.com', password: 'pwd' };
    await authAPI.register(payload);
    expect(apiInstance.post).toHaveBeenCalledWith('/auth/register', payload);
  });

  test('jobAPI.getById calls get with correct path', async () => {
    const { jobAPI } = require('../services/api');
    await jobAPI.getById(123);
    expect(apiInstance.get).toHaveBeenCalledWith('/jobs/123');
  });
});
