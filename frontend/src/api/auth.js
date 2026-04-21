import api from './client';

export const login = (identification_number, password) =>
  api.post('/auth/login', { identification_number, password }).then((r) => r.data);

export const register = (payload) =>
  api.post('/auth/register', payload).then((r) => r.data);
