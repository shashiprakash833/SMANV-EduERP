/**
 * SMANV EduERP SMSearchBar Component
 * Global and contextual search bar with live filtering.
 * Developed by SMANV Info Tech Private Limited
 */

import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../store/ThemeContext';
import { Layout } from '../constants/Layout';

interface SMSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onFilterPress?: () => void;
  onClear?: () => void;
  style?: ViewStyle;
}

export const SMSearchBar: React.FC<SMSearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search students, staff, fees, exams...',
  onFilterPress,
  onClear,
  style,
}) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
        style,
      ]}
    >
      <Ionicons
        name="search-outline"
        size={20}
        color={colors.textSecondary}
        style={styles.searchIcon}
      />

      <TextInput
        style={[styles.input, { color: colors.textPrimary }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        returnKeyType="search"
        autoCapitalize="none"
      />

      {value.length > 0 && (
        <TouchableOpacity
          onPress={() => {
            onChangeText('');
            if (onClear) onClear();
          }}
          style={styles.actionBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      )}

      {onFilterPress && (
        <TouchableOpacity
          onPress={onFilterPress}
          style={[styles.filterBtn, { borderLeftColor: colors.border }]}
        >
          <Ionicons name="options-outline" size={18} color={colors.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Layout.borderRadius.lg,
    borderWidth: 1,
    paddingHorizontal: Layout.spacing.sm,
    height: 48,
    marginVertical: Layout.spacing.xs,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: Layout.fontSize.bodyMedium,
    paddingVertical: 8,
  },
  actionBtn: {
    padding: 4,
  },
  filterBtn: {
    paddingLeft: 10,
    marginLeft: 6,
    borderLeftWidth: 1,
  },
});
