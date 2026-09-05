/**
 * SMANV EduERP Brand Logo & Visual Emblem
 * Developed by SMANV Info Tech Private Limited
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../store/ThemeContext';
import { SMANV_BRAND } from '../constants/Colors';
import { Layout } from '../constants/Layout';

interface SMANVLogoProps {
  variant?: 'splash' | 'header' | 'icon-only' | 'card';
  size?: number;
  style?: ViewStyle;
}

export const SMANVLogo: React.FC<SMANVLogoProps> = ({
  variant = 'splash',
  size = 64,
  style,
}) => {
  const { colors } = useTheme();

  if (variant === 'icon-only') {
    return (
      <View
        style={[
          styles.emblemWrapper,
          { width: size, height: size, borderRadius: size * 0.3 },
          Layout.shadows.md,
          style,
        ]}
      >
        <LinearGradient
          colors={[colors.primaryDark, colors.primary, colors.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradient, { width: size, height: size, borderRadius: size * 0.3 }]}
        >
          <Ionicons name="school-outline" size={size * 0.52} color="#FFFFFF" />
        </LinearGradient>
      </View>
    );
  }

  if (variant === 'header') {
    return (
      <View style={[styles.headerRow, style]}>
        <View
          style={[
            styles.emblemWrapper,
            { width: 34, height: 34, borderRadius: 10 },
          ]}
        >
          <LinearGradient
            colors={[colors.primary, colors.secondary]}
            style={[styles.gradient, { width: 34, height: 34, borderRadius: 10 }]}
          >
            <Ionicons name="school" size={18} color="#FFFFFF" />
          </LinearGradient>
        </View>
        <View style={styles.headerTextCol}>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
            SMANV <Text style={{ color: colors.primary }}>EduERP</Text>
          </Text>
          <Text style={[styles.headerByline, { color: colors.textSecondary }]}>
            by SMANV Info Tech
          </Text>
        </View>
      </View>
    );
  }

  // Splash & Card Variant
  return (
    <View style={[styles.splashContainer, style]}>
      <View
        style={[
          styles.emblemWrapper,
          { width: size, height: size, borderRadius: size * 0.28 },
          Layout.shadows.xl,
        ]}
      >
        <LinearGradient
          colors={[colors.primaryDark, colors.primary, colors.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradient, { width: size, height: size, borderRadius: size * 0.28 }]}
        >
          <Ionicons name="school" size={size * 0.5} color="#FFFFFF" />
          <View style={styles.aiSparkleBadge}>
            <Ionicons name="sparkles" size={size * 0.22} color="#FEF08A" />
          </View>
        </LinearGradient>
      </View>

      <Text style={[styles.brandTitle, { color: colors.textPrimary }]}>
        SMANV <Text style={{ color: colors.primary }}>EduERP</Text>
      </Text>

      <View style={styles.companyBadgeRow}>
        <Text style={[styles.developedBy, { color: colors.textSecondary }]}>
          Developed by
        </Text>
        <Text style={[styles.companyName, { color: colors.primaryDark }]}>
          {SMANV_BRAND.company}
        </Text>
      </View>

      <Text style={[styles.tagline, { color: colors.textSecondary }]}>
        "{SMANV_BRAND.tagline}"
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  splashContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emblemWrapper: {
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  aiSparkleBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginTop: 18,
    textAlign: 'center',
  },
  companyBadgeRow: {
    alignItems: 'center',
    marginTop: 6,
  },
  developedBy: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  companyName: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
  },
  tagline: {
    fontSize: 13,
    fontStyle: 'italic',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTextCol: {
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  headerByline: {
    fontSize: 10,
    fontWeight: '500',
  },
});
