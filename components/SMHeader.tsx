/**
 * SMANV EduERP SMHeader Component
 * App bar following Material Design 3 and SMANV branding
 * Developed by SMANV Info Tech Private Limited
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../store/ThemeContext';
import { useNotifications } from '../store/NotificationContext';
import { useAuth } from '../store/AuthContext';
import { SMAvatar } from './SMAvatar';
import { SMBadge } from './SMBadge';
import { Layout } from '../constants/Layout';

interface SMHeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBackPress?: () => void;
  showOrgBadge?: boolean;
  showNotificationIcon?: boolean;
  showAvatar?: boolean;
  rightAction?: React.ReactNode;
  style?: ViewStyle;
}

export const SMHeader: React.FC<SMHeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  onBackPress,
  showOrgBadge = false,
  showNotificationIcon = true,
  showAvatar = true,
  rightAction,
  style,
}) => {
  const router = useRouter();
  const { colors } = useTheme();
  const { unreadCount } = useNotifications();
  const { user, organization, role } = useAuth();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  const getRoleLabel = () => {
    switch (role) {
      case 'super_admin':
        return 'Super Admin';
      case 'org_admin':
        return 'Org Admin';
      case 'staff':
        return 'Faculty';
      case 'student':
        return 'Student';
      case 'parent':
        return 'Parent';
      case 'finance':
        return 'Finance & HR';
      default:
        return 'Admin';
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          borderBottomColor: colors.borderLight,
        },
        style,
      ]}
    >
      <View style={styles.leftSection}>
        {showBack ? (
          <TouchableOpacity
            onPress={handleBack}
            style={[styles.backBtn, { backgroundColor: colors.surfaceVariant }]}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
          </TouchableOpacity>
        ) : null}

        <View style={styles.titleArea}>
          {showOrgBadge && (
            <View style={styles.orgRow}>
              <View style={[styles.brandLogoDot, { backgroundColor: colors.primary }]}>
                <Ionicons name="school" size={12} color="#FFFFFF" />
              </View>
              <Text
                style={[styles.orgName, { color: colors.textSecondary }]}
                numberOfLines={1}
              >
                {organization.name}
              </Text>
              <SMBadge label={getRoleLabel()} variant="primary" size="sm" />
            </View>
          )}

          {title && (
            <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={1}>
              {title}
            </Text>
          )}

          {subtitle && (
            <Text style={[styles.subtitle, { color: colors.textSecondary }]} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.rightSection}>
        {rightAction}

        {showNotificationIcon && (
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/notifications')}
            style={[styles.iconButton, { backgroundColor: colors.surfaceVariant }]}
          >
            <Ionicons name="notifications-outline" size={20} color={colors.textPrimary} />
            {unreadCount > 0 && (
              <View style={[styles.badge, { backgroundColor: colors.error }]}>
                <Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        )}

        {showAvatar && user && (
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/profile')}
            style={styles.avatarButton}
          >
            <SMAvatar name={user.name} size="sm" status="online" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    borderBottomWidth: 1,
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  titleArea: {
    flex: 1,
  },
  orgRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  brandLogoDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orgName: {
    fontSize: 11,
    fontWeight: '600',
    maxWidth: 150,
  },
  title: {
    fontSize: Layout.fontSize.titleMedium,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: Layout.fontSize.caption,
    marginTop: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  avatarButton: {
    marginLeft: 2,
  },
});
