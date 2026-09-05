/**
 * SMANV EduERP Staff & Faculty Directory
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../store/ThemeContext';
import { SMHeader } from '../components/SMHeader';
import { SMCard } from '../components/SMCard';
import { SMAvatar } from '../components/SMAvatar';
import { SMBadge } from '../components/SMBadge';
import { SMSearchBar } from '../components/SMSearchBar';
import { MOCK_STAFF } from '../constants/MockData';
import { Staff } from '../types';
import { Layout } from '../constants/Layout';

export default function StaffScreen() {
  const { colors } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');

  const departments = ['All', 'Science & Technology', 'Mathematics', 'Computer Science & AI', 'Languages & Humanities'];

  const filtered = MOCK_STAFF.filter((staff) => {
    const matchesDept = selectedDept === 'All' || staff.department === selectedDept;
    const matchesSearch =
      staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.employeeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.designation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const getStatusVariant = (status: Staff['status']) => {
    switch (status) {
      case 'In Class':
        return 'primary';
      case 'On Duty':
        return 'success';
      case 'On Leave':
        return 'error';
      default:
        return 'neutral';
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <SMHeader title="Staff & Faculty" subtitle="182 Academic & Administrative Staff" showBack />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <SMSearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by faculty name, code, designation..."
        />

        {/* Department Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
          {departments.map((dept) => {
            const isSelected = selectedDept === dept;
            return (
              <TouchableOpacity
                key={dept}
                onPress={() => setSelectedDept(dept)}
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
                  {dept}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Staff Cards */}
        <View style={styles.list}>
          {filtered.map((item) => (
            <SMCard key={item.id} elevation="sm" padding="md" style={styles.staffCard}>
              <View style={styles.topRow}>
                <SMAvatar name={item.name} size="md" status={item.status === 'On Leave' ? 'busy' : 'online'} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <View style={styles.nameStatusRow}>
                    <Text style={[styles.staffName, { color: colors.textPrimary }]}>
                      {item.name}
                    </Text>
                    <SMBadge label={item.status} variant={getStatusVariant(item.status)} size="sm" dot />
                  </View>
                  <Text style={[styles.designation, { color: colors.primary }]}>
                    {item.designation}
                  </Text>
                  <Text style={[styles.deptText, { color: colors.textSecondary }]}>
                    {item.department} • Code: {item.employeeCode}
                  </Text>
                </View>
              </View>

              <View style={[styles.subjectsBox, { backgroundColor: colors.surfaceVariant }]}>
                <Text style={[styles.subjectsTitle, { color: colors.textSecondary }]}>
                  Subjects: {item.subjects.join(' • ')}
                </Text>
                <Text style={[styles.qualificationText, { color: colors.textTertiary }]}>
                  {item.qualification}
                </Text>
              </View>

              <View style={styles.cardFooter}>
                <View style={styles.contactActions}>
                  <TouchableOpacity style={[styles.contactBtn, { backgroundColor: colors.primaryContainer }]}>
                    <Ionicons name="call-outline" size={14} color={colors.primaryDark} />
                    <Text style={[styles.contactBtnText, { color: colors.primaryDark }]}>Call</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.contactBtn, { backgroundColor: colors.surfaceVariant }]}>
                    <Ionicons name="mail-outline" size={14} color={colors.textPrimary} />
                    <Text style={[styles.contactBtnText, { color: colors.textPrimary }]}>Email</Text>
                  </TouchableOpacity>
                </View>

                <Text style={[styles.attendanceStat, { color: colors.success }]}>
                  {item.attendanceRate}% Attendance
                </Text>
              </View>
            </SMCard>
          ))}
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
  },
  chipsRow: {
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
  list: {
    gap: 10,
  },
  staffCard: {
    borderRadius: Layout.borderRadius.xl,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  staffName: {
    fontSize: 15,
    fontWeight: '700',
  },
  designation: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 1,
  },
  deptText: {
    fontSize: 11,
    marginTop: 2,
  },
  subjectsBox: {
    padding: 10,
    borderRadius: Layout.borderRadius.md,
    marginVertical: 10,
    gap: 2,
  },
  subjectsTitle: {
    fontSize: 11,
    fontWeight: '600',
  },
  qualificationText: {
    fontSize: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contactActions: {
    flexDirection: 'row',
    gap: 8,
  },
  contactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: Layout.borderRadius.full,
  },
  contactBtnText: {
    fontSize: 11,
    fontWeight: '600',
  },
  attendanceStat: {
    fontSize: 12,
    fontWeight: '700',
  },
});
