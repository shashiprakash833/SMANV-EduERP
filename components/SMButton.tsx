/**
 * SMANV EduERP SMButton Component
 * Developed by SMANV Info Tech Private Limited
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../store/ThemeContext';
import { Layout } from '../constants/Layout';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'ai';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface SMButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  testID?: string;
}

export const SMButton: React.FC<SMButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
  textStyle,
  testID,
}) => {
  const { colors } = useTheme();

  const getContainerStyle = (): ViewStyle => {
    const sizePadding = {
      sm: { paddingVertical: 8, paddingHorizontal: 14, minHeight: 36 },
      md: { paddingVertical: 12, paddingHorizontal: 20, minHeight: 48 }, // 48dp touch target
      lg: { paddingVertical: 16, paddingHorizontal: 24, minHeight: 56 },
    }[size];

    const baseStyle: ViewStyle = {
      borderRadius: Layout.borderRadius.lg,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: fullWidth ? 'stretch' : 'auto',
      opacity: disabled || loading ? 0.6 : 1,
      ...sizePadding,
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: colors.primary,
          ...Layout.shadows.sm,
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: colors.secondaryContainer,
          borderWidth: 1,
          borderColor: colors.secondary,
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderColor: colors.primary,
        };
      case 'ghost':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
        };
      case 'danger':
        return {
          ...baseStyle,
          backgroundColor: colors.error,
          ...Layout.shadows.sm,
        };
      case 'ai':
        return {
          ...baseStyle,
          ...Layout.shadows.md,
        };
      default:
        return baseStyle;
    }
  };

  const getTextStyle = (): TextStyle => {
    const fontSizes = {
      sm: Layout.fontSize.bodySmall,
      md: Layout.fontSize.bodyMedium,
      lg: Layout.fontSize.bodyLarge,
    }[size];

    let textColor = colors.onPrimary;
    if (variant === 'secondary') textColor = colors.onSecondaryContainer;
    if (variant === 'outline') textColor = colors.primary;
    if (variant === 'ghost') textColor = colors.primary;
    if (variant === 'danger') textColor = colors.onError;
    if (variant === 'ai') textColor = '#FFFFFF';

    return {
      color: textColor,
      fontSize: fontSizes,
      fontWeight: '600',
      textAlign: 'center',
    };
  };

  const content = (
    <View style={styles.innerContent}>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'ghost' ? colors.primary : '#FFFFFF'}
          style={styles.spinner}
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && <View style={styles.iconLeft}>{icon}</View>}
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
          {icon && iconPosition === 'right' && <View style={styles.iconRight}>{icon}</View>}
        </>
      )}
    </View>
  );

  if (variant === 'ai') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.85}
        testID={testID}
        style={[getContainerStyle(), { overflow: 'hidden', paddingVertical: 0, paddingHorizontal: 0 }, style]}
      >
        <LinearGradient
          colors={[colors.aiGradientStart, colors.aiGradientMid, colors.aiGradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradientFill, { paddingVertical: size === 'sm' ? 8 : size === 'lg' ? 16 : 12, paddingHorizontal: 20 }]}
        >
          {content}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      testID={testID}
      style={[getContainerStyle(), style]}
    >
      {content}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  innerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientFill: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    marginHorizontal: 8,
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});
