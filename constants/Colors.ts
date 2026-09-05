/**
 * SMANV EduERP Design System Colors
 * Developed by SMANV Info Tech Private Limited
 * Tagline: AI Powered School & College Management System
 */

export const SMANV_BRAND = {
  name: 'SMANV EduERP',
  company: 'SMANV Info Tech Private Limited',
  tagline: 'AI Powered School & College Management System',
  website: 'https://smanv.com',
  supportEmail: 'support@smanv.com',
  version: '1.0.0 (Enterprise Build)',
};

export const Colors = {
  light: {
    // Primary Brand Colors
    primary: '#2E7D32', // Forest / Emerald Green
    primaryDark: '#1B5E20',
    primaryLight: '#4CAF50',
    primaryContainer: '#E8F5E9',
    onPrimary: '#FFFFFF',
    onPrimaryContainer: '#1B5E20',

    // Secondary Brand Colors
    secondary: '#66BB6A',
    secondaryDark: '#388E3C',
    secondaryLight: '#A5D6A7',
    secondaryContainer: '#E8F8EA',
    onSecondary: '#FFFFFF',
    onSecondaryContainer: '#1B5E20',

    // Accent & AI Colors
    accent: '#10B981',
    aiGradientStart: '#2E7D32',
    aiGradientMid: '#10B981',
    aiGradientEnd: '#0D9488',
    aiContainer: '#ECFDF5',
    aiBorder: '#A7F3D0',

    // Background & Surfaces
    background: '#FFFFFF',
    surface: '#F8FAFC',
    surfaceVariant: '#F1F5F9',
    card: '#F8FAFC',
    cardElevated: '#FFFFFF',
    cardBorder: '#E5E7EB',
    modalBackground: '#FFFFFF',

    // Typography
    textPrimary: '#1F2937',
    textSecondary: '#6B7280',
    textTertiary: '#9CA3AF',
    textInverse: '#FFFFFF',

    // Functional State Colors
    success: '#16A34A',
    successContainer: '#DCFCE7',
    onSuccess: '#FFFFFF',

    warning: '#F59E0B',
    warningContainer: '#FEF3C7',
    onWarning: '#FFFFFF',

    error: '#DC2626',
    errorContainer: '#FEE2E2',
    onError: '#FFFFFF',

    info: '#2563EB',
    infoContainer: '#DBEAFE',
    onInfo: '#FFFFFF',

    // Borders, Dividers & Overlays
    border: '#E5E7EB',
    borderLight: '#F3F4F6',
    divider: '#E5E7EB',
    backdrop: 'rgba(0, 0, 0, 0.5)',
    ripple: 'rgba(46, 125, 50, 0.12)',

    // Tab Bar
    tabBarBackground: '#FFFFFF',
    tabBarActive: '#2E7D32',
    tabBarInactive: '#9CA3AF',
    tabBarBorder: '#E5E7EB',
  },

  dark: {
    // Primary Brand Colors
    primary: '#66BB6A',
    primaryDark: '#2E7D32',
    primaryLight: '#81C784',
    primaryContainer: '#1E3A20',
    onPrimary: '#0F2911',
    onPrimaryContainer: '#C8E6C9',

    // Secondary Brand Colors
    secondary: '#81C784',
    secondaryDark: '#388E3C',
    secondaryLight: '#A5D6A7',
    secondaryContainer: '#1B381D',
    onSecondary: '#0A240C',
    onSecondaryContainer: '#C8E6C9',

    // Accent & AI Colors
    accent: '#34D399',
    aiGradientStart: '#059669',
    aiGradientMid: '#10B981',
    aiGradientEnd: '#14B8A6',
    aiContainer: '#064E3B',
    aiBorder: '#059669',

    // Background & Surfaces
    background: '#0F172A',
    surface: '#1E293B',
    surfaceVariant: '#334155',
    card: '#1E293B',
    cardElevated: '#334155',
    cardBorder: '#334155',
    modalBackground: '#1E293B',

    // Typography
    textPrimary: '#F9FAFB',
    textSecondary: '#9CA3AF',
    textTertiary: '#64748B',
    textInverse: '#0F172A',

    // Functional State Colors
    success: '#22C55E',
    successContainer: '#14532D',
    onSuccess: '#FFFFFF',

    warning: '#FBBF24',
    warningContainer: '#78350F',
    onWarning: '#FFFFFF',

    error: '#EF4444',
    errorContainer: '#7F1D1D',
    onError: '#FFFFFF',

    info: '#3B82F6',
    infoContainer: '#1E3A8A',
    onInfo: '#FFFFFF',

    // Borders, Dividers & Overlays
    border: '#334155',
    borderLight: '#1E293B',
    divider: '#334155',
    backdrop: 'rgba(0, 0, 0, 0.7)',
    ripple: 'rgba(102, 187, 106, 0.15)',

    // Tab Bar
    tabBarBackground: '#1E293B',
    tabBarActive: '#66BB6A',
    tabBarInactive: '#64748B',
    tabBarBorder: '#334155',
  },
};

export type ThemeColors = typeof Colors.light;
