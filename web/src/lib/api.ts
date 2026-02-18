import axios, { AxiosError } from 'axios';
import type {
  TexturePack,
  PaginatedResponse,
  User,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  ApiError,
} from '@/types';

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<User> => {
    const response = await api.post<User>('/auth/register', data);
    return response.data;
  },
};

// User endpoints
export const userApi = {
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/users/me');
    return response.data;
  },

  updateCurrentUser: async (data: Partial<User>): Promise<User> => {
    const response = await api.put<User>('/users/me', data);
    return response.data;
  },
};

// Pack endpoints
export const packApi = {
  listPacks: async (params?: {
    page?: number;
    per_page?: number;
    category?: string;
    quality_tier?: string;
    search?: string;
  }): Promise<PaginatedResponse<TexturePack>> => {
    const response = await api.get<PaginatedResponse<TexturePack>>('/packs', { params });
    return response.data;
  },

  getPack: async (packId: string): Promise<TexturePack> => {
    const response = await api.get<TexturePack>(`/packs/${packId}`);
    return response.data;
  },

  createPack: async (data: Partial<TexturePack>): Promise<TexturePack> => {
    const response = await api.post<TexturePack>('/packs', data);
    return response.data;
  },

  updatePack: async (packId: string, data: Partial<TexturePack>): Promise<TexturePack> => {
    const response = await api.put<TexturePack>(`/packs/${packId}`, data);
    return response.data;
  },

  deletePack: async (packId: string): Promise<void> => {
    await api.delete(`/packs/${packId}`);
  },
};

export default api;
