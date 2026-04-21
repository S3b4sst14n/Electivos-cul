import api from './client';

export const enroll = (course_offering_id) =>
  api.post('/inscripciones', { course_offering_id }).then((r) => r.data);

export const cancelEnrollment = (id) =>
  api.delete(`/inscripciones/${id}`).then((r) => r.data);

export const myEnrollments = () =>
  api.get('/inscripciones/mis-inscripciones').then((r) => r.data);

export const enrollmentsByOffering = (offering_id, orden = 'nombre') =>
  api.get(`/inscripciones/oferta/${offering_id}`, { params: { orden } }).then((r) => r.data);
