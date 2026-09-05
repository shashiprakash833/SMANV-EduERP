/**
 * SMANV EduERP Authentication & Role Context
 * Connects to Django REST Framework (DRF) JWT Backend
 * Developed by SMANV Info Tech Private Limited
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Organization, UserRole } from '../types';
import { DEMO_USERS, MOCK_ORGANIZATION } from '../constants/MockData';
import {
  saveTokens,
  getAccessToken,
  getRefreshToken,
  clearAuthData,
  setSecureItem,
  getSecureItem,
  STORAGE_KEYS,
  setJsonItem,
  getJsonItem,
} from '../services/storage';
import { setOnAuthFailure, API_BASE_URL } from '../api/client';
import {
  loginApi,
  registerOrgApi,
  refreshTokenApi,
  fetchCurrentUserApi,
  logoutApi,
  extractErrorMessage,
} from '../api/auth';

interface AuthContextType {
  user: User | null;
  organization: Organization;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: string | null;
  clearError: () => void;
  login: (email: string, password?: string, preferredRole?: UserRole) => Promise<boolean>;
  logout: () => Promise<void>;
  switchDemoRole: (role: UserRole) => void;
  registerOrganization: (orgData: Partial<Organization>, adminData: any) => Promise<boolean>;
  updateUserProfile: (data: Partial<User>) => void;
  refreshSession: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  organization: MOCK_ORGANIZATION,
  role: 'org_admin',
  isAuthenticated: false,
  isLoading: true,
  authError: null,
  clearError: () => {},
  login: async () => false,
  logout: async () => {},
  switchDemoRole: () => {},
  registerOrganization: async () => false,
  updateUserProfile: () => {},
  refreshSession: async () => false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [organization, setOrganization] = useState<Organization>(MOCK_ORGANIZATION);
  const [role, setRole] = useState<UserRole>('org_admin');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setAuthError(null);
  }, []);

  // Handle automatic logout when token refresh fails globally in Axios interceptor
  const handleAuthFailure = useCallback(async () => {
    console.log('[SMANV Auth] Refresh token expired or invalid. Performing auto-logout.');
    await clearAuthData();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  useEffect(() => {
    setOnAuthFailure(handleAuthFailure);
    return () => {
      setOnAuthFailure(null);
    };
  }, [handleAuthFailure]);

  useEffect(() => {
    checkInitialAuth();
  }, []);

  /**
   * Auto-Login on application startup
   * 1. Reads stored access and refresh tokens from SecureStore
   * 2. Validates session with Django REST Framework backend
   * 3. Automatically refreshes access token if expired
   */
  const checkInitialAuth = async () => {
    try {
      const accessToken = await getAccessToken();
      const refreshToken = await getRefreshToken();

      if (!accessToken && !refreshToken) {
        // No stored credentials
        setIsAuthenticated(false);
        setUser(null);
        setIsLoading(false);
        return;
      }

      // Try fetching current user profile using existing access token
      try {
        const { user: fetchedUser, organization: fetchedOrg } = await fetchCurrentUserApi();
        setUser(fetchedUser);
        setRole(fetchedUser.role);
        if (fetchedOrg) setOrganization(fetchedOrg);
        setIsAuthenticated(true);
      } catch (err: any) {
        // If 401 or token expired, attempt token refresh using refresh token
        if (refreshToken) {
          try {
            const tokenRes = await refreshTokenApi(refreshToken);
            await saveTokens(tokenRes.access, tokenRes.refresh || refreshToken);
            const { user: refreshedUser, organization: refreshedOrg } = await fetchCurrentUserApi();
            setUser(refreshedUser);
            setRole(refreshedUser.role);
            if (refreshedOrg) setOrganization(refreshedOrg);
            setIsAuthenticated(true);
          } catch {
            // Refresh failed: tokens are expired or invalid
            await clearAuthData();
            setUser(null);
            setIsAuthenticated(false);
          }
        } else {
          await clearAuthData();
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    } catch (e) {
      console.warn('[SMANV Auth] Initialization check error:', e);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Login with email and password via Django REST Framework
   * On success: stores JWT tokens in SecureStore and updates AuthContext
   */
  const login = async (
    email: string,
    password?: string,
    preferredRole?: UserRole
  ): Promise<boolean> => {
    setIsLoading(true);
    setAuthError(null);

    const trimmedEmail = email.trim();
    const cleanPassword = password || '';

    // Check if backend API URL is configured
    if (!API_BASE_URL) {
      // Fallback to local demo profile if no backend URL configured
      return executeDemoLogin(trimmedEmail, preferredRole);
    }

    try {
      const authRes = await loginApi({
        email: trimmedEmail,
        password: cleanPassword,
        role: preferredRole,
      });

      // Save tokens to Expo SecureStore
      await saveTokens(authRes.tokens.access, authRes.tokens.refresh);
      await setSecureItem(STORAGE_KEYS.USER_ROLE, authRes.user.role);
      await setJsonItem(STORAGE_KEYS.USER_PROFILE, authRes.user);
      await setJsonItem(STORAGE_KEYS.ORGANIZATION, authRes.organization);

      setUser(authRes.user);
      setRole(authRes.user.role);
      setOrganization(authRes.organization);
      setIsAuthenticated(true);
      setIsLoading(false);
      return true;
    } catch (error: any) {
      // If network fails and user selected a quick demo profile, permit demo fallback
      if (preferredRole && cleanPassword.includes('DemoPass')) {
        console.log('[SMANV Auth] Backend unreachable, falling back to demo role:', preferredRole);
        return executeDemoLogin(trimmedEmail, preferredRole);
      }

      const errorMessage = extractErrorMessage(
        error,
        'Invalid credentials. Please verify your email and password.'
      );
      setAuthError(errorMessage);
      setIsLoading(false);
      return false;
    }
  };

  /**
   * Helper for instant demo login
   */
  const executeDemoLogin = async (email: string, preferredRole?: UserRole): Promise<boolean> => {
    let matchedRole: UserRole = preferredRole || 'org_admin';

    if (!preferredRole) {
      if (email.includes('super')) matchedRole = 'super_admin';
      else if (email.includes('staff') || email.includes('teacher') || email.includes('priya')) matchedRole = 'staff';
      else if (email.includes('student') || email.includes('aarav')) matchedRole = 'student';
      else if (email.includes('parent') || email.includes('vikram')) matchedRole = 'parent';
      else if (email.includes('finance') || email.includes('accounts')) matchedRole = 'finance';
      else matchedRole = 'org_admin';
    }

    const matchedUser = DEMO_USERS[matchedRole] || DEMO_USERS.org_admin;
    setUser(matchedUser);
    setRole(matchedRole);
    setOrganization(MOCK_ORGANIZATION);
    setIsAuthenticated(true);

    await saveTokens('demo_jwt_access_token_smanv_2026', 'demo_jwt_refresh_token_smanv_2026');
    await setSecureItem(STORAGE_KEYS.USER_ROLE, matchedRole);

    setIsLoading(false);
    return true;
  };

  /**
   * Registers educational institution in PostgreSQL and creates Org Admin account
   * Stores received JWT tokens and transitions user to authenticated state
   */
  const registerOrganization = async (
    orgData: Partial<Organization>,
    adminData: any
  ): Promise<boolean> => {
    setIsLoading(true);
    setAuthError(null);

    // If backend API URL is configured, call Django REST Framework
    if (API_BASE_URL) {
      try {
        const authRes = await registerOrgApi({
          organization: orgData,
          admin: adminData,
        });

        // Store received JWT tokens in Expo SecureStore
        await saveTokens(authRes.tokens.access, authRes.tokens.refresh);
        await setSecureItem(STORAGE_KEYS.USER_ROLE, 'org_admin');
        await setJsonItem(STORAGE_KEYS.USER_PROFILE, authRes.user);
        await setJsonItem(STORAGE_KEYS.ORGANIZATION, authRes.organization);

        setOrganization(authRes.organization);
        setUser(authRes.user);
        setRole('org_admin');
        setIsAuthenticated(true);
        setIsLoading(false);
        return true;
      } catch (error: any) {
        const errorMessage = extractErrorMessage(
          error,
          'Registration failed. Please verify your institution details.'
        );
        setAuthError(errorMessage);
        setIsLoading(false);
        return false;
      }
    }

    // Offline / Demo Fallback Mode
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newOrg: Organization = {
      ...MOCK_ORGANIZATION,
      ...orgData,
      id: `org_${Date.now()}`,
      name: orgData.name || 'New Educational Institution',
      type: orgData.type || 'school',
    };

    const newAdmin: User = {
      id: `usr_${Date.now()}`,
      name: adminData.name || 'Organization Administrator',
      email: adminData.email || 'admin@institution.edu',
      role: 'org_admin',
      organizationId: newOrg.id,
      organizationName: newOrg.name,
      phone: adminData.phone || '+91 99999 00000',
    };

    setOrganization(newOrg);
    setUser(newAdmin);
    setRole('org_admin');
    setIsAuthenticated(true);

    await saveTokens('demo_registered_jwt_token_2026', 'demo_registered_refresh_token_2026');
    await setSecureItem(STORAGE_KEYS.USER_ROLE, 'org_admin');

    setIsLoading(false);
    return true;
  };

  /**
   * Explicit user logout: notifies Django backend, purges SecureStore and resets state
   */
  const logout = async () => {
    setIsLoading(true);
    try {
      const refreshToken = await getRefreshToken();
      await logoutApi(refreshToken || undefined);
    } catch {
      // Non-blocking
    } finally {
      await clearAuthData();
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  };

  /**
   * Allows role switching for test profiles
   */
  const switchDemoRole = (newRole: UserRole) => {
    const newUser = DEMO_USERS[newRole];
    if (newUser) {
      setUser(newUser);
      setRole(newRole);
      setSecureItem(STORAGE_KEYS.USER_ROLE, newRole);
    }
  };

  /**
   * Refreshes the active session manually
   */
  const refreshSession = async (): Promise<boolean> => {
    try {
      const refreshToken = await getRefreshToken();
      if (!refreshToken) return false;
      const res = await refreshTokenApi(refreshToken);
      await saveTokens(res.access, res.refresh || refreshToken);
      return true;
    } catch {
      await logout();
      return false;
    }
  };

  const updateUserProfile = (data: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...data };
      setUser(updated);
      setJsonItem(STORAGE_KEYS.USER_PROFILE, updated);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        organization,
        role,
        isAuthenticated,
        isLoading,
        authError,
        clearError,
        login,
        logout,
        switchDemoRole,
        registerOrganization,
        updateUserProfile,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
