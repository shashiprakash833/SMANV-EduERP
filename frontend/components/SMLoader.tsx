/**
 * SMANV EduERP SMLoader Component
 * Developed by SMANV Info Tech Private Limited
 */

import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../store/ThemeContext';
import { Layout } from '../constants/Layout';

interface SMLoaderProps {
  message?: string;
  size?: 'small' | 'large';
  fullScreen?: boolean;
  style?: ViewStyle;
}

export const SMLoader: React.FC<SMLoaderProps> = ({
  message,
  size = 'large',
  fullScreen = false,
  style,
}) => {
  const { colors } = useTheme();

  const content = (
    <View style={[styles.centerBox, style]}>
      <ActivityIndicator size={size} color={colors.primary} />
      {message && (
        <Text style={[styles.message, { color: colors.textSecondary }]}>
          {message}
        </Text>
      )}
    </View>
  );

  if (fullScreen) {
    return (
      <View style={[styles.fullScreen, { backgroundColor: colors.background }]}>
        {content}
      </View>
    );
  }

  return content;
};

export const SMSkeletonCard: React.FC<{ height?: number; style?: ViewStyle }> = ({
  height = 90,
  style,
}) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.skeleton,
        {
          height,
          backgroundColor: colors.surfaceVariant,
          borderColor: colors.border,
        },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  centerBox: {
    padding: Layout.spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    marginTop: Layout.spacing.sm,
    fontSize: Layout.fontSize.bodyMedium,
    fontWeight: '500',
  },
  skeleton: {
    width: '100%',
    borderRadius: Layout.borderRadius.lg,
    borderWidth: 1,
    marginVertical: Layout.spacing.xs,
    opacity: 0.6,
  },
});
