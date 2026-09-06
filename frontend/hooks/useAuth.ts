/**
 * SMANV EduERP Reusable Authentication Hooks
 * Developed by SMANV Info Tech Private Limited
 */

import { useAuth as useAuthContext } from '../store/AuthContext';
import { UserRole } from '../types';

export function useAuth() {
  const context = useAuthContext();

  const isSuperAdmin = context.role === 'super_admin';
  const isOrgAdmin = context.role === 'org_admin';
  const isStaff = context.role === 'staff';
  const isStudent = context.role === 'student';
  const isParent = context.role === 'parent';
  const isFinance = context.role === 'finance';

  const isAdmin = isSuperAdmin || isOrgAdmin;

  const hasRole = (roles: UserRole[]): boolean => {
    return roles.includes(context.role);
  };

  return {
    ...context,
    isSuperAdmin,
    isOrgAdmin,
    isStaff,
    isStudent,
    isParent,
    isFinance,
    isAdmin,
    hasRole,
  };
}

export default useAuth;
