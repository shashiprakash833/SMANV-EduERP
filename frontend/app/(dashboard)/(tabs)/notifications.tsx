/**
 * SMANV EduERP Notifications Center
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
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/store/ThemeContext';
import { useNotifications } from '@/store/NotificationContext';
import { SMHeader } from '@/components/SMHeader';
import { SMCard } from '@/components/SMCard';
import { SMBadge } from '@/components/SMBadge';
import { SMButton } from '@/components/SMButton';
import { SMEmptyState } from '@/components/SMEmptyState';
import { Layout } from '@/constants/Layout';

export default function NotificationsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'AI Alerts', 'Academics', 'Fees', 'Attendance', 'General'];

  const filteredNotifications = notifications.filter((item) => {
    if (selectedCategory === 'All') return true;
    return item.category === selectedCategory;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'AI Alerts':
        return { icon: 'sparkles', color: colors.accent };
      case 'Academics':
        return { icon: 'school', color: colors.primary };
      case 'Fees':
        return { icon: 'cash', color: colors.warning };
      case 'Attendance':
        return { icon: 'finger-print', color: colors.info };
      default:
        return { icon: 'notifications', color: colors.textSecondary };
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <SMHeader
        title="Notifications"
        subtitle={`${unreadCount} Unread alerts`}
        showBack={false}
        rightAction={
          unreadCount > 0 ? (
            <TouchableOpacity onPress={markAllAsRead} style={styles.markAllBtn}>
              <Text style={[styles.markAllText, { color: colors.primary }]}>
                Mark all read
              </Text>
            </TouchableOpacity>
          ) : undefined
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Category Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterChipsRow}
        >
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.card,
                    borderColor: isSelected ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    { color: isSelected ? '#FFFFFF' : colors.textPrimary },
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Notifications Feed */}
        {filteredNotifications.length === 0 ? (
          <SMEmptyState
            icon="notifications-off-outline"
            title="No Notifications"
            description={`You are all caught up on ${selectedCategory} announcements.`}
            actionTitle="Refresh"
            onActionPress={() => setSelectedCategory('All')}
          />
        ) : (
          <View style={styles.feedList}>
            {filteredNotifications.map((item) => {
              const iconMeta = getCategoryIcon(item.category);

              return (
                <SMCard
                  key={item.id}
                  onPress={() => {
                    markAsRead(item.id);
                    if (item.actionRoute) {
                      router.push(item.actionRoute as any);
                    }
                  }}
                  elevation={item.isRead ? 'none' : 'sm'}
                  padding="md"
                  style={[
                    styles.notifCard,
                    {
                      backgroundColor: item.isRead ? colors.card : colors.surfaceVariant,
                      borderLeftWidth: item.isRead ? 1 : 4,
                      borderLeftColor: item.isRead ? colors.border : colors.primary,
                    },
                  ]}
                >
                  <View style={styles.cardTopRow}>
                    <View style={styles.iconAndCategory}>
                      <View
                        style={[
                          styles.catIconCircle,
                          { backgroundColor: `${iconMeta.color}18` },
                        ]}
                      >
                        <Ionicons name={iconMeta.icon as any} size={16} color={iconMeta.color} />
                      </View>
                      <SMBadge
                        label={item.category}
                        variant={item.category === 'AI Alerts' ? 'primary' : 'neutral'}
                        size="sm"
                      />
                    </View>

                    <View style={styles.timeRow}>
                      {!item.isRead && (
                        <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />
                      )}
                      <Text style={[styles.timeText, { color: colors.textTertiary }]}>
                        {item.timestamp}
                      </Text>
                    </View>
                  </View>

                  <Text style={[styles.notifTitle, { color: colors.textPrimary }]}>
                    {item.title}
                  </Text>
                  <Text style={[styles.notifMessage, { color: colors.textSecondary }]}>
                    {item.message}
                  </Text>

                  {item.actionRoute && (
                    <View style={styles.actionPromptRow}>
                      <Text style={[styles.actionPromptText, { color: colors.primary }]}>
                        Tap to view module →
                      </Text>
                    </View>
                  )}
                </SMCard>
              );
            })}
          </View>
        )}

        <View style={{ height: 80 }} />
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
  },
  markAllBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  markAllText: {
    fontSize: 12,
    fontWeight: '700',
  },
  filterChipsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: Layout.spacing.xs,
    marginBottom: Layout.spacing.sm,
  },
  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: Layout.borderRadius.full,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  feedList: {
    gap: 10,
  },
  notifCard: {
    borderRadius: Layout.borderRadius.lg,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconAndCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  catIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  timeText: {
    fontSize: 11,
  },
  notifTitle: {
    fontSize: Layout.fontSize.titleSmall,
    fontWeight: '700',
    marginBottom: 4,
  },
  notifMessage: {
    fontSize: Layout.fontSize.bodySmall,
    lineHeight: 18,
  },
  actionPromptRow: {
    marginTop: 8,
    paddingTop: 6,
  },
  actionPromptText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
