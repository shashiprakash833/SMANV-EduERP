/**
 * SMANV EduERP Welcome Screen
 * Developed by SMANV Info Tech Private Limited
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../store/ThemeContext';
import { SMButton } from '../components/SMButton';
import { SMCard } from '../components/SMCard';
import { SMDialog } from '../components/SMDialog';
import { SMANV_BRAND } from '../constants/Colors';
import { Layout } from '../constants/Layout';

export default function WelcomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [showLegalModal, setShowLegalModal] = useState<'terms' | 'privacy' | null>(null);

  const features = [
    { icon: 'sparkles-outline', title: 'AI Automation', desc: 'Predictive attendance & smart fee insights' },
    { icon: 'shield-checkmark-outline', title: 'Enterprise Security', desc: 'Role-based access & encrypted records' },
    { icon: 'speedometer-outline', title: 'Real-time Metrics', desc: 'Live operational dashboards for leadership' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Brand Bar */}
        <View style={styles.topBar}>
          <View style={styles.logoBadge}>
            <LinearGradient
              colors={[colors.primary, colors.secondary]}
              style={styles.logoCircle}
            >
              <Ionicons name="school" size={20} color="#FFFFFF" />
            </LinearGradient>
            <Text style={[styles.topBrandName, { color: colors.textPrimary }]}>
              SMANV <Text style={{ color: colors.primary }}>EduERP</Text>
            </Text>
          </View>
        </View>

        {/* Hero Graphic Card */}
        <View style={styles.heroWrapper}>
          <LinearGradient
            colors={[colors.primaryContainer, colors.surface]}
            style={[styles.heroCard, { borderColor: colors.border }]}
          >
            <View style={[styles.heroIconBubble, { backgroundColor: colors.primary }]}>
              <Ionicons name="business" size={44} color="#FFFFFF" />
            </View>

            <View style={styles.badgeRow}>
              <View style={[styles.pill, { backgroundColor: colors.aiContainer, borderColor: colors.aiBorder }]}>
                <Ionicons name="sparkles" size={14} color={colors.accent} />
                <Text style={[styles.pillText, { color: colors.primaryDark }]}>AI Powered ERP</Text>
              </View>
              <View style={[styles.pill, { backgroundColor: colors.surfaceVariant, borderColor: colors.border }]}>
                <Text style={[styles.pillText, { color: colors.textSecondary }]}>Cloud SaaS</Text>
              </View>
            </View>

            <Text style={[styles.heading, { color: colors.textPrimary }]}>
              Welcome to <Text style={{ color: colors.primary }}>SMANV EduERP</Text>
            </Text>

            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Manage your School or College digitally using one intelligent ERP platform powered by AI.
            </Text>
          </LinearGradient>
        </View>

        {/* Value Proposition Highlights */}
        <View style={styles.featuresSection}>
          {features.map((feat, idx) => (
            <SMCard
              key={`feat-${idx}`}
              elevation="none"
              padding="sm"
              style={[styles.featCard, { backgroundColor: colors.surfaceVariant }]}
            >
              <View style={[styles.featIcon, { backgroundColor: colors.background }]}>
                <Ionicons name={feat.icon as any} size={20} color={colors.primary} />
              </View>
              <View style={styles.featTextCol}>
                <Text style={[styles.featTitle, { color: colors.textPrimary }]}>{feat.title}</Text>
                <Text style={[styles.featDesc, { color: colors.textSecondary }]}>{feat.desc}</Text>
              </View>
            </SMCard>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonSection}>
          <SMButton
            title="Register School / College"
            onPress={() => router.push('/register-org')}
            variant="primary"
            size="lg"
            fullWidth
            icon={<Ionicons name="add-circle-outline" size={20} color="#FFFFFF" />}
            style={styles.primaryBtn}
          />

          <SMButton
            title="Already have an Account? Login"
            onPress={() => router.push('/login')}
            variant="outline"
            size="lg"
            fullWidth
            style={styles.outlineBtn}
          />
        </View>

        {/* Footer Legal & Company Information */}
        <View style={styles.footerSection}>
          <View style={styles.legalRow}>
            <TouchableOpacity onPress={() => setShowLegalModal('privacy')}>
              <Text style={[styles.legalLink, { color: colors.primary }]}>Privacy Policy</Text>
            </TouchableOpacity>
            <Text style={{ color: colors.textTertiary }}>•</Text>
            <TouchableOpacity onPress={() => setShowLegalModal('terms')}>
              <Text style={[styles.legalLink, { color: colors.primary }]}>Terms & Conditions</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.copyright, { color: colors.textTertiary }]}>
            © 2026 {SMANV_BRAND.company}. All rights reserved.
          </Text>
        </View>
      </ScrollView>

      {/* Legal Dialog Modal */}
      <SMDialog
        visible={showLegalModal !== null}
        title={showLegalModal === 'terms' ? 'Terms & Conditions' : 'Privacy Policy'}
        message={
          showLegalModal === 'terms'
            ? 'SMANV EduERP is a commercial enterprise SaaS product by SMANV Info Tech Private Limited. All educational institution data is governed under institutional SLA and strict data residency compliance.'
            : 'We respect the privacy of schools, colleges, educators, and students. SMANV EduERP enforces 256-bit encryption for all records, grade sheets, and biometric attendance registries.'
        }
        confirmText="Understood"
        onConfirm={() => setShowLegalModal(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  logoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoCircle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBrandName: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  heroWrapper: {
    marginVertical: Layout.spacing.xs,
  },
  heroCard: {
    borderRadius: Layout.borderRadius.xl,
    borderWidth: 1,
    padding: Layout.spacing.xl,
    alignItems: 'center',
  },
  heroIconBubble: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Layout.spacing.md,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: Layout.spacing.md,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: Layout.borderRadius.full,
    borderWidth: 1,
  },
  pillText: {
    fontSize: 11,
    fontWeight: '600',
  },
  heading: {
    fontSize: Layout.fontSize.headlineLarge,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: Layout.fontSize.bodyMedium,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 12,
  },
  featuresSection: {
    gap: 10,
    marginVertical: Layout.spacing.md,
  },
  featCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.lg,
  },
  featIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  featTextCol: {
    flex: 1,
  },
  featTitle: {
    fontSize: Layout.fontSize.titleSmall,
    fontWeight: '700',
    marginBottom: 2,
  },
  featDesc: {
    fontSize: Layout.fontSize.caption,
    lineHeight: 16,
  },
  buttonSection: {
    gap: 12,
    marginTop: Layout.spacing.sm,
    marginBottom: Layout.spacing.md,
  },
  primaryBtn: {
    height: 52,
  },
  outlineBtn: {
    height: 52,
  },
  footerSection: {
    alignItems: 'center',
    paddingVertical: Layout.spacing.sm,
    gap: 6,
  },
  legalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  legalLink: {
    fontSize: Layout.fontSize.bodySmall,
    fontWeight: '600',
  },
  copyright: {
    fontSize: Layout.fontSize.caption,
    textAlign: 'center',
  },
});
