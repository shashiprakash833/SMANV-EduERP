/**
 * SMANV EduERP SMBadge Component
 * Material Design 3 Chip & Status Pill
 * Developed by SMANV Info Tech Private Limited
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../store/ThemeContext';
import { Layout } from '../constants/Layout';

export type BadgeVariant =
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'primary'
  | 'secondary'
  | 'neutral';

interface SMBadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  dot?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const SMBadge: React.FC<SMBadgeProps> = ({
  label,
  variant = 'primary',
  size = 'md',
  dot = false,
  style,
  textStyle,
}) => {
  const { colors } = useTheme();

  const getColors = () => {
    switch (variant) {
      case 'success':
        return { bg: colors.successContainer, text: colors.success, dot: colors.success };
      case 'warning':
        return { bg: colors.warningContainer, text: colors.warning, dot: colors.warning };
      case 'error':
        return { bg: colors.errorContainer, text: colors.error, dot: colors.error };
      case 'info':
        return { bg: colors.infoContainer, text: colors.info, dot: colors.info };
      case 'primary':
        return { bg: colors.primaryContainer, text: colors.primaryDark, dot: colors.primary };
      case 'secondary':
        return { bg: colors.secondaryContainer, text: colors.secondaryDark, dot: colors.secondary };
      case 'neutral':
      default:
        return { bg: colors.surfaceVariant, text: colors.textSecondary, dot: colors.textSecondary };
    }
  };

  const scheme = getColors();

  const paddingStyle = {
    sm: { paddingVertical: 2, paddingHorizontal: 8 },
    md: { paddingVertical: 4, paddingHorizontal: 12 },
  }[size];

  const fontSize = {
    sm: 11,
    md: 12,
  }[size];

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: scheme.bg, borderRadius: Layout.borderRadius.full },
        paddingStyle,
        style,
      ]}
    >
      {dot && (
        <View
          style={[
            styles.dot,
            { backgroundColor: scheme.dot, width: size === 'sm' ? 6 : 7, height: size === 'sm' ? 6 : 7 },
          ]}
        />
      )}
      <Text style={[styles.label, { color: scheme.text, fontSize }, textStyle]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  dot: {
    borderRadius: 999,
    marginRight: 6,
  },
  label: {
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});
