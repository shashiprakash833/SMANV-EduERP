/**
 * SMANV EduERP Attendance Management
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
import { useTheme } from '@/store/ThemeContext';
import { SMHeader } from '@/components/SMHeader';
import { SMCard } from '@/components/SMCard';
import { SMButton } from '@/components/SMButton';
import { SMBadge } from '@/components/SMBadge';
import { SMAvatar } from '@/components/SMAvatar';
import { SMDialog } from '@/components/SMDialog';
import { MOCK_STUDENTS } from '@/constants/MockData';
import { Layout } from '@/constants/Layout';

type AttendanceStatus = 'Present' | 'Absent' | 'Late';

export default function AttendanceScreen() {
  const { colors } = useTheme();

  const [mode, setMode] = useState<'student' | 'staff'>('student');
  const [selectedClass, setSelectedClass] = useState('Grade 11-A');
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);

  // Student Attendance State
  const [roster, setRoster] = useState(
    MOCK_STUDENTS.map((s) => ({
      ...s,
      status: 'Present' as AttendanceStatus,
    }))
  );

  const toggleStatus = (id: string) => {
    setRoster((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const next: AttendanceStatus =
            item.status === 'Present' ? 'Absent' : item.status === 'Absent' ? 'Late' : 'Present';
          return { ...item, status: next };
        }
        return item;
      })
    );
  };

  const presentCount = roster.filter((r) => r.status === 'Present').length;
  const absentCount = roster.filter((r) => r.status === 'Absent').length;
  const lateCount = roster.filter((r) => r.status === 'Late').length;
  const rate = Math.round((presentCount / roster.length) * 100);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <SMHeader
        title="Attendance Center"
        subtitle="RFID, QR & Manual Register"
        showBack
        rightAction={
          <TouchableOpacity
            onPress={() => setShowQRScanner(true)}
            style={[styles.qrHeaderBtn, { backgroundColor: colors.primaryContainer }]}
          >
            <Ionicons name="qr-code" size={18} color={colors.primaryDark} />
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Student / Staff Switcher */}
        <View style={[styles.switchBar, { backgroundColor: colors.surfaceVariant }]}>
          <TouchableOpacity
            onPress={() => setMode('student')}
            style={[
              styles.switchBtn,
              mode === 'student' && { backgroundColor: colors.card, ...Layout.shadows.sm },
            ]}
          >
            <Text
              style={[
                styles.switchText,
                { color: mode === 'student' ? colors.primary : colors.textSecondary },
              ]}
            >
              Student Attendance
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setMode('staff')}
            style={[
              styles.switchBtn,
              mode === 'staff' && { backgroundColor: colors.card, ...Layout.shadows.sm },
            ]}
          >
            <Text
              style={[
                styles.switchText,
                { color: mode === 'staff' ? colors.primary : colors.textSecondary },
              ]}
            >
              Staff Attendance
            </Text>
          </TouchableOpacity>
        </View>

        {/* Real-time Summary Card */}
        <SMCard elevation="sm" padding="md" style={styles.summaryCard}>
          <View style={styles.summaryTopRow}>
            <View>
              <Text style={[styles.summaryTitle, { color: colors.textPrimary }]}>
                {selectedClass} • Sept 05, 2026
              </Text>
              <Text style={[styles.summarySub, { color: colors.textSecondary }]}>
                Tap any student row to cycle Present → Absent → Late
              </Text>
            </View>
            <View style={styles.rateBadge}>
              <Text style={[styles.rateVal, { color: colors.primary }]}>{rate}%</Text>
            </View>
          </View>

          <View style={styles.countsRow}>
            <View style={[styles.countBox, { backgroundColor: colors.successContainer }]}>
              <Text style={[styles.countVal, { color: colors.success }]}>{presentCount}</Text>
              <Text style={[styles.countLabel, { color: colors.success }]}>Present</Text>
            </View>
            <View style={[styles.countBox, { backgroundColor: colors.errorContainer }]}>
              <Text style={[styles.countVal, { color: colors.error }]}>{absentCount}</Text>
              <Text style={[styles.countLabel, { color: colors.error }]}>Absent</Text>
            </View>
            <View style={[styles.countBox, { backgroundColor: colors.warningContainer }]}>
              <Text style={[styles.countVal, { color: colors.warning }]}>{lateCount}</Text>
              <Text style={[styles.countLabel, { color: colors.warning }]}>Late</Text>
            </View>
          </View>
        </SMCard>

        {/* Student Roster Interactive List */}
        <View style={styles.rosterList}>
          {roster.map((student) => {
            const isPresent = student.status === 'Present';
            const isAbsent = student.status === 'Absent';

            return (
              <TouchableOpacity
                key={student.id}
                onPress={() => toggleStatus(student.id)}
                activeOpacity={0.7}
                style={[
                  styles.rosterCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: isAbsent ? colors.error : isPresent ? colors.cardBorder : colors.warning,
                  },
                  Layout.shadows.sm,
                ]}
              >
                <SMAvatar name={student.name} size="sm" />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={[styles.studentName, { color: colors.textPrimary }]}>
                    {student.name}
                  </Text>
                  <Text style={[styles.rollText, { color: colors.textSecondary }]}>
                    Roll #{student.rollNumber} • Avg: {student.attendanceRate}%
                  </Text>
                </View>

                {/* 1-Tap Toggle Pill */}
                <View
                  style={[
                    styles.statusPill,
                    {
                      backgroundColor: isPresent
                        ? colors.successContainer
                        : isAbsent
                        ? colors.errorContainer
                        : colors.warningContainer,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusPillText,
                      {
                        color: isPresent
                          ? colors.success
                          : isAbsent
                          ? colors.error
                          : colors.warning,
                      },
                    ]}
                  >
                    {student.status}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Save Attendance Button */}
        <SMButton
          title="Save & Submit Daily Attendance"
          onPress={() => setShowSaveSuccess(true)}
          variant="primary"
          size="lg"
          fullWidth
          icon={<Ionicons name="checkmark-done" size={20} color="#FFFFFF" />}
          style={{ marginTop: 16 }}
        />

        <View style={{ height: 60 }} />
      </ScrollView>

      {/* Save Success Dialog */}
      <SMDialog
        visible={showSaveSuccess}
        title="Attendance Recorded"
        message={`Attendance for ${selectedClass} successfully saved. Push notifications dispatched to guardians of ${absentCount} absent scholars.`}
        confirmText="Done"
        onConfirm={() => setShowSaveSuccess(false)}
      />

      {/* QR Scanner Placeholder Dialog */}
      <SMDialog
        visible={showQRScanner}
        title="Scan Student QR / RFID Card"
        confirmText="Simulate Scan"
        cancelText="Close"
        onConfirm={() => {
          setShowQRScanner(false);
          setShowSaveSuccess(true);
        }}
        onCancel={() => setShowQRScanner(false)}
      >
        <View style={[styles.qrMockView, { backgroundColor: colors.surfaceVariant }]}>
          <Ionicons name="scan-outline" size={80} color={colors.primary} />
          <Text style={[styles.qrMockText, { color: colors.textSecondary }]}>
            Align camera with Student ID card or Smart Turnstile RFID badge
          </Text>
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
  },
  qrHeaderBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchBar: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: Layout.borderRadius.md,
    marginBottom: Layout.spacing.sm,
  },
  switchBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: Layout.borderRadius.sm,
  },
  switchText: {
    fontSize: 12,
    fontWeight: '700',
  },
  summaryCard: {
    borderRadius: Layout.borderRadius.xl,
    marginBottom: Layout.spacing.sm,
  },
  summaryTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  summarySub: {
    fontSize: 11,
    marginTop: 2,
  },
  rateBadge: {
    alignItems: 'center',
  },
  rateVal: {
    fontSize: 22,
    fontWeight: '800',
  },
  countsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  countBox: {
    flex: 1,
    padding: 8,
    borderRadius: Layout.borderRadius.md,
    alignItems: 'center',
  },
  countVal: {
    fontSize: 16,
    fontWeight: '800',
  },
  countLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 1,
  },
  rosterList: {
    gap: 8,
  },
  rosterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: Layout.borderRadius.lg,
    borderWidth: 1,
  },
  studentName: {
    fontSize: 14,
    fontWeight: '700',
  },
  rollText: {
    fontSize: 11,
    marginTop: 2,
  },
  statusPill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: Layout.borderRadius.full,
  },
  statusPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  qrMockView: {
    alignItems: 'center',
    padding: 24,
    borderRadius: Layout.borderRadius.lg,
    gap: 12,
  },
  qrMockText: {
    fontSize: 12,
    textAlign: 'center',
  },
});
