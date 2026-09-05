/**
 * SMANV EduERP Profile & Account Management
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
import { useAuth } from '../../store/AuthContext';
import { useTheme } from '../../store/ThemeContext';
import { SMHeader } from '../../components/SMHeader';
import { SMCard } from '../../components/SMCard';
import { SMAvatar } from '../../components/SMAvatar';
import { SMBadge } from '../../components/SMBadge';
import { SMButton } from '../../components/SMButton';
import { SMDialog } from '../../components/SMDialog';
import { SMInput } from '../../components/SMInput';
import { SMANV_BRAND } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, organization, role, logout, updateUserProfile } = useAuth();
  const { colors, isDarkMode, toggleTheme } = useTheme();

  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Edit fields
  const [editName, setEditName] = useState(user?.name || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');

  const handleSaveProfile = () => {
    updateUserProfile({ name: editName, phone: editPhone });
    setShowEditModal(false);
  };

  const handleLogout = async () => {
    setShowLogoutDialog(false);
    await logout();
    router.replace('/welcome');
  };

  const profileMenuItems = [
    {
      title: 'Edit Profile Information',
      subtitle: 'Name, phone, designation',
      icon: 'person-outline',
      onPress: () => setShowEditModal(true),
    },
    {
      title: 'Settings & Configurations',
      subtitle: 'Academic year, campus preferences',
      icon: 'settings-outline',
      onPress: () => router.push('/settings'),
    },
    {
      title: 'Security & Two-Factor Auth',
      subtitle: 'Biometrics, password, active sessions',
      icon: 'shield-checkmark-outline',
      onPress: () => router.push('/settings'),
    },
    {
      title: 'Help & Support Center',
      subtitle: 'FAQs, ticket system, ERP manuals',
      icon: 'help-circle-outline',
      onPress: () => router.push('/help'),
    },
    {
      title: 'About SMANV EduERP',
      subtitle: 'Version 1.0.0, license & company',
      icon: 'information-circle-outline',
      onPress: () => router.push('/about'),
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <SMHeader title="Institution Profile" subtitle="Account & Campus Identity" showBack={false} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* User Card */}
        <SMCard elevation="md" padding="lg" style={styles.userCard}>
          <View style={styles.userRow}>
            <SMAvatar name={user?.name || 'Administrator'} size="lg" status="online" />
            <View style={styles.userInfoCol}>
              <Text style={[styles.userName, { color: colors.textPrimary }]}>
                {user?.name}
              </Text>
              <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
                {user?.email}
              </Text>
              <View style={styles.badgeRow}>
                <SMBadge label={user?.role?.toUpperCase() || 'ADMIN'} variant="primary" size="sm" />
                <SMBadge label="Active" variant="success" size="sm" dot />
              </View>
            </View>
          </View>
        </SMCard>

        {/* Organization Information Card */}
        <SMCard elevation="sm" padding="md" style={styles.orgCard}>
          <View style={styles.orgHeader}>
            <View style={[styles.orgIconBubble, { backgroundColor: colors.primaryContainer }]}>
              <Ionicons name="business" size={20} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.orgName, { color: colors.textPrimary }]}>
                {organization.name}
              </Text>
              <Text style={[styles.orgCode, { color: colors.textSecondary }]}>
                Code: {organization.code} • Academic Year: {organization.academicYear}
              </Text>
            </View>
          </View>

          <View style={[styles.orgStatsGrid, { backgroundColor: colors.surfaceVariant }]}>
            <View style={styles.orgStatItem}>
              <Text style={[styles.orgStatVal, { color: colors.primary }]}>{organization.studentCount}</Text>
              <Text style={[styles.orgStatLabel, { color: colors.textSecondary }]}>Students</Text>
            </View>
            <View style={styles.orgStatItem}>
              <Text style={[styles.orgStatVal, { color: colors.primary }]}>{organization.staffCount}</Text>
              <Text style={[styles.orgStatLabel, { color: colors.textSecondary }]}>Faculty</Text>
            </View>
            <View style={styles.orgStatItem}>
              <Text style={[styles.orgStatVal, { color: colors.primary }]}>CBSE / State</Text>
              <Text style={[styles.orgStatLabel, { color: colors.textSecondary }]}>Affiliation</Text>
            </View>
          </View>
        </SMCard>

        {/* Theme Settings Toggle */}
        <SMCard elevation="sm" padding="md" style={styles.menuCard}>
          <View style={styles.toggleRow}>
            <View style={styles.toggleIconCol}>
              <Ionicons
                name={isDarkMode ? 'moon' : 'sunny'}
                size={22}
                color={isDarkMode ? colors.secondary : colors.warning}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.menuTitle, { color: colors.textPrimary }]}>
                Dark Appearance Mode
              </Text>
              <Text style={[styles.menuSubtitle, { color: colors.textSecondary }]}>
                Toggle high-contrast enterprise dark theme
              </Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </SMCard>

        {/* Menu Items List */}
        <SMCard elevation="sm" padding="none" style={styles.menuCard}>
          {profileMenuItems.map((item, idx) => (
            <TouchableOpacity
              key={item.title}
              onPress={item.onPress}
              activeOpacity={0.7}
              style={[
                styles.menuItem,
                idx < profileMenuItems.length - 1 && { borderBottomColor: colors.borderLight, borderBottomWidth: 1 },
              ]}
            >
              <View style={[styles.menuIconCircle, { backgroundColor: colors.surfaceVariant }]}>
                <Ionicons name={item.icon as any} size={20} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.menuTitle, { color: colors.textPrimary }]}>
                  {item.title}
                </Text>
                <Text style={[styles.menuSubtitle, { color: colors.textSecondary }]}>
                  {item.subtitle}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
            </TouchableOpacity>
          ))}
        </SMCard>

        {/* Logout Button */}
        <SMButton
          title="Sign Out from SMANV EduERP"
          onPress={() => setShowLogoutDialog(true)}
          variant="danger"
          size="lg"
          fullWidth
          icon={<Ionicons name="log-out-outline" size={20} color="#FFFFFF" />}
          style={{ marginTop: 16 }}
        />

        {/* Company Byline */}
        <View style={styles.companyFooter}>
          <Text style={[styles.companyText, { color: colors.textSecondary }]}>
            Developed by <Text style={{ fontWeight: '700', color: colors.primary }}>{SMANV_BRAND.company}</Text>
          </Text>
          <Text style={[styles.versionText, { color: colors.textTertiary }]}>
            SMANV EduERP • {SMANV_BRAND.version}
          </Text>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Edit Profile Dialog */}
      <SMDialog
        visible={showEditModal}
        title="Edit Administrator Profile"
        confirmText="Save Changes"
        cancelText="Cancel"
        onConfirm={handleSaveProfile}
        onCancel={() => setShowEditModal(false)}
      >
        <SMInput
          label="Full Name"
          value={editName}
          onChangeText={setEditName}
          placeholder="Your full name"
        />
        <SMInput
          label="Phone Number"
          value={editPhone}
          onChangeText={setEditPhone}
          placeholder="+91 Mobile number"
          keyboardType="phone-pad"
        />
      </SMDialog>

      {/* Logout Confirmation Dialog */}
      <SMDialog
        visible={showLogoutDialog}
        title="Confirm Sign Out"
        message="Are you sure you wish to log out of SMANV EduERP? You will need your credentials to re-authenticate."
        confirmText="Sign Out"
        cancelText="Cancel"
        confirmVariant="danger"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutDialog(false)}
      />
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
  },
  userCard: {
    borderRadius: Layout.borderRadius.xl,
    marginBottom: Layout.spacing.sm,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfoCol: {
    flex: 1,
    marginLeft: 16,
  },
  userName: {
    fontSize: Layout.fontSize.headlineSmall,
    fontWeight: '800',
  },
  userEmail: {
    fontSize: Layout.fontSize.bodyMedium,
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  orgCard: {
    borderRadius: Layout.borderRadius.xl,
    marginBottom: Layout.spacing.sm,
  },
  orgHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  orgIconBubble: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orgName: {
    fontSize: 15,
    fontWeight: '700',
  },
  orgCode: {
    fontSize: 11,
    marginTop: 2,
  },
  orgStatsGrid: {
    flexDirection: 'row',
    borderRadius: Layout.borderRadius.md,
    padding: 12,
  },
  orgStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  orgStatVal: {
    fontSize: 15,
    fontWeight: '800',
  },
  orgStatLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  menuCard: {
    borderRadius: Layout.borderRadius.xl,
    marginBottom: Layout.spacing.sm,
    overflow: 'hidden',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Layout.spacing.md,
    gap: 12,
  },
  toggleIconCol: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Layout.spacing.md,
    gap: 14,
  },
  menuIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTitle: {
    fontSize: Layout.fontSize.bodyLarge,
    fontWeight: '600',
  },
  menuSubtitle: {
    fontSize: Layout.fontSize.caption,
    marginTop: 2,
  },
  companyFooter: {
    alignItems: 'center',
    paddingVertical: Layout.spacing.lg,
    gap: 4,
  },
  companyText: {
    fontSize: 12,
  },
  versionText: {
    fontSize: 11,
  },
});
