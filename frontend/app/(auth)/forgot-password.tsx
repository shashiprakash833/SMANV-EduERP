/**
 * SMANV EduERP Forgot Password Screen
 * Developed by SMANV Info Tech Private Limited
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/store/ThemeContext';
import { SMButton } from '@/components/SMButton';
import { SMInput } from '@/components/SMInput';
import { SMCard } from '@/components/SMCard';
import { SMANVLogo } from '@/components/SMANVLogo';
import { Layout } from '@/constants/Layout';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) return;
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1, justifyContent: 'center', paddingHorizontal: Layout.spacing.lg }}
      >
        <View style={styles.header}>
          <SMANVLogo variant="header" />
        </View>

        <SMCard elevation="md" padding="xl" style={styles.card}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backLink}
          >
            <Ionicons name="arrow-back" size={16} color={colors.primary} />
            <Text style={[styles.backLinkText, { color: colors.primary }]}>Back to Login</Text>
          </TouchableOpacity>

          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Reset Account Password
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Enter your institution email address and we will dispatch a secure password reset link.
          </Text>

          {submitted ? (
            <View style={[styles.successBox, { backgroundColor: colors.successContainer }]}>
              <Ionicons name="mail-open-outline" size={32} color={colors.success} />
              <Text style={[styles.successTitle, { color: colors.success }]}>
                Check Your Inbox
              </Text>
              <Text style={[styles.successDesc, { color: colors.textSecondary }]}>
                A password reset authorization token has been sent to <Text style={{ fontWeight: '700' }}>{email}</Text>.
              </Text>

              <SMButton
                title="Return to Sign In"
                onPress={() => router.replace('/login')}
                variant="primary"
                size="md"
                fullWidth
                style={{ marginTop: 16 }}
              />
            </View>
          ) : (
            <>
              <SMInput
                label="Institution Email Address"
                placeholder="e.g. principal@institution.edu"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                leftIcon={<Ionicons name="mail-outline" size={18} color={colors.textSecondary} />}
                required
              />

              <SMButton
                title="Send Password Reset Link"
                onPress={handleSubmit}
                variant="primary"
                size="lg"
                loading={loading}
                fullWidth
              />
            </>
          )}
        </SMCard>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: Layout.spacing.xl,
  },
  card: {
    borderRadius: Layout.borderRadius.xl,
  },
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Layout.spacing.md,
  },
  backLinkText: {
    fontSize: Layout.fontSize.bodySmall,
    fontWeight: '600',
  },
  title: {
    fontSize: Layout.fontSize.headlineSmall,
    fontWeight: '700',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: Layout.fontSize.bodyMedium,
    marginBottom: Layout.spacing.lg,
    lineHeight: 20,
  },
  successBox: {
    alignItems: 'center',
    padding: Layout.spacing.lg,
    borderRadius: Layout.borderRadius.lg,
    gap: 8,
  },
  successTitle: {
    fontSize: Layout.fontSize.titleMedium,
    fontWeight: '700',
  },
  successDesc: {
    fontSize: Layout.fontSize.bodySmall,
    textAlign: 'center',
    lineHeight: 18,
  },
});
