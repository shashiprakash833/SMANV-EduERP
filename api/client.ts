/**
 * SMANV EduERP Enterprise API Client
 * Configured for Django REST Framework (DRF) Backend Integration
 * Developed by SMANV Info Tech Private Limited
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getSecureItem, setSecureItem, removeSecureItem } from '../services/storage';

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.smanvedu.com/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Django REST Framework JWT Request Interceptor
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await getSecureItem('smanv_access_token');
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

// DRF Token Refresh and Error Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = await getSecureItem('smanv_refresh_token');
        if (refreshToken) {
          // Call DRF SimpleJWT token refresh endpoint
          const res = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
            refresh: refreshToken,
          });

          const newAccessToken = res.data.access;
          await setSecureItem('smanv_access_token', newAccessToken);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }
          return apiClient(originalRequest);
        }
      } catch (refreshErr) {
        await removeSecureItem('smanv_access_token');
        await removeSecureItem('smanv_refresh_token');
      }
    }
    return Promise.reject(error);
  }
);

export const Endpoints = {
  auth: {
    login: '/auth/token/',
    refresh: '/auth/token/refresh/',
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
