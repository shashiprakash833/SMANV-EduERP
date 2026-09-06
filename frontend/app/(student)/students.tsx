/**
 * SMANV EduERP Students Directory & Digital ID
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
import { SMHeader } from '@/components/SMHeader';
import { SMCard } from '@/components/SMCard';
import { SMAvatar } from '@/components/SMAvatar';
import { SMBadge } from '@/components/SMBadge';
import { SMSearchBar } from '@/components/SMSearchBar';
import { SMBottomSheet } from '@/components/SMBottomSheet';
import { SMProgressBar } from '@/components/SMChart';
import { SMButton } from '@/components/SMButton';
import { MOCK_STUDENTS } from '@/constants/MockData';
import { Student } from '@/types';
import { Layout } from '@/constants/Layout';

export default function StudentsScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('All');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const grades = ['All', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];

  const filtered = MOCK_STUDENTS.filter((item) => {
    const matchesGrade = selectedGrade === 'All' || item.grade.includes(selectedGrade.replace('Grade ', ''));
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.parentName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGrade && matchesSearch;
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <SMHeader title="Students Directory" subtitle="2,450 Registered Scholars" showBack />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <SMSearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by student name, roll number, or parent..."
        />

        {/* Grade Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
          {grades.map((grd) => {
            const isSelected = selectedGrade === grd;
            return (
              <TouchableOpacity
                key={grd}
                onPress={() => setSelectedGrade(grd)}
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
                  {grd}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Students List */}
        <View style={styles.list}>
          {filtered.map((student) => (
            <SMCard
              key={student.id}
              onPress={() => setSelectedStudent(student)}
              elevation="sm"
              padding="md"
              style={styles.studentCard}
            >
              <View style={styles.studentRow}>
                <SMAvatar name={student.name} size="md" status="online" />
                <View style={styles.studentDetailsCol}>
                  <View style={styles.nameBadgeRow}>
                    <Text style={[styles.studentName, { color: colors.textPrimary }]}>
                      {student.name}
                    </Text>
                    <SMBadge
                      label={student.feeStatus}
                      variant={student.feeStatus === 'Paid' ? 'success' : student.feeStatus === 'Pending' ? 'warning' : 'error'}
                      size="sm"
                    />
                  </View>

                  <Text style={[styles.studentSub, { color: colors.textSecondary }]}>
                    {student.grade} - Sec {student.section} • Roll #{student.rollNumber}
                  </Text>

                  <View style={styles.metricsMiniRow}>
                    <Text style={[styles.miniMetric, { color: colors.primary }]}>
                      Attendance: {student.attendanceRate}%
                    </Text>
                    <Text style={{ color: colors.textTertiary }}>•</Text>
                    <Text style={[styles.miniMetric, { color: colors.textSecondary }]}>
                      Blood: {student.bloodGroup}
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
              </View>
            </SMCard>
          ))}
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>

      {/* Student Profile & Digital ID Modal */}
      <SMBottomSheet
        visible={selectedStudent !== null}
        onClose={() => setSelectedStudent(null)}
        title="Student Profile & ID"
        subtitle={selectedStudent ? `${selectedStudent.name} (${selectedStudent.rollNumber})` : ''}
      >
        {selectedStudent && (
          <View style={styles.profileSheetContent}>
            {/* Digital ID Card Preview */}
            <View style={[styles.digitalIDCard, { backgroundColor: colors.card, borderColor: colors.primary }]}>
              <View style={[styles.idCardHeader, { backgroundColor: colors.primary }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Ionicons name="school" size={16} color="#FFFFFF" />
                  <Text style={styles.idCardSchoolName}>SMANV INTERNATIONAL ACADEMY</Text>
                </View>
                <Text style={styles.idCardSession}>2026-27</Text>
              </View>

              <View style={styles.idCardBody}>
                <SMAvatar name={selectedStudent.name} size="lg" />
                <View style={{ flex: 1, marginLeft: 14 }}>
                  <Text style={[styles.idStudentName, { color: colors.textPrimary }]}>
                    {selectedStudent.name}
                  </Text>
                  <Text style={[styles.idInfo, { color: colors.textSecondary }]}>
                    Class: {selectedStudent.grade} - {selectedStudent.section}
                  </Text>
                  <Text style={[styles.idInfo, { color: colors.textSecondary }]}>
                    Roll No: {selectedStudent.rollNumber}
                  </Text>
                  <Text style={[styles.idInfo, { color: colors.textSecondary }]}>
                    Blood Group: {selectedStudent.bloodGroup}
                  </Text>
                </View>
              </View>

              {/* QR Code Placeholder Graphic */}
              <View style={[styles.qrContainer, { backgroundColor: colors.surfaceVariant }]}>
                <Ionicons name="qr-code-outline" size={68} color={colors.primary} />
                <Text style={[styles.qrCodeText, { color: colors.textSecondary }]}>
                  {selectedStudent.qrCode}
                </Text>
                <Text style={[styles.qrHint, { color: colors.textTertiary }]}>
                  Scan at campus gates for RFID attendance check-in
                </Text>
              </View>
            </View>

            {/* Attendance & Fee Overview */}
            <View style={[styles.infoBlock, { backgroundColor: colors.surfaceVariant }]}>
              <Text style={[styles.blockTitle, { color: colors.textPrimary }]}>
                Academic & Fee Status
              </Text>
              <SMProgressBar
                progress={selectedStudent.attendanceRate}
                label="Attendance Rate"
                valueText={`${selectedStudent.attendanceRate}%`}
                color={selectedStudent.attendanceRate > 75 ? colors.success : colors.error}
              />
              <View style={styles.feeStatusRow}>
                <Text style={[styles.feeStatusLabel, { color: colors.textSecondary }]}>Fee Payment Status:</Text>
                <SMBadge
                  label={selectedStudent.feeStatus}
                  variant={selectedStudent.feeStatus === 'Paid' ? 'success' : 'error'}
                  size="sm"
                />
              </View>
            </View>

            {/* Guardian Information */}
            <View style={[styles.infoBlock, { backgroundColor: colors.surfaceVariant }]}>
              <Text style={[styles.blockTitle, { color: colors.textPrimary }]}>
                Guardian Contact
              </Text>
              <Text style={[styles.guardianInfo, { color: colors.textPrimary }]}>
                Parent: {selectedStudent.parentName}
              </Text>
              <Text style={[styles.guardianInfo, { color: colors.textSecondary }]}>
                Phone: {selectedStudent.parentPhone}
              </Text>
              <Text style={[styles.guardianInfo, { color: colors.textSecondary }]}>
                Address: {selectedStudent.address}
              </Text>
            </View>

            <SMButton
              title="Close Profile"
              onPress={() => setSelectedStudent(null)}
              variant="outline"
              size="md"
              fullWidth
              style={{ marginTop: 12 }}
            />
          </View>
        )}
      </SMBottomSheet>
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
    gap: 8,
  },
  studentCard: {
    borderRadius: Layout.borderRadius.xl,
  },
  studentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  studentDetailsCol: {
    flex: 1,
    marginLeft: 12,
  },
  nameBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  studentName: {
    fontSize: 14,
    fontWeight: '700',
  },
  studentSub: {
    fontSize: 11,
    marginTop: 2,
  },
  metricsMiniRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  miniMetric: {
    fontSize: 11,
    fontWeight: '600',
  },
  profileSheetContent: {
    gap: 12,
  },
  digitalIDCard: {
    borderRadius: Layout.borderRadius.lg,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  idCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  idCardSchoolName: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  idCardSession: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  idCardBody: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  idStudentName: {
    fontSize: 16,
    fontWeight: '800',
  },
  idInfo: {
    fontSize: 11,
    marginTop: 2,
  },
  qrContainer: {
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 12,
    marginBottom: 12,
    borderRadius: Layout.borderRadius.md,
  },
  qrCodeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: 4,
  },
  qrHint: {
    fontSize: 10,
    marginTop: 2,
  },
  infoBlock: {
    padding: 12,
    borderRadius: Layout.borderRadius.md,
    gap: 6,
  },
  blockTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  feeStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  feeStatusLabel: {
    fontSize: 12,
  },
  guardianInfo: {
    fontSize: 12,
  },
});
