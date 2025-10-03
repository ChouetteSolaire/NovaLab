import API from './../../api';

export const getLabLog = () => API.get('/lablog');

export const createLabLogEntry = (data) => API.post('/lablog', data);

export const updateLabLogEntry = (id, data) => API.put(`/lablog/${id}`, data);

export const deleteLabLogEntry = (id) => API.delete(`/lablog/${id}`);