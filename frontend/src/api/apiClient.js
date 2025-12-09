import axios from 'axios';

const DEFAULT_BASE = process.env.REACT_APP_API_GATEWAY || 'http://localhost:4000';

const api = axios.create({
  baseURL: DEFAULT_BASE,
  timeout: 15000
});

export function setAuthToken(token) {
  if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  else delete api.defaults.headers.common['Authorization'];
}

export default api;
