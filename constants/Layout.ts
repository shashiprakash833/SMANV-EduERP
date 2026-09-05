/**
 * SMANV EduERP Layout & Spacing Constants
 * Follows an 8dp grid system and Material Design 3 specifications.
 */

import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export const Layout = {
  window: {
    width,
    height,
  },
  isSmallDevice: width < 375,
  isTablet: width >= 768,

  // 8dp grid spacing system
  spacing: {
    xxs: 4,
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
    xxxl: 40,
    huge: 48,
  },

  // Rounded corners (16px standard)
  borderRadius: {
    xs: 6,
    sm: 8,
    md: 12,
    lg: 16, // Standard MD3 Card / Input radius
    xl: 20,
    xxl: 24,
    full: 9999,
  },

  // Typography scale
  fontSize: {
    caption: 11,
    bodySmall: 12,
    bodyMedium: 14,
    bodyLarge: 16,
    titleSmall: 14,
    titleMedium: 16,
    titleLarge: 18,
    headlineSmall: 20,
    headlineMedium: 24,
    headlineLarge: 28,
    displaySmall: 32,
    displayMedium: 36,
  },

  lineHeight: {
    caption: 14,
    bodySmall: 16,
    bodyMedium: 20,
    bodyLarge: 24,
    titleSmall: 20,
    titleMedium: 24,
    titleLarge: 26,
    headlineSmall: 28,
    headlineMedium: 32,
    headlineLarge: 36,
    displaySmall: 40,
  },

  // Shadows (Material Design 3 elevation system)
  shadows: {
    none: {
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
      elevation: 6,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 20,
      elevation: 10,
    },
  },
};
