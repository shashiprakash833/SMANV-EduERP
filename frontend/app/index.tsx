/**
 * SMANV EduERP Animated Splash Screen
 * Developed by SMANV Info Tech Private Limited
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useRouter, useRootNavigationState } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/store/AuthContext';
import { useTheme } from '@/store/ThemeContext';
import { SMANV_BRAND } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';

export default function SplashScreen() {
  const router = useRouter();
  const rootNavState = useRootNavigationState();
  const { colors, isDarkMode } = useTheme();
  const { isAuthenticated, isLoading } = useAuth();

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    // Run Fade & Scale Entrance Animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const proceedNext = () => {
    if (!rootNavState?.key) return;
    if (isAuthenticated) {
      router.replace('/(tabs)');
    } else {
      router.replace('/welcome');
    }
  };

  useEffect(() => {
    if (!rootNavState?.key || isLoading) return;

    // Auto navigate after 2 seconds
    const timer = setTimeout(() => {
      proceedNext();
    }, 2000);

    return () => clearTimeout(timer);
  }, [rootNavState?.key, isLoading, isAuthenticated]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? colors.background : '#FFFFFF' }]}>
      <View style={styles.centerSection}>
        <Animated.View
          style={[
            styles.animatedContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* SMANV Emblem Logo */}
          <View style={[styles.emblemShadow, Layout.shadows.xl]}>
            <LinearGradient
              colors={[colors.primaryDark, colors.primary, colors.secondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.emblem}
            >
              <Ionicons name="school" size={54} color="#FFFFFF" />
              <View style={styles.aiSparkle}>
                <Ionicons name="sparkles" size={24} color="#FEF08A" />
              </View>
            </LinearGradient>
          </View>

          {/* SMANV EduERP Title */}
          <Text style={[styles.brandTitle, { color: colors.textPrimary }]}>
            SMANV <Text style={{ color: colors.primary }}>EduERP</Text>
          </Text>

          {/* Developed By Byline */}
          <View style={styles.developerBox}>
            <Text style={[styles.developedByLabel, { color: colors.textSecondary }]}>
              Developed by
            </Text>
            <Text style={[styles.companyName, { color: colors.primaryDark }]}>
              {SMANV_BRAND.company}
            </Text>
          </View>

          {/* Tagline */}
          <Text style={[styles.tagline, { color: colors.textSecondary }]}>
            "{SMANV_BRAND.tagline}"
          </Text>
        </Animated.View>
      </View>

      {/* Bottom Circular Progress Indicator & Skip Action */}
      <View style={styles.bottomSection}>
        <ActivityIndicator size="large" color={colors.primary} style={styles.spinner} />
        <TouchableOpacity
          onPress={proceedNext}
          activeOpacity={0.7}
          style={styles.skipButton}
        >
          <Text style={[styles.skipText, { color: colors.primary }]}>
            Tap to continue →
          </Text>
        </TouchableOpacity>
        <Text style={[styles.versionText, { color: colors.textTertiary }]}>
          {SMANV_BRAND.version}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.lg,
  },
  centerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animatedContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emblemShadow: {
    borderRadius: 28,
    marginBottom: 20,
  },
  emblem: {
    width: 104,
    height: 104,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  aiSparkle: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  brandTitle: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  developerBox: {
    alignItems: 'center',
    marginTop: 12,
  },
  developedByLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  companyName: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 2,
    letterSpacing: 0.2,
  },
  tagline: {
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 12,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 20,
  },
  bottomSection: {
    alignItems: 'center',
    paddingBottom: Layout.spacing.xl,
    gap: 8,
  },
  spinner: {
    marginBottom: 8,
  },
  skipButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  skipText: {
    fontSize: Layout.fontSize.bodyMedium,
    fontWeight: '600',
  },
  versionText: {
    fontSize: Layout.fontSize.caption,
    marginTop: 4,
  },
});
