/**
 * SMANV EduERP SMCard Component
 * Material Design 3 surface card with soft elevation and 16px corner radius.
 * Developed by SMANV Info Tech Private Limited
 */

import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { useTheme } from '../store/ThemeContext';
import { Layout } from '../constants/Layout';

interface SMCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  elevation?: 'none' | 'sm' | 'md' | 'lg';
  bordered?: boolean;
  padding?: keyof typeof Layout.spacing | 'none';
  testID?: string;
}

export const SMCard: React.FC<SMCardProps> = ({
  children,
  onPress,
  style,
  elevation = 'sm',
  bordered = true,
  padding = 'md',
  testID,
}) => {
  const { colors } = useTheme();

  const cardStyle: ViewStyle = {
    backgroundColor: colors.card,
    borderRadius: Layout.borderRadius.lg, // 16px
    padding: padding === 'none' ? 0 : Layout.spacing[padding],
    borderWidth: bordered ? 1 : 0,
    borderColor: colors.cardBorder,
    ...Layout.shadows[elevation],
  };

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        testID={testID}
        style={[styles.base, cardStyle, style]}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View testID={testID} style={[styles.base, cardStyle, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
});
