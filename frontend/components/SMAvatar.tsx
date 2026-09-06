/**
 * SMANV EduERP SMAvatar Component
 * Developed by SMANV Info Tech Private Limited
 */

import React from 'react';
import { View, Text, StyleSheet, Image, ViewStyle } from 'react-native';
import { useTheme } from '../store/ThemeContext';

interface SMAvatarProps {
  name: string;
  imageUrl?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'busy';
  style?: ViewStyle;
}

export const SMAvatar: React.FC<SMAvatarProps> = ({
  name,
  imageUrl,
  size = 'md',
  status,
  style,
}) => {
  const { colors } = useTheme();

  const dimensions = {
    sm: 32,
    md: 44,
    lg: 56,
    xl: 72,
  }[size];

  const fontSize = {
    sm: 13,
    md: 17,
    lg: 22,
    xl: 28,
  }[size];

  const getInitials = (fullName: string) => {
    if (!fullName) return 'S';
    const parts = fullName.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return fullName.substring(0, 2).toUpperCase();
  };

  const statusColor = {
    online: colors.success,
    offline: colors.textTertiary,
    busy: colors.warning,
  }[status || 'online'];

  return (
    <View style={[{ width: dimensions, height: dimensions }, styles.wrapper, style]}>
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={[styles.image, { width: dimensions, height: dimensions, borderRadius: dimensions / 2 }]}
        />
      ) : (
        <View
          style={[
            styles.fallback,
            {
              width: dimensions,
              height: dimensions,
              borderRadius: dimensions / 2,
              backgroundColor: colors.primaryContainer,
              borderColor: colors.primary,
            },
          ]}
        >
          <Text style={[styles.initials, { fontSize, color: colors.primaryDark }]}>
            {getInitials(name)}
          </Text>
        </View>
      )}

      {status && (
        <View
          style={[
            styles.statusDot,
            {
              backgroundColor: statusColor,
              borderColor: colors.background,
              width: dimensions * 0.28,
              height: dimensions * 0.28,
              borderRadius: (dimensions * 0.28) / 2,
            },
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    resizeMode: 'cover',
  },
  fallback: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
  },
  initials: {
    fontWeight: '700',
  },
  statusDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
  },
});
