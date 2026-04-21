import api from './client';

export const listElectives = () => api.get('/cursos').then((r) => r.data);
export const getElective = (id) => api.get(`/cursos/${id}`).then((r) => r.data);
export const createElective = (payload) => api.post('/cursos', payload).then((r) => r.data);
export const updateElective = (id, payload) => api.put(`/cursos/${id}`, payload).then((r) => r.data);
export const deleteElective = (id) => api.delete(`/cursos/${id}`).then((r) => r.data);

export const listOfferings = () => api.get('/cursos/ofertas/lista').then((r) => r.data);
export const createOffering = (payload) => api.post('/cursos/ofertas/nueva', payload).then((r) => r.data);
export const updateOffering = (id, payload) => api.put(`/cursos/ofertas/${id}`, payload).then((r) => r.data);
export const deleteOffering = (id) => api.delete(`/cursos/ofertas/${id}`).then((r) => r.data);
