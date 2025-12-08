import axios from 'axios';

import { constants } from './constants';
import { ErrorPayload } from './types';

const apiClient = axios.create({
  baseURL: constants.API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

let isRefreshing = false;
let failedQueue: {
  resolve: (value?: any) => void
  reject: (error: any) => void
}[] = [];

const processQueue = (error: any, tokenRefreshed: boolean = false) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve()
    }
  })
  failedQueue = []
};

// apiClient.interceptors.request.use(config => {
//   // If caller sets `internalRoute = true`, override baseURL to allow relative path
//   if (config?.internalRoute) {
//     config.baseURL = undefined;
//   }
//   return config;
// });

apiClient.interceptors.response.use(
  res => {
    console.log("Response resolved:", res);
    return res;
  },
  async error => {
    console.log("Interceptor caught error:", error);
    const originalRequest = error.config;

    // Only handle errors with a response
    if (!error.response) {
      return Promise.reject(error)
    }

    console.group();
    console.log("error");
    console.log(error);
    console.groupEnd();

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // If refresh already in progress, queue the requests
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(() => apiClient(originalRequest))
          .catch(err => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        await apiClient.post('/auth/refresh');

        // After successful refresh, process queue and retry original request
        processQueue(null, true);
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh token expired or invalid, process queue with error
        processQueue(refreshError, false);
        
        console.error("Need to redirect to login");
        
        // window.location.href = "/auth/login";

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    };

    // For other errors or if retry failed, reject with formatted error payload
    if (error.response.data) {
      return Promise.reject(error.response.data as ErrorPayload)
    }

    return Promise.reject({
      status: 'error',
      code: error.code || 500,
      message: error.message,
    } as ErrorPayload)
  }
);

export default apiClient;