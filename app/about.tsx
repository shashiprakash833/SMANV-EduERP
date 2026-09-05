/**
 * SMANV EduERP About & Enterprise Identity Screen
 * Developed by SMANV Info Tech Private Limited
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../store/ThemeContext';
import { SMHeader } from '../components/SMHeader';
import { SMCard } from '../components/SMCard';
import { SMANVLogo } from '../components/SMANVLogo';
import { SMANV_BRAND } from '../constants/Colors';
import { Layout } from '../constants/Layout';

export default function AboutScreen() {
  const { colors } = useTheme();

  const specifications = [
    { label: 'Application Name', value: SMANV_BRAND.name },
    { label: 'Developer', value: SMANV_BRAND.company },
    { label: 'Platform Type', value: 'Enterprise SaaS Cloud ERP' },
    { label: 'Build Version', value: SMANV_BRAND.version },
    { label: 'UI Standard', value: 'Material Design 3 (MD3)' },
    { label: 'Architecture', value: 'Expo React Native & Django REST Framework' },
    { label: 'Security Standard', value: '256-bit AES & Encrypted SecureStore' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <SMHeader
        title="About SMANV EduERP"
        subtitle="Platform Specifications & Identity"
        showBack
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Brand Banner */}
        <View style={styles.logoWrapper}>
          <SMANVLogo variant="splash" size={80} />
        </View>

        {/* Enterprise Mission Card */}
        <SMCard elevation="sm" padding="md" style={styles.card}>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
            About the Platform
          </Text>
          <Text style={[styles.bodyText, { color: colors.textSecondary }]}>
            <Text style={{ fontWeight: '700', color: colors.primary }}>SMANV EduERP</Text> is an enterprise-grade school and college management system engineered by <Text style={{ fontWeight: '700' }}>{SMANV_BRAND.company}</Text>. Designed with inspirations from Google Workspace, Microsoft 365, Zoho One, Notion, and Freshworks, the system provides unified digital transformation for educational institutions across India and globally.
          </Text>
        </SMCard>

        {/* Technical Specifications */}
        <SMCard elevation="sm" padding="none" style={styles.card}>
          <Text style={[styles.specsHeader, { color: colors.primary }]}>
            TECHNICAL SPECIFICATIONS
          </Text>
          {specifications.map((spec, idx) => (
            <View
              key={spec.label}
              style={[
                styles.specRow,
                idx < specifications.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.borderLight },
              ]}
            >
              <Text style={[styles.specLabel, { color: colors.textSecondary }]}>
                {spec.label}
              </Text>
              <Text style={[styles.specValue, { color: colors.textPrimary }]}>
                {spec.value}
              </Text>
            </View>
          ))}
        </SMCard>

        {/* Contact & Legal Byline */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            Inquiries: {SMANV_BRAND.supportEmail} • {SMANV_BRAND.website}
          </Text>
          <Text style={[styles.copyright, { color: colors.textTertiary }]}>
            © 2026 {SMANV_BRAND.company}. All trademarks acknowledged.
          </Text>
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    gap: 12,
  },
  logoWrapper: {
    paddingVertical: Layout.spacing.md,
  },
  card: {
    borderRadius: Layout.borderRadius.xl,
    overflow: 'hidden',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
  },
  bodyText: {
    fontSize: 13,
    lineHeight: 20,
  },
  specsHeader: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 4,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  specLabel: {
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
  },
  specValue: {
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
    textAlign: 'right',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: Layout.spacing.md,
    gap: 4,
  },
  footerText: {
    fontSize: 12,
  },
  copyright: {
    fontSize: 11,
  },
});
