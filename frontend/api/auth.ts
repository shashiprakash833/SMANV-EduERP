/**
 * SMANV EduERP Authentication & Registration API Service
 * Configured for Django REST Framework (DRF) & SimpleJWT
 * Developed by SMANV Info Tech Private Limited
 */

import axios, { AxiosError } from 'axios';
import { apiClient, API_BASE_URL, Endpoints } from './client';
import {
  AuthResponse,
  LoginCredentials,
  RegisterOrgPayload,
  TokenRefreshResponse,
  User,
  Organization,
} from '../types';
import { MOCK_ORGANIZATION } from '../constants/MockData';

/**
 * Parses and formats error messages from Django REST Framework responses.
 * Handles standard DRF structures: { detail: "..." }, { non_field_errors: [...] },
 * or field-specific validation dictionaries { email: ["Invalid email"] }.
 */
export function extractErrorMessage(error: unknown, fallbackMessage: string): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (data) {
      if (typeof data === 'string') {
        return data;
      }
      if (typeof data.detail === 'string') {
        return data.detail;
      }
      if (typeof data.message === 'string') {
        return data.message;
      }
      if (Array.isArray(data.non_field_errors) && data.non_field_errors.length > 0) {
        return String(data.non_field_errors[0]);
      }
      // Inspect first field error entry if object
      if (typeof data === 'object') {
        const keys = Object.keys(data);
        if (keys.length > 0) {
          const firstVal = data[keys[0]];
          if (Array.isArray(firstVal) && firstVal.length > 0) {
            return `${keys[0].replace(/_/g, ' ')}: ${firstVal[0]}`;
          }
          if (typeof firstVal === 'string') {
            return `${keys[0].replace(/_/g, ' ')}: ${firstVal}`;
          }
        }
      }
    }

    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      return 'Connection timed out. Please verify your Django server is running.';
    }
    if (error.code === 'ERR_NETWORK' || !error.response) {
      return `Network error connecting to ${API_BASE_URL || 'backend'}. Please check your connection and .env configuration.`;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallbackMessage;
}

/**
 * Normalizes DRF User response into SMANV User interface
 */
function normalizeUser(rawUser: any, email: string): User {
  return {
    id: String(rawUser?.id || rawUser?.pk || `usr_${Date.now()}`),
    name: rawUser?.name || rawUser?.full_name || rawUser?.username || rawUser?.first_name || 'User',
    email: rawUser?.email || email,
    role: rawUser?.role || 'org_admin',
    organizationId: String(rawUser?.organization_id || rawUser?.organization?.id || 'org_smanv_01'),
    organizationName: rawUser?.organization_name || rawUser?.organization?.name || 'SMANV Institution',
    avatarUrl: rawUser?.avatar_url || rawUser?.avatar || undefined,
    phone: rawUser?.phone || rawUser?.mobile || undefined,
    designation: rawUser?.designation || undefined,
    department: rawUser?.department || undefined,
  };
}

/**
 * Normalizes DRF Organization response into SMANV Organization interface
 */
function normalizeOrg(rawOrg: any): Organization {
  if (!rawOrg) return MOCK_ORGANIZATION;
  return {
    id: String(rawOrg.id || rawOrg.pk || `org_${Date.now()}`),
    name: rawOrg.name || 'Educational Institution',
    type: rawOrg.type || 'school',
    code: rawOrg.code || 'SMANV',
    email: rawOrg.email || '',
    phone: rawOrg.phone || '',
    address: rawOrg.address || '',
    city: rawOrg.city || '',
    state: rawOrg.state || '',
    pincode: rawOrg.pincode || '',
    studentCount: rawOrg.student_count || rawOrg.studentCount || 0,
    staffCount: rawOrg.staff_count || rawOrg.staffCount || 0,
    establishedYear: rawOrg.established_year || rawOrg.establishedYear || new Date().getFullYear(),
    academicYear: rawOrg.academic_year || rawOrg.academicYear || '2026-2027',
  };
}

/**
 * Authenticates user credentials with Django REST Framework /auth/token/ endpoint.
 * Returns access token, refresh token, and authenticated user profile.
 */
export async function loginApi(credentials: LoginCredentials): Promise<AuthResponse> {
  const { email, password, role } = credentials;

  // Django SimpleJWT typically accepts username & password.
  // We send both 'username' and 'email' for maximum DRF serializer compatibility.
  const response = await apiClient.post(Endpoints.auth.login, {
    username: email.trim(),
    email: email.trim(),
    password,
    role,
  });

  const access = response.data.access;
  const refresh = response.data.refresh;

  if (!access) {
    throw new Error('Invalid response from server: Access token missing.');
  }

  let user: User;
  let organization: Organization = MOCK_ORGANIZATION;

  // If user profile is included directly in the login response
  if (response.data.user) {
    user = normalizeUser(response.data.user, email);
    if (response.data.organization) {
      organization = normalizeOrg(response.data.organization);
    }
  } else {
    // Fetch authenticated user profile from /auth/me/
    try {
      const userRes = await apiClient.get(Endpoints.auth.me, {
        headers: { Authorization: `Bearer ${access}` },
      });
      user = normalizeUser(userRes.data.user || userRes.data, email);
      if (userRes.data.organization) {
        organization = normalizeOrg(userRes.data.organization);
      }
    } catch {
      // Fallback user object if /auth/me/ is not implemented yet
      user = {
        id: `usr_${Date.now()}`,
        name: email.split('@')[0] || 'Administrator',
        email: email.trim(),
        role: role || 'org_admin',
        organizationId: 'org_smanv_01',
        organizationName: 'SMANV International Academy',
      };
    }
  }

  return {
    tokens: { access, refresh },
    user,
    organization,
    message: response.data.message || 'Login successful',
  };
}

/**
 * Registers an educational institution and its primary Organization Admin.
 * Saves organization and admin records to PostgreSQL backend.
 * Returns JWT tokens for immediate authenticated login.
 */
export async function registerOrgApi(payload: RegisterOrgPayload): Promise<AuthResponse> {
  const { organization, admin } = payload;

  // Formulate request body accommodating both nested and flat DRF serializers
  const requestBody = {
    organization: {
      name: organization.name,
      type: organization.type || 'school',
      email: organization.email,
      phone: organization.phone,
      address: organization.address,
      city: organization.city,
      state: organization.state,
      pincode: organization.pincode,
    },
    admin: {
      name: admin.name,
      email: admin.email,
      phone: admin.phone,
      password: admin.password,
    },
    // Top-level aliases for flat DRF ModelSerializers:
    org_name: organization.name,
    org_type: organization.type || 'school',
    org_email: organization.email,
    org_phone: organization.phone,
    org_address: organization.address,
    org_city: organization.city,
    org_state: organization.state,
    org_pincode: organization.pincode,
    admin_name: admin.name,
    admin_email: admin.email,
    admin_phone: admin.phone,
    password: admin.password,
  };

  const response = await apiClient.post(Endpoints.auth.registerOrg, requestBody);

  const access = response.data.access;
  const refresh = response.data.refresh;

  const createdOrg = normalizeOrg(response.data.organization || response.data.org || organization);
  const createdAdmin = normalizeUser(
    response.data.user || response.data.admin || admin,
    admin.email
  );

  return {
    tokens: {
      access: access || `smanv_access_${Date.now()}`,
      refresh: refresh || `smanv_refresh_${Date.now()}`,
    },
    user: createdAdmin,
    organization: createdOrg,
    message: response.data.message || 'Organization registered successfully',
  };
}

/**
 * Manually requests a new access token using a valid refresh token.
 */
export async function refreshTokenApi(refresh: string): Promise<TokenRefreshResponse> {
  const response = await axios.post(`${API_BASE_URL}${Endpoints.auth.refresh}`, {
    refresh,
  });

  return {
    access: response.data.access,
    refresh: response.data.refresh || refresh,
  };
}

/**
 * Retrieves current authenticated user profile from Django backend.
 */
export async function fetchCurrentUserApi(): Promise<{ user: User; organization?: Organization }> {
  const response = await apiClient.get(Endpoints.auth.me);
  const data = response.data;
  const user = normalizeUser(data.user || data, data.email || '');
  const organization = data.organization ? normalizeOrg(data.organization) : undefined;
  return { user, organization };
}

/**
 * Logs out user and attempts to blacklist refresh token on Django backend.
 */
export async function logoutApi(refreshToken?: string): Promise<void> {
  if (!refreshToken) return;
  try {
    await apiClient.post(Endpoints.auth.logout, {
      refresh: refreshToken,
      refresh_token: refreshToken,
    });
  } catch (err) {
    // Non-blocking: local tokens will be erased regardless of backend status
    console.log('Backend logout blacklist notification skipped or failed', err);
  }
}
