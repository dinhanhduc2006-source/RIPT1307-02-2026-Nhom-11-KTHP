import { request } from '@umijs/max';

const API_BASE = (process as any)?.env?.API_BASE || '/api/v1';
const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';
const USER_KEY = 'auth_user';

const unwrapResponse = async <T>(promise: Promise<any>): Promise<T> => {
  const res = await promise;
  return res?.data;
};

export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY);
export const getRefreshToken = (): string | null => localStorage.getItem(REFRESH_TOKEN_KEY);
export const getUser = (): any => {
  const s = localStorage.getItem(USER_KEY);
  return s ? JSON.parse(s) : null;
};

export const setAuth = (token: string, refreshToken: string, user: any) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const isAuthenticated = (): boolean => !!getToken();

const authRequest = async (url: string, options?: any) => {
  const token = getToken();
  const headers = {
    ...(options?.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  return unwrapResponse(request(url, { ...options, headers }));
};

const publicRequest = async (url: string, options?: any) =>
  unwrapResponse(request(url, { ...options }));

export const authApi = {
  login: (email: string, password: string) =>
    publicRequest(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: { email, password },
    }),

  register: (data: { username: string; email: string; password: string }) =>
    publicRequest(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data,
    }),

  refreshToken: (refreshToken: string) =>
    publicRequest(`${API_BASE}/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: refreshToken,
    }),
};

export const equipmentApi = {
  getAll: () => authRequest(`${API_BASE}/equipments`),
  getById: (id: number) => authRequest(`${API_BASE}/equipments/${id}`),
  create: (data: any) => authRequest(`${API_BASE}/equipments`, { method: 'POST', data }),
  update: (id: number, data: any) => authRequest(`${API_BASE}/equipments/${id}`, { method: 'PUT', data }),
  delete: (id: number) => authRequest(`${API_BASE}/equipments/${id}`, { method: 'DELETE' }),
  setMaintenance: (id: number, reporterId: number, issue: string) =>
    authRequest(`${API_BASE}/equipments/${id}/maintenance`, {
      method: 'POST',
      params: { reporterId, issue },
    }),
};

export const loanRequestApi = {
  create: (data: { userId: number; equipmentId: number; borrowDate: string; returnDate: string }) =>
    authRequest(`${API_BASE}/loan-requests`, { method: 'POST', data }),
  approve: (id: number, adminId: number) =>
    authRequest(`${API_BASE}/loan-requests/${id}/approve`, {
      method: 'PATCH',
      params: { adminId },
    }),
  reject: (id: number, adminId: number, reason: string) =>
    authRequest(`${API_BASE}/loan-requests/${id}/reject`, {
      method: 'PATCH',
      params: { adminId, reason },
    }),
  returnItem: (id: number, adminId: number) =>
    authRequest(`${API_BASE}/loan-requests/${id}/return`, {
      method: 'PATCH',
      params: { adminId },
    }),
  getMyRequests: (userId: number) => authRequest(`${API_BASE}/loan-requests/my`, { params: { userId } }),
  getAll: () => authRequest(`${API_BASE}/loan-requests`),
};

export const postApi = {
  getAll: () => publicRequest(`${API_BASE}/posts`),
  create: (data: any, authorId: number) =>
    authRequest(`${API_BASE}/posts`, { method: 'POST', data, params: { authorId } }),
  delete: (id: number) => authRequest(`${API_BASE}/posts/${id}`, { method: 'DELETE' }),
};

export const announcementApi = {
  getActive: () => publicRequest(`${API_BASE}/announcements/active`),
  getAll: () => authRequest(`${API_BASE}/announcements`),
  create: (data: any, authorId: number) =>
    authRequest(`${API_BASE}/announcements`, { method: 'POST', data, params: { authorId } }),
  delete: (id: number) => authRequest(`${API_BASE}/announcements/${id}`, { method: 'DELETE' }),
};

export const penaltyApi = {
  getMyPenalties: (userId: number) => authRequest(`${API_BASE}/penalties/my`, { params: { userId } }),
  getAll: () => authRequest(`${API_BASE}/penalties`),
  pay: (id: number) => authRequest(`${API_BASE}/penalties/${id}/pay`, { method: 'PATCH' }),
};

export const maintenanceApi = {
  getAll: () => authRequest(`${API_BASE}/maintenance`),
  updateStatus: (id: number, status: string, cost?: number) =>
    authRequest(`${API_BASE}/maintenance/${id}/status`, {
      method: 'PATCH',
      params: { status, ...(cost !== undefined ? { cost } : {}) },
    }),
};

export const auditLogApi = {
  getAll: () => authRequest(`${API_BASE}/audit-logs`),
};

export const configApi = {
  getConfig: () => authRequest(`${API_BASE}/config`),
  updateConfig: (data: any) => authRequest(`${API_BASE}/config`, { method: 'PUT', data }),
};

export const userApi = {
  getAll: () => authRequest(`${API_BASE}/users`),
  getById: (id: number) => authRequest(`${API_BASE}/users/${id}`),
};
