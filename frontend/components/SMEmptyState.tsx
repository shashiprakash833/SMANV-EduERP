/**
 * SMANV EduERP SMEmptyState Component
 * Developed by SMANV Info Tech Private Limited
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../store/ThemeContext';
import { SMButton } from './SMButton';
import { Layout } from '../constants/Layout';

interface SMEmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  actionTitle?: string;
  onActionPress?: () => void;
  style?: ViewStyle;
}

export const SMEmptyState: React.FC<SMEmptyStateProps> = ({
  icon = 'file-tray-outline',
  title,
  description,
  actionTitle,
  onActionPress,
  style,
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.iconWrapper, { backgroundColor: colors.primaryContainer }]}>
        <Ionicons name={icon} size={40} color={colors.primary} />
      </View>
      <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
      <Text style={[styles.description, { color: colors.textSecondary }]}>
        {description}
      </Text>
      {actionTitle && onActionPress && (
        <SMButton
          title={actionTitle}
          onPress={onActionPress}
          variant="primary"
          size="sm"
          style={styles.btn}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Layout.spacing.xxl,
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Layout.spacing.md,
  },
  title: {
    fontSize: Layout.fontSize.titleMedium,
    fontWeight: '700',
    marginBottom: 6,
    textAlign: 'center',
  },
  description: {
    fontSize: Layout.fontSize.bodyMedium,
    textAlign: 'center',
    lineHeight: Layout.lineHeight.bodyMedium,
    marginBottom: Layout.spacing.lg,
  },
  btn: {
    minWidth: 140,
  },
});
