/**
 * SMANV EduERP Enterprise API Client
 * Configured for Django REST Framework (DRF) Backend Integration
 * Developed by SMANV Info Tech Private Limited
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import {
  getAccessToken,
  getRefreshToken,
  saveTokens,
  clearAuthData,
} from '../services/storage';

// Strict Environment Configuration - No hardcoded URLs
const envApiUrl = process.env.EXPO_PUBLIC_API_URL;
if (!envApiUrl) {
  console.warn(
    '[SMANV EduERP] Warning: EXPO_PUBLIC_API_URL is not configured in .env. Requests may fail until configured.'
  );
}

export const API_BASE_URL = (envApiUrl || '').replace(/\/+$/, '');

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Listener for global auth failure (e.g. refresh token expired)
type AuthFailureCallback = () => void;
let authFailureCallback: AuthFailureCallback | null = null;

export function setOnAuthFailure(callback: AuthFailureCallback | null) {
  authFailureCallback = callback;
}

// Django REST Framework JWT Request Interceptor
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await getAccessToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.warn('Could not read access token from secure store', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Concurrency-safe Token Refresh Queue
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// DRF Token Refresh and Error Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Check if error is 401 Unauthorized and request hasn't been retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Avoid refresh loop if the failed request was itself the login or refresh endpoint
      const url = originalRequest.url || '';
      if (url.includes('/auth/token/') || url.includes('/auth/login/')) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Queue this request while refresh is in flight
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers && token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Call DRF SimpleJWT refresh endpoint directly to avoid interceptor recursion
        const res = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
          refresh: refreshToken,
        });

        const newAccessToken = res.data.access;
        const newRefreshToken = res.data.refresh || refreshToken;

        await saveTokens(newAccessToken, newRefreshToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        processQueue(null, newAccessToken);
        return apiClient(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        await clearAuthData();
        if (authFailureCallback) {
          authFailureCallback();
        }
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export const Endpoints = {
  auth: {
    login: '/auth/token/',
    refresh: '/auth/token/refresh/',
    verify: '/auth/token/verify/',
    me: '/auth/me/',
    user: '/auth/user/',
    logout: '/auth/logout/',
    registerOrg: '/organizations/register/',
    verifyEmail: '/auth/verify-email/',
    forgotPassword: '/auth/password/reset/',
  },
  organization: {
    details: '/organizations/current/',
    settings: '/organizations/settings/',
  },
  students: {
    list: '/students/',
    detail: (id: string) => `/students/${id}/`,
    attendance: (id: string) => `/students/${id}/attendance/`,
  },
  staff: {
    list: '/staff/',
    detail: (id: string) => `/staff/${id}/`,
  },
  attendance: {
    summary: '/attendance/summary/',
    markBatch: '/attendance/mark-batch/',
    history: '/attendance/history/',
  },
  academics: {
    classes: '/academics/classes/',
    timetable: '/academics/timetable/',
    curriculum: '/academics/curriculum/',
  },
  assignments: {
    list: '/assignments/',
    create: '/assignments/',
    submit: (id: string) => `/assignments/${id}/submit/`,
    grade: (id: string) => `/assignments/${id}/grade/`,
  },
  examinations: {
    list: '/examinations/',
    results: '/examinations/results/',
    hallTicket: (examId: string) => `/examinations/${examId}/hall-ticket/`,
  },
  fees: {
    records: '/fees/records/',
    collect: '/fees/collect/',
    receipt: (id: string) => `/fees/receipts/${id}/`,
    defaulters: '/fees/defaulters/',
  },
  reports: {
    summary: '/reports/executive-summary/',
    exportPdf: '/reports/export/pdf/',
    exportExcel: '/reports/export/excel/',
  },
  ai: {
    chat: '/ai/assistant/chat/',
    insights: '/ai/insights/',
    generateAssignment: '/ai/generate/assignment/',
    generateNotice: '/ai/generate/notice/',
    generateReport: '/ai/generate/report/',
    attendanceSummary: '/ai/attendance-summary/',
  },
  notifications: {
    list: '/notifications/',
    markRead: (id: string) => `/notifications/${id}/read/`,
    markAllRead: '/notifications/mark-all-read/',
  },
};
