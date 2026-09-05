/**
 * SMANV EduERP Login Screen
 * Developed by SMANV Info Tech Private Limited
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../store/AuthContext';
import { useTheme } from '../store/ThemeContext';
import { SMButton } from '../components/SMButton';
import { SMInput } from '../components/SMInput';
import { SMCard } from '../components/SMCard';
import { SMANVLogo } from '../components/SMANVLogo';
import { Layout } from '../constants/Layout';
import { UserRole } from '../types';

export default function LoginScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { login, isLoading, authError, clearError } = useAuth();

  const [email, setEmail] = useState('principal@smanvedu.org');
  const [password, setPassword] = useState('Admin@2026');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (authError) {
      setErrorMsg(authError);
    }
  }, [authError]);

  const handleLogin = async (selectedRole?: UserRole) => {
    setErrorMsg('');
    clearError();
    if (!email.trim() && !selectedRole) {
      setErrorMsg('Please enter your institution email address.');
      return;
    }
    const success = await login(email, password, selectedRole);
    if (success) {
      router.replace('/(tabs)');
    }
  };

  const handleQuickDemo = (role: UserRole, demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('DemoPass@2026');
    handleLogin(role);
  };

  const demoRoles: { label: string; role: UserRole; email: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { label: 'Admin', role: 'org_admin', email: 'principal@smanvedu.org', icon: 'shield-outline' },
    { label: 'Teacher', role: 'staff', email: 'priya.nair@smanvedu.org', icon: 'book-outline' },
    { label: 'Student', role: 'student', email: 'aarav.sharma@smanvedu.org', icon: 'school-outline' },
    { label: 'Parent', role: 'parent', email: 'vikram.parent@gmail.com', icon: 'people-outline' },
    { label: 'Finance', role: 'finance', email: 'accounts@smanvedu.org', icon: 'cash-outline' },
    { label: 'Super Admin', role: 'super_admin', email: 'superadmin@smanv.com', icon: 'globe-outline' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Branding */}
          <View style={styles.header}>
            <SMANVLogo variant="header" />
          </View>

          {/* Login Card */}
          <SMCard elevation="md" padding="xl" style={styles.loginCard}>
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                Institution Login
              </Text>
              <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
                Sign in to access your SMANV EduERP portal
              </Text>
            </View>

            {errorMsg ? (
              <View style={[styles.errorBanner, { backgroundColor: colors.errorContainer }]}>
                <Ionicons name="alert-circle" size={18} color={colors.error} />
                <Text style={[styles.errorBannerText, { color: colors.error }]}>
                  {errorMsg}
                </Text>
              </View>
            ) : null}

            {/* Email Input */}
            <SMInput
              label="Institution Email Address"
              placeholder="e.g. administrator@institution.edu"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon={<Ionicons name="mail-outline" size={18} color={colors.textSecondary} />}
              required
            />

            {/* Password Input */}
            <SMInput
              label="Password"
              placeholder="Enter your secure password"
              value={password}
              onChangeText={setPassword}
              isPassword
              leftIcon={<Ionicons name="lock-closed-outline" size={18} color={colors.textSecondary} />}
              required
            />

            {/* Remember Me & Forgot Password */}
            <View style={styles.optionsRow}>
              <TouchableOpacity
                onPress={() => setRememberMe(!rememberMe)}
                style={styles.checkboxRow}
              >
                <View
                  style={[
                    styles.checkbox,
                    {
                      borderColor: rememberMe ? colors.primary : colors.border,
                      backgroundColor: rememberMe ? colors.primary : 'transparent',
                    },
                  ]}
                >
                  {rememberMe && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
                </View>
                <Text style={[styles.checkboxLabel, { color: colors.textSecondary }]}>
                  Remember Me
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => router.push('/forgot-password')}>
                <Text style={[styles.forgotText, { color: colors.primary }]}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <SMButton
              title="Sign In to SMANV Portal"
              onPress={() => handleLogin()}
              variant="primary"
              size="lg"
              loading={isLoading}
              fullWidth
              style={styles.loginBtn}
            />

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
              <Text style={[styles.dividerText, { color: colors.textTertiary }]}>OR</Text>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            </View>

            {/* Quick Demo Logins Section */}
            <View style={styles.quickDemoSection}>
              <Text style={[styles.quickDemoTitle, { color: colors.textSecondary }]}>
                ⚡ One-Tap Demo Role Access:
              </Text>
              <View style={styles.demoChipsGrid}>
                {demoRoles.map((item) => (
                  <TouchableOpacity
                    key={item.role}
                    onPress={() => handleQuickDemo(item.role, item.email)}
                    style={[
                      styles.demoChip,
                      {
                        backgroundColor: colors.surfaceVariant,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <Ionicons name={item.icon} size={14} color={colors.primary} />
                    <Text style={[styles.demoChipText, { color: colors.textPrimary }]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </SMCard>

          {/* Bottom Register Option */}
          <View style={styles.registerPrompt}>
            <Text style={[styles.registerText, { color: colors.textSecondary }]}>
              New School or College?
            </Text>
            <TouchableOpacity onPress={() => router.push('/register-org')}>
              <Text style={[styles.registerLink, { color: colors.primary }]}>
                Register Organization →
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: Layout.spacing.lg,
  },
  loginCard: {
    borderRadius: Layout.borderRadius.xl,
  },
  cardHeader: {
    marginBottom: Layout.spacing.lg,
  },
  cardTitle: {
    fontSize: Layout.fontSize.headlineSmall,
    fontWeight: '700',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: Layout.fontSize.bodyMedium,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.md,
    marginBottom: Layout.spacing.md,
  },
  errorBannerText: {
    fontSize: Layout.fontSize.bodySmall,
    fontWeight: '600',
    flex: 1,
  },
  optionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Layout.spacing.lg,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxLabel: {
    fontSize: Layout.fontSize.bodyMedium,
  },
  forgotText: {
    fontSize: Layout.fontSize.bodyMedium,
    fontWeight: '600',
  },
  loginBtn: {
    height: 50,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Layout.spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: Layout.fontSize.caption,
    fontWeight: '700',
  },
  quickDemoSection: {
    gap: 8,
  },
  quickDemoTitle: {
    fontSize: Layout.fontSize.caption,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  demoChipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  demoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: Layout.borderRadius.full,
    borderWidth: 1,
  },
  demoChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  registerPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: Layout.spacing.xl,
  },
  registerText: {
    fontSize: Layout.fontSize.bodyMedium,
  },
  registerLink: {
    fontSize: Layout.fontSize.bodyMedium,
    fontWeight: '700',
  },
});
