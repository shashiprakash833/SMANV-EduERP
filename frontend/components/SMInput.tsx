/**
 * SMANV EduERP SMInput Component
 * Enterprise Form Input with focus state, validation error, and icons.
 * Developed by SMANV Info Tech Private Limited
 */

import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../store/ThemeContext';
import { Layout } from '../constants/Layout';

interface SMInputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  isPassword?: boolean;
  required?: boolean;
}

export const SMInput: React.FC<SMInputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  containerStyle,
  isPassword = false,
  required = false,
  secureTextEntry,
  ...props
}) => {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const effectiveSecure = isPassword ? !showPassword : secureTextEntry;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <View style={styles.labelRow}>
          <Text style={[styles.label, { color: colors.textPrimary }]}>
            {label}
            {required && <Text style={{ color: colors.error }}> *</Text>}
          </Text>
        </View>
      )}

      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: colors.surface,
            borderColor: error
              ? colors.error
              : isFocused
              ? colors.primary
              : colors.border,
            borderWidth: isFocused ? 1.5 : 1,
          },
        ]}
      >
        {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}

        <TextInput
          style={[
            styles.input,
            {
              color: colors.textPrimary,
              height: props.multiline ? 100 : 48,
              textAlignVertical: props.multiline ? 'top' : 'center',
            },
          ]}
          placeholderTextColor={colors.textTertiary}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={effectiveSecure}
          {...props}
        />

        {isPassword ? (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.iconContainer}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        ) : (
          rightIcon && <View style={styles.iconContainer}>{rightIcon}</View>
        )}
      </View>

      {error ? (
        <Text style={[styles.helperText, { color: colors.error }]}>{error}</Text>
      ) : helperText ? (
        <Text style={[styles.helperText, { color: colors.textSecondary }]}>{helperText}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Layout.spacing.md,
  },
  labelRow: {
    marginBottom: 6,
  },
  label: {
    fontSize: Layout.fontSize.bodyMedium,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Layout.borderRadius.md,
    paddingHorizontal: Layout.spacing.sm,
    minHeight: 48,
  },
  input: {
    flex: 1,
    fontSize: Layout.fontSize.bodyLarge,
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  iconContainer: {
    paddingHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helperText: {
    fontSize: Layout.fontSize.caption,
    marginTop: 4,
    marginLeft: 4,
  },
});
