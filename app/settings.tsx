/**
 * SMANV EduERP Institutional Settings & Security
 * Developed by SMANV Info Tech Private Limited
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../store/ThemeContext';
import { useAuth } from '../store/AuthContext';
import { SMHeader } from '../components/SMHeader';
import { SMCard } from '../components/SMCard';
import { SMDialog } from '../components/SMDialog';
import { SMANV_BRAND } from '../constants/Colors';
import { Layout } from '../constants/Layout';

export default function SettingsScreen() {
  const router = useRouter();
  const { colors, isDarkMode, toggleTheme } = useTheme();
  const { organization } = useAuth();

  // Toggles
  const [pushNotifs, setPushNotifs] = useState(true);
  const [feeReminders, setFeeReminders] = useState(true);
  const [biometricAuth, setBiometricAuth] = useState(false);
  const [offlineSync, setOfflineSync] = useState(true);
  const [showYearModal, setShowYearModal] = useState(false);
  const [selectedYear, setSelectedYear] = useState('2026-2027');

  const years = ['2026-2027 (Active)', '2025-2026 (Archived)', '2024-2025 (Archived)'];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <SMHeader
        title="Settings & System"
        subtitle="Global Configurations & Security"
        showBack
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Academic Session */}
        <SMCard elevation="sm" padding="none" style={styles.card}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>ACADEMIC SESSION</Text>
          <TouchableOpacity
            onPress={() => setShowYearModal(true)}
            style={styles.settingRow}
          >
            <View style={{ flex: 1 }}>
              <Text style={[styles.rowTitle, { color: colors.textPrimary }]}>Current Academic Year</Text>
              <Text style={[styles.rowSub, { color: colors.textSecondary }]}>{selectedYear}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
          </TouchableOpacity>
        </SMCard>

        {/* Notifications & AI Alerts */}
        <SMCard elevation="sm" padding="none" style={styles.card}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>NOTIFICATIONS & ALERTS</Text>

          <View style={[styles.settingRow, { borderBottomWidth: 1, borderBottomColor: colors.borderLight }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.rowTitle, { color: colors.textPrimary }]}>Push Notifications</Text>
              <Text style={[styles.rowSub, { color: colors.textSecondary }]}>Campus announcements and schedule updates</Text>
            </View>
            <Switch
              value={pushNotifs}
              onValueChange={setPushNotifs}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.rowTitle, { color: colors.textPrimary }]}>Automated Fee SMS & WhatsApp</Text>
              <Text style={[styles.rowSub, { color: colors.textSecondary }]}>Send AI payment alerts to guardians</Text>
            </View>
            <Switch
              value={feeReminders}
              onValueChange={setFeeReminders}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </SMCard>

        {/* Appearance & Theme */}
        <SMCard elevation="sm" padding="none" style={styles.card}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>APPEARANCE</Text>
          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.rowTitle, { color: colors.textPrimary }]}>Dark Mode</Text>
              <Text style={[styles.rowSub, { color: colors.textSecondary }]}>Material Design 3 dark appearance</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </SMCard>

        {/* Security & Offline Cache */}
        <SMCard elevation="sm" padding="none" style={styles.card}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>SECURITY & OFFLINE</Text>

          <View style={[styles.settingRow, { borderBottomWidth: 1, borderBottomColor: colors.borderLight }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.rowTitle, { color: colors.textPrimary }]}>Biometric Fingerprint / Face ID</Text>
              <Text style={[styles.rowSub, { color: colors.textSecondary }]}>Require biometric validation on launch</Text>
            </View>
            <Switch
              value={biometricAuth}
              onValueChange={setBiometricAuth}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.rowTitle, { color: colors.textPrimary }]}>Background Offline Auto-Sync</Text>
              <Text style={[styles.rowSub, { color: colors.textSecondary }]}>Sync attendance marks when network resumes</Text>
            </View>
            <Switch
              value={offlineSync}
              onValueChange={setOfflineSync}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </SMCard>

        {/* Links */}
        <SMCard elevation="sm" padding="none" style={styles.card}>
          <TouchableOpacity
            onPress={() => router.push('/help')}
            style={[styles.settingRow, { borderBottomWidth: 1, borderBottomColor: colors.borderLight }]}
          >
            <Text style={[styles.rowTitle, { color: colors.textPrimary }]}>Help & Documentation</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/about')}
            style={styles.settingRow}
          >
            <Text style={[styles.rowTitle, { color: colors.textPrimary }]}>About SMANV Info Tech</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
          </TouchableOpacity>
        </SMCard>

        <View style={{ height: 60 }} />
      </ScrollView>

      {/* Academic Year Selection Dialog */}
      <SMDialog
        visible={showYearModal}
        title="Select Academic Year"
        confirmText="Confirm"
        cancelText="Cancel"
        onConfirm={() => setShowYearModal(false)}
        onCancel={() => setShowYearModal(false)}
      >
        <View style={{ gap: 8 }}>
          {years.map((y) => (
            <TouchableOpacity
              key={y}
              onPress={() => setSelectedYear(y.split(' ')[0])}
              style={[
                styles.yearOption,
                {
                  backgroundColor: selectedYear === y.split(' ')[0] ? colors.primaryContainer : colors.surface,
                  borderColor: selectedYear === y.split(' ')[0] ? colors.primary : colors.border,
                },
              ]}
            >
              <Text style={[styles.yearOptionText, { color: colors.textPrimary }]}>{y}</Text>
              {selectedYear === y.split(' ')[0] && (
                <Ionicons name="checkmark" size={18} color={colors.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </SMDialog>
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
  card: {
    borderRadius: Layout.borderRadius.xl,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 4,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  rowSub: {
    fontSize: 11,
    marginTop: 2,
  },
  yearOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: Layout.borderRadius.md,
    borderWidth: 1,
  },
  yearOptionText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
