import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  withCredentials: true,   // sends Sanctum cookie if you’re using cookie auth
});

// Roles & Permissions endpoints
export const fetchRoles = ()      => API.get('/roles');
export const createRole = (data) => API.post('/roles', data);
export const updateRole = (id, data) => API.put(`/roles/${id}`, data);

export const fetchPermissions = () => API.get('/permissions');

// Assigning roles to a user
export const assignRolesToUser = (userId, roles) =>
  API.post(`/users/${userId}/roles`, { roles });

export default API;
