import axios from 'axios';
import type { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';

export interface ApiError {
  message: string;
  status?: number;
  data?: any;
}

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error('VITE_API_URL environment variable is required');
}

const httpClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

httpClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    
    const persistData = localStorage.getItem('auth-storage');
    if (persistData) {
      try {
        const { state } = JSON.parse(persistData);
        const token = state?.token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

httpClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    const apiError: ApiError = {
      message: 'An unexpected error occurred',
      status: error.response?.status,
      data: error.response?.data,
    };

    if (error.response) {
      const responseData = error.response.data as any;
      
      if (responseData?.error) {
        apiError.message = responseData.error;
      } else if (responseData?.message) {
        apiError.message = responseData.message;
      } else {
        switch (error.response.status) {
          case 400:
            apiError.message = 'Bad request';
            break;
          case 401:
            apiError.message = 'Unauthorized';
            break;
          case 403:
            apiError.message = 'Forbidden';
            break;
          case 404:
            apiError.message = 'Resource not found';
            break;
          case 422:
            apiError.message = 'Validation error';
            break;
          case 500:
            apiError.message = 'Server error';
            break;
          default:
            apiError.message = `Request failed with status ${error.response.status}`;
        }
      }
    } else if (error.request) {
      apiError.message = 'Network error - please check your connection';
    } else {
      apiError.message = error.message || 'Request setup failed';
    }

    return Promise.reject(apiError);
  }
);

export default httpClient;
