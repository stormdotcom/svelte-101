import { showNotification } from '$lib/common/notification.js';
import axios, { type AxiosRequestConfig } from 'axios';
import qs from 'query-string';
import { handleAxiosError } from './errorHandler.js';

interface ApiOptions {
  endpoint: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  queryParams?: Record<string, any>;
  body?: any;
  headers?: Record<string, string>;
  setLoading?: (loading: boolean) => void; // New: Optional setLoading function
}

const BASE_URL = 'https://jsonplaceholder.typicode.com';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
});

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    const { title, message } = handleAxiosError(error);
    showNotification(title, message, 'error');
    return Promise.reject(error);
  }
);

export async function apiRequest<T>({
  endpoint,
  method = 'GET',
  queryParams,
  body,
  headers = {},
  setLoading,
}: ApiOptions): Promise<T | null> {
  try {
    if (setLoading) setLoading(true); // Set loading to true when request starts

    const queryString = queryParams ? `?${qs.stringify(queryParams)}` : '';

    const config: AxiosRequestConfig = {
      url: `${endpoint}${queryString}`,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      data: body ? body : null,
    };

    const response = await axiosInstance.request<T>(config);

    if (method !== 'GET') {
      showNotification('Success', 'Request successful!', 'success');
    }

    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    return null;
  } finally {
    if (setLoading) setLoading(false); 
  }
}
