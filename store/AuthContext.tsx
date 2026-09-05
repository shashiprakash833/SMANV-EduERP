/**
 * SMANV EduERP Authentication & Role Context
 * Developed by SMANV Info Tech Private Limited
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Organization, UserRole } from '../types';
import { DEMO_USERS, MOCK_ORGANIZATION } from '../constants/MockData';
import { getSecureItem, setSecureItem, removeSecureItem } from '../services/storage';

interface AuthContextType {
  user: User | null;
  organization: Organization;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string, role?: UserRole) => Promise<boolean>;
  logout: () => Promise<void>;
  switchDemoRole: (role: UserRole) => void;
  registerOrganization: (orgData: Partial<Organization>, adminData: any) => Promise<boolean>;
  updateUserProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  organization: MOCK_ORGANIZATION,
  role: 'org_admin',
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  logout: async () => {},
  switchDemoRole: () => {},
  registerOrganization: async () => false,
  updateUserProfile: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(DEMO_USERS.org_admin);
  const [organization, setOrganization] = useState<Organization>(MOCK_ORGANIZATION);
  const [role, setRole] = useState<UserRole>('org_admin');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    checkInitialAuth();
  }, []);

  const checkInitialAuth = async () => {
    try {
      const savedRole = await getSecureItem('smanv_user_role');
      const token = await getSecureItem('smanv_access_token');

      if (token && savedRole && DEMO_USERS[savedRole]) {
        const foundUser = DEMO_USERS[savedRole];
        setUser(foundUser);
        setRole(foundUser.role);
        setIsAuthenticated(true);
      } else {
        // Default to Org Admin demo for immediate testing
        setUser(DEMO_USERS.org_admin);
        setRole('org_admin');
        setIsAuthenticated(true);
      }
    } catch (e) {
      console.warn('Auth check error:', e);
      setUser(DEMO_USERS.org_admin);
      setRole('org_admin');
      setIsAuthenticated(true);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password?: string, preferredRole?: UserRole): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate realistic network call

    let matchedRole: UserRole = preferredRole || 'org_admin';

    // Role detection from email pattern or demo logins
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
    setIsAuthenticated(true);

    await setSecureItem('smanv_access_token', 'demo_jwt_access_token_smanv_2026');
    await setSecureItem('smanv_refresh_token', 'demo_jwt_refresh_token_smanv_2026');
    await setSecureItem('smanv_user_role', matchedRole);

    setIsLoading(false);
    return true;
  };

  const switchDemoRole = (newRole: UserRole) => {
    const newUser = DEMO_USERS[newRole];
    if (newUser) {
      setUser(newUser);
      setRole(newRole);
      setSecureItem('smanv_user_role', newRole);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    await removeSecureItem('smanv_access_token');
    await removeSecureItem('smanv_refresh_token');
    await removeSecureItem('smanv_user_role');
    setUser(null);
    setIsAuthenticated(false);
    setIsLoading(false);
  };

  const registerOrganization = async (
    orgData: Partial<Organization>,
    adminData: any
  ): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));

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

    await setSecureItem('smanv_access_token', 'demo_registered_jwt_token_2026');
    await setSecureItem('smanv_user_role', 'org_admin');

    setIsLoading(false);
    return true;
  };

  const updateUserProfile = (data: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...data });
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
        login,
        logout,
        switchDemoRole,
        registerOrganization,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
