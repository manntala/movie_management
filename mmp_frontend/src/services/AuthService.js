import axios from 'axios';

const baseURL = 'http://localhost:8000';

export async function login(username, password) {
  const res = await axios.post(`${baseURL}/api/token/`, { username, password });

  localStorage.setItem('access', res.data.access);
  localStorage.setItem('refresh', res.data.refresh);

  return res.data;
}

export async function refreshToken() {
  const refresh = localStorage.getItem('refresh');
  if (!refresh) throw new Error("No refresh token");

  const res = await axios.post(`${baseURL}/api/token/refresh/`, { refresh });
  localStorage.setItem('access', res.data.access);
}

export function logout() {
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
}
