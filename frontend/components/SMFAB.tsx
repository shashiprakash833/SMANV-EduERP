/**
 * SMANV EduERP SMFAB Component
 * Floating Action Button with AI Gradient & Pulsing Elevation
 * Developed by SMANV Info Tech Private Limited
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../store/ThemeContext';
import { Layout } from '../constants/Layout';

interface SMFABProps {
  onPress: () => void;
  label?: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  variant?: 'ai' | 'primary' | 'secondary';
  style?: ViewStyle;
}

export const SMFAB: React.FC<SMFABProps> = ({
  onPress,
  label = 'SMANV AI',
  iconName = 'sparkles',
  variant = 'ai',
  style,
}) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.container, Layout.shadows.xl, style]}
    >
      <LinearGradient
        colors={
          variant === 'ai'
            ? [colors.aiGradientStart, colors.aiGradientMid, colors.aiGradientEnd]
            : [colors.primary, colors.secondaryDark]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <Ionicons name={iconName} size={22} color="#FFFFFF" />
        {label ? <Text style={styles.label}>{label}</Text> : null}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    borderRadius: Layout.borderRadius.full,
    zIndex: 999,
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: Layout.borderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  label: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: Layout.fontSize.bodyMedium,
    marginLeft: 8,
    letterSpacing: 0.3,
  },
});
