/**
 * SMANV EduERP Multi-Step Organization Registration
 * Developed by SMANV Info Tech Private Limited
 */

import React, { useState } from 'react';
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
import { useAuth } from '@/store/AuthContext';
import { useTheme } from '@/store/ThemeContext';
import { SMButton } from '@/components/SMButton';
import { SMInput } from '@/components/SMInput';
import { SMCard } from '@/components/SMCard';
import { SMANVLogo } from '@/components/SMANVLogo';
import { Layout } from '@/constants/Layout';

export default function RegisterOrgScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { registerOrganization, isLoading, authError, clearError } = useAuth();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Org Details
  const [orgName, setOrgName] = useState('');
  const [orgType, setOrgType] = useState<'school' | 'college'>('school');
  const [orgEmail, setOrgEmail] = useState('');
  const [orgPhone, setOrgPhone] = useState('');
  const [orgAddress, setOrgAddress] = useState('');
  const [orgCity, setOrgCity] = useState('');
  const [orgState, setOrgState] = useState('');
  const [orgPincode, setOrgPincode] = useState('');

  // Step 2: Admin Details
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminMobile, setAdminMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Validation Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep1 = () => {
    const err: Record<string, string> = {};
    if (!orgName.trim()) err.orgName = 'Organization name is required';
    if (!orgEmail.trim()) err.orgEmail = 'Official email is required';
    if (!orgPhone.trim()) err.orgPhone = 'Phone number is required';
    if (!orgAddress.trim()) err.orgAddress = 'Campus address is required';
    if (!orgCity.trim()) err.orgCity = 'City is required';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const validateStep2 = () => {
    const err: Record<string, string> = {};
    if (!adminName.trim()) err.adminName = 'Administrator full name is required';
    if (!adminEmail.trim()) err.adminEmail = 'Administrator email is required';
    if (!adminMobile.trim()) err.adminMobile = 'Mobile number is required';
    if (!password || password.length < 6) err.password = 'Password must be at least 6 characters';
    if (password !== confirmPassword) err.confirmPassword = 'Passwords do not match';
    if (!acceptTerms) err.acceptTerms = 'You must accept the terms & conditions';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      clearError();
      setStep(3); // Review step
    }
  };

  const handleSubmit = async () => {
    clearError();
    const success = await registerOrganization(
      {
        name: orgName,
        type: orgType,
        email: orgEmail,
        phone: orgPhone,
        address: orgAddress,
        city: orgCity,
        state: orgState,
        pincode: orgPincode,
      },
      {
        name: adminName,
        email: adminEmail,
        phone: adminMobile,
        password: password,
      }
    );

    if (success) {
      setStep(4); // Success step
    }
  };

  const renderStepIndicator = () => {
    const steps = ['Organization', 'Admin Details', 'Review', 'Complete'];
    return (
      <View style={styles.stepIndicatorContainer}>
        {steps.map((label, idx) => {
          const stepNum = idx + 1;
          const isActive = step === stepNum;
          const isCompleted = step > stepNum;

          return (
            <React.Fragment key={label}>
              <View style={styles.stepItem}>
                <View
                  style={[
                    styles.stepBadge,
                    {
                      backgroundColor: isCompleted
                        ? colors.success
                        : isActive
                          ? colors.primary
                          : colors.surfaceVariant,
                      borderColor: isActive ? colors.primary : colors.border,
                    },
                  ]}
                >
                  {isCompleted ? (
                    <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                  ) : (
                    <Text
                      style={[
                        styles.stepBadgeText,
                        { color: isActive ? '#FFFFFF' : colors.textSecondary },
                      ]}
                    >
                      {stepNum}
                    </Text>
                  )}
                </View>
                <Text
                  style={[
                    styles.stepLabel,
                    {
                      color: isActive ? colors.primary : colors.textSecondary,
                      fontWeight: isActive ? '700' : '500',
                    },
                  ]}
                  numberOfLines={1}
                >
                  {label}
                </Text>
              </View>
              {idx < steps.length - 1 && (
                <View
                  style={[
                    styles.stepLine,
                    { backgroundColor: step > stepNum ? colors.success : colors.border },
                  ]}
                />
              )}
            </React.Fragment>
          );
        })}
      </View>
    );
  };

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
          {/* Top Bar with Back Button */}
          <View style={styles.topBar}>
            <TouchableOpacity
              onPress={() => {
                if (step > 1 && step < 4) setStep((step - 1) as any);
                else router.back();
              }}
              style={[styles.backBtn, { backgroundColor: colors.surfaceVariant }]}
            >
              <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
            </TouchableOpacity>
            <SMANVLogo variant="header" />
          </View>

          {/* Progress Indicator */}
          {renderStepIndicator()}

          {/* Step 1: Organization Details */}
          {step === 1 && (
            <SMCard elevation="sm" padding="lg" style={styles.formCard}>
              <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                Organization Information
              </Text>
              <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
                Enter the official profile of your school or college
              </Text>

              {/* Institution Type Selector */}
              <View style={styles.typeSelectorWrapper}>
                <Text style={[styles.typeLabel, { color: colors.textPrimary }]}>
                  Institution Type *
                </Text>
                <View style={styles.typeButtonsRow}>
                  <TouchableOpacity
                    onPress={() => setOrgType('school')}
                    style={[
                      styles.typeBtn,
                      {
                        backgroundColor: orgType === 'school' ? colors.primaryContainer : colors.surface,
                        borderColor: orgType === 'school' ? colors.primary : colors.border,
                      },
                    ]}
                  >
                    <Ionicons
                      name="school"
                      size={20}
                      color={orgType === 'school' ? colors.primaryDark : colors.textSecondary}
                    />
                    <Text
                      style={[
                        styles.typeBtnText,
                        { color: orgType === 'school' ? colors.primaryDark : colors.textPrimary },
                      ]}
                    >
                      K-12 School
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setOrgType('college')}
                    style={[
                      styles.typeBtn,
                      {
                        backgroundColor: orgType === 'college' ? colors.primaryContainer : colors.surface,
                        borderColor: orgType === 'college' ? colors.primary : colors.border,
                      },
                    ]}
                  >
                    <Ionicons
                      name="business"
                      size={20}
                      color={orgType === 'college' ? colors.primaryDark : colors.textSecondary}
                    />
                    <Text
                      style={[
                        styles.typeBtnText,
                        { color: orgType === 'college' ? colors.primaryDark : colors.textPrimary },
                      ]}
                    >
                      College / University
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <SMInput
                label="Institution Name"
                placeholder="e.g. SMANV Academy of Science"
                value={orgName}
                onChangeText={setOrgName}
                error={errors.orgName}
                required
              />

              <SMInput
                label="Official Email Address"
                placeholder="e.g. contact@institution.edu"
                value={orgEmail}
                onChangeText={setOrgEmail}
                keyboardType="email-address"
                error={errors.orgEmail}
                required
              />

              <SMInput
                label="Official Phone Number"
                placeholder="e.g. +91 11 4567 8900"
                value={orgPhone}
                onChangeText={setOrgPhone}
                keyboardType="phone-pad"
                error={errors.orgPhone}
                required
              />

              <SMInput
                label="Campus Address"
                placeholder="Street Address, Campus Wing"
                value={orgAddress}
                onChangeText={setOrgAddress}
              />

              <View style={styles.twoColRow}>
                <SMInput
                  label="City"
                  placeholder="e.g. New Delhi"
                  value={orgCity}
                  onChangeText={setOrgCity}
                  error={errors.orgCity}
                  containerStyle={{ flex: 1 }}
                  required
                />
                <SMInput
                  label="State"
                  placeholder="e.g. Delhi"
                  value={orgState}
                  onChangeText={setOrgState}
                  containerStyle={{ flex: 1 }}
                />
              </View>

              <SMInput
                label="Pincode / Postal Code"
                placeholder="e.g. 110075"
                value={orgPincode}
                onChangeText={setOrgPincode}
                keyboardType="numeric"
              />

              <SMButton
                title="Next: Administrator Details →"
                onPress={handleNext}
                variant="primary"
                size="lg"
                fullWidth
                style={styles.nextBtn}
              />
            </SMCard>
          )}

          {/* Step 2: Administrator Details */}
          {step === 2 && (
            <SMCard elevation="sm" padding="lg" style={styles.formCard}>
              <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                Administrator Account
              </Text>
              <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
                This user will hold Super-Admin / Master permissions for your institution
              </Text>

              <SMInput
                label="Administrator Full Name"
                placeholder="e.g. Dr. sam k kolli"
                value={adminName}
                onChangeText={setAdminName}
                error={errors.adminName}
                required
              />

              <SMInput
                label="Admin Email Address"
                placeholder="e.g. principal@institution.edu"
                value={adminEmail}
                onChangeText={setAdminEmail}
                keyboardType="email-address"
                error={errors.adminEmail}
                required
              />

              <SMInput
                label="Mobile Number"
                placeholder="e.g. +91 98222 11222"
                value={adminMobile}
                onChangeText={setAdminMobile}
                keyboardType="phone-pad"
                error={errors.adminMobile}
                required
              />

              <SMInput
                label="Master Password"
                placeholder="Choose a strong password"
                value={password}
                onChangeText={setPassword}
                isPassword
                error={errors.password}
                required
              />

              <SMInput
                label="Confirm Password"
                placeholder="Re-enter master password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                isPassword
                error={errors.confirmPassword}
                required
              />

              {/* Accept Terms Checkbox */}
              <TouchableOpacity
                onPress={() => setAcceptTerms(!acceptTerms)}
                style={styles.termsRow}
              >
                <View
                  style={[
                    styles.checkbox,
                    {
                      borderColor: acceptTerms ? colors.primary : colors.border,
                      backgroundColor: acceptTerms ? colors.primary : 'transparent',
                    },
                  ]}
                >
                  {acceptTerms && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
                </View>
                <Text style={[styles.termsText, { color: colors.textSecondary }]}>
                  I agree to the Institutional Service Agreement & Data Privacy Policy of SMANV Info Tech Private Limited.
                </Text>
              </TouchableOpacity>
              {errors.acceptTerms && (
                <Text style={[styles.errorText, { color: colors.error }]}>
                  {errors.acceptTerms}
                </Text>
              )}

              <View style={styles.actionBtnRow}>
                <SMButton
                  title="← Back"
                  onPress={() => setStep(1)}
                  variant="outline"
                  size="lg"
                  style={{ flex: 1 }}
                />
                <SMButton
                  title="Review & Confirm →"
                  onPress={handleNext}
                  variant="primary"
                  size="lg"
                  style={{ flex: 2 }}
                />
              </View>
            </SMCard>
          )}

          {/* Step 3: Review & Summary */}
          {step === 3 && (
            <SMCard elevation="sm" padding="lg" style={styles.formCard}>
              <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                Review Registration
              </Text>
              <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
                Please confirm the institutional details before provisioning
              </Text>

              <View style={[styles.reviewBox, { backgroundColor: colors.surfaceVariant }]}>
                <Text style={[styles.reviewHeader, { color: colors.primary }]}>
                  🏢 Institution Summary
                </Text>
                <Text style={[styles.reviewItem, { color: colors.textPrimary }]}>
                  <Text style={{ fontWeight: '700' }}>Name: </Text>
                  {orgName} ({orgType.toUpperCase()})
                </Text>
                <Text style={[styles.reviewItem, { color: colors.textPrimary }]}>
                  <Text style={{ fontWeight: '700' }}>Contact: </Text>
                  {orgEmail} | {orgPhone}
                </Text>
                <Text style={[styles.reviewItem, { color: colors.textPrimary }]}>
                  <Text style={{ fontWeight: '700' }}>Location: </Text>
                  {orgCity}, {orgState} {orgPincode}
                </Text>
              </View>

              <View style={[styles.reviewBox, { backgroundColor: colors.surfaceVariant, marginTop: 12 }]}>
                <Text style={[styles.reviewHeader, { color: colors.primary }]}>
                  👤 Master Administrator
                </Text>
                <Text style={[styles.reviewItem, { color: colors.textPrimary }]}>
                  <Text style={{ fontWeight: '700' }}>Full Name: </Text>
                  {adminName}
                </Text>
                <Text style={[styles.reviewItem, { color: colors.textPrimary }]}>
                  <Text style={{ fontWeight: '700' }}>Email: </Text>
                  {adminEmail}
                </Text>
                <Text style={[styles.reviewItem, { color: colors.textPrimary }]}>
                  <Text style={{ fontWeight: '700' }}>Mobile: </Text>
                  {adminMobile}
                </Text>
              </View>

              {authError ? (
                <View style={[styles.errorBanner, { backgroundColor: colors.errorContainer }]}>
                  <Ionicons name="alert-circle" size={18} color={colors.error} />
                  <Text style={[styles.errorBannerText, { color: colors.error }]}>
                    {authError}
                  </Text>
                </View>
              ) : null}

              <View style={styles.actionBtnRow}>
                <SMButton
                  title="← Edit"
                  onPress={() => setStep(2)}
                  variant="outline"
                  size="lg"
                  style={{ flex: 1 }}
                />
                <SMButton
                  title="Create Organization"
                  onPress={handleSubmit}
                  variant="primary"
                  size="lg"
                  loading={isLoading}
                  style={{ flex: 2 }}
                />
              </View>
            </SMCard>
          )}

          {/* Step 4: Success & Transition */}
          {step === 4 && (
            <SMCard elevation="md" padding="xl" style={[styles.formCard, styles.successCard]}>
              <View style={[styles.successIconBubble, { backgroundColor: colors.successContainer }]}>
                <Ionicons name="checkmark-circle" size={60} color={colors.success} />
              </View>

              <Text style={[styles.successTitle, { color: colors.textPrimary }]}>
                Organization Registered!
              </Text>

              <Text style={[styles.successMessage, { color: colors.textSecondary }]}>
                Welcome to **SMANV EduERP**. Your institution `{orgName}` has been successfully configured with AI Copilot automation.
              </Text>

              <SMButton
                title="Open Administrative Dashboard →"
                onPress={() => router.replace('/(tabs)')}
                variant="primary"
                size="lg"
                fullWidth
                style={{ marginTop: 24 }}
              />
            </SMCard>
          )}

          {/* Already have an account prompt */}
          {step < 4 && (
            <View style={styles.loginPrompt}>
              <Text style={[styles.loginPromptText, { color: colors.textSecondary }]}>
                Already have an account?
              </Text>
              <TouchableOpacity onPress={() => router.push('/login')}>
                <Text style={[styles.loginPromptLink, { color: colors.primary }]}>
                  Login to Portal →
                </Text>
              </TouchableOpacity>
            </View>
          )}
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
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepIndicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Layout.spacing.lg,
    paddingHorizontal: 4,
  },
  stepItem: {
    alignItems: 'center',
    gap: 4,
  },
  stepBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  stepLabel: {
    fontSize: 10,
    maxWidth: 65,
    textAlign: 'center',
  },
  stepLine: {
    flex: 1,
    height: 2,
    marginHorizontal: 4,
    marginBottom: 14,
  },
  formCard: {
    borderRadius: Layout.borderRadius.xl,
  },
  cardTitle: {
    fontSize: Layout.fontSize.headlineSmall,
    fontWeight: '700',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: Layout.fontSize.bodyMedium,
    marginBottom: Layout.spacing.lg,
  },
  typeSelectorWrapper: {
    marginBottom: Layout.spacing.md,
  },
  typeLabel: {
    fontSize: Layout.fontSize.bodyMedium,
    fontWeight: '600',
    marginBottom: 8,
  },
  typeButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  typeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: Layout.borderRadius.md,
    borderWidth: 1.5,
  },
  typeBtnText: {
    fontWeight: '600',
    fontSize: Layout.fontSize.bodyMedium,
  },
  twoColRow: {
    flexDirection: 'row',
    gap: 12,
  },
  nextBtn: {
    marginTop: Layout.spacing.md,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginVertical: Layout.spacing.md,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  termsText: {
    flex: 1,
    fontSize: Layout.fontSize.bodySmall,
    lineHeight: 18,
  },
  errorText: {
    fontSize: Layout.fontSize.caption,
    marginBottom: Layout.spacing.sm,
  },
  actionBtnRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: Layout.spacing.md,
  },
  reviewBox: {
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.md,
    gap: 6,
  },
  reviewHeader: {
    fontSize: Layout.fontSize.titleSmall,
    fontWeight: '700',
    marginBottom: 4,
  },
  reviewItem: {
    fontSize: Layout.fontSize.bodyMedium,
  },
  successCard: {
    alignItems: 'center',
    paddingVertical: Layout.spacing.xxl,
  },
  successIconBubble: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Layout.spacing.lg,
  },
  successTitle: {
    fontSize: Layout.fontSize.headlineMedium,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  successMessage: {
    fontSize: Layout.fontSize.bodyMedium,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 12,
  },
  loginPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: Layout.spacing.lg,
    paddingBottom: Layout.spacing.lg,
  },
  loginPromptText: {
    fontSize: Layout.fontSize.bodyMedium,
  },
  loginPromptLink: {
    fontSize: Layout.fontSize.bodyMedium,
    fontWeight: '700',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.md,
    marginTop: Layout.spacing.md,
    gap: 8,
  },
  errorBannerText: {
    fontSize: Layout.fontSize.bodySmall,
    fontWeight: '600',
    flex: 1,
  },
});

