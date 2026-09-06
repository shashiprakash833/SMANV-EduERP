/**
 * SMANV EduERP Academics Management Hub
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
import { SMButton } from '@/components/SMButton';
import { SMBadge } from '@/components/SMBadge';
import { SMProgressBar } from '@/components/SMChart';
import { MOCK_CLASS_SESSIONS } from '@/constants/MockData';
import { Layout } from '@/constants/Layout';

export default function AcademicsScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const [selectedDay, setSelectedDay] = useState('Mon');
  const [activeSection, setActiveSection] = useState<'timetable' | 'curriculum' | 'classes'>('timetable');

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const curriculumProgress = [
    { subject: 'Advanced Physics (Class 11)', teacher: 'Prof. Priya Nair', progress: 68, units: 'Unit 4 of 7 completed' },
    { subject: 'Pure Mathematics & Calculus', teacher: 'Dr. Alok Verma', progress: 74, units: 'Unit 5 of 8 completed' },
    { subject: 'Computer Science & AI Lab', teacher: 'Mr. Devendra Joshi', progress: 85, units: 'Unit 6 of 8 completed' },
    { subject: 'English & Communication Skills', teacher: 'Ms. Sunita Rao', progress: 60, units: 'Unit 3 of 6 completed' },
  ];

  const gradeClasses = [
    { grade: 'Grade 9', sections: ['9-A', '9-B', '9-C'], studentsCount: 420, mentor: 'Dr. Shalini Saxena' },
    { grade: 'Grade 10', sections: ['10-A', '10-B', '10-C'], studentsCount: 410, mentor: 'Dr. Alok Verma' },
    { grade: 'Grade 11', sections: ['11-A (Sci)', '11-B (Com)', '11-C (Arts)'], studentsCount: 380, mentor: 'Prof. Priya Nair' },
    { grade: 'Grade 12', sections: ['12-A (Sci)', '12-B (Com)', '12-C (Arts)'], studentsCount: 360, mentor: 'Mr. Devendra Joshi' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <SMHeader title="Academics Hub" subtitle="Timetables, Curriculum & Classes" showBack={false} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Quick Nav Row */}
        <View style={styles.quickNavRow}>
          <TouchableOpacity
            onPress={() => router.push('/assignments')}
            style={[styles.quickNavCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
          >
            <Ionicons name="document-text" size={20} color={colors.warning} />
            <Text style={[styles.quickNavTitle, { color: colors.textPrimary }]}>Assignments</Text>
            <Text style={[styles.quickNavSub, { color: colors.textSecondary }]}>14 Active</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/examinations')}
            style={[styles.quickNavCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
          >
            <Ionicons name="medal" size={20} color={colors.error} />
            <Text style={[styles.quickNavTitle, { color: colors.textPrimary }]}>Examinations</Text>
            <Text style={[styles.quickNavSub, { color: colors.textSecondary }]}>Datesheet Live</Text>
          </TouchableOpacity>
        </View>

        {/* Section Tabs */}
        <View style={[styles.tabBar, { backgroundColor: colors.surfaceVariant }]}>
          <TouchableOpacity
            onPress={() => setActiveSection('timetable')}
            style={[
              styles.tabBtn,
              activeSection === 'timetable' && { backgroundColor: colors.card, ...Layout.shadows.sm },
            ]}
          >
            <Text
              style={[
                styles.tabBtnText,
                { color: activeSection === 'timetable' ? colors.primary : colors.textSecondary },
              ]}
            >
              Daily Timetable
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveSection('curriculum')}
            style={[
              styles.tabBtn,
              activeSection === 'curriculum' && { backgroundColor: colors.card, ...Layout.shadows.sm },
            ]}
          >
            <Text
              style={[
                styles.tabBtnText,
                { color: activeSection === 'curriculum' ? colors.primary : colors.textSecondary },
              ]}
            >
              Curriculum Tracker
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveSection('classes')}
            style={[
              styles.tabBtn,
              activeSection === 'classes' && { backgroundColor: colors.card, ...Layout.shadows.sm },
            ]}
          >
            <Text
              style={[
                styles.tabBtnText,
                { color: activeSection === 'classes' ? colors.primary : colors.textSecondary },
              ]}
            >
              Classes
            </Text>
          </TouchableOpacity>
        </View>

        {/* 1. Timetable View */}
        {activeSection === 'timetable' && (
          <>
            {/* Days Selector */}
            <View style={styles.daysRow}>
              {days.map((day) => {
                const isSelected = selectedDay === day;
                return (
                  <TouchableOpacity
                    key={day}
                    onPress={() => setSelectedDay(day)}
                    style={[
                      styles.dayChip,
                      {
                        backgroundColor: isSelected ? colors.primary : colors.card,
                        borderColor: isSelected ? colors.primary : colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayChipText,
                        { color: isSelected ? '#FFFFFF' : colors.textPrimary },
                      ]}
                    >
                      {day}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <SMCard elevation="sm" padding="md" style={styles.sectionCard}>
              <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                  Schedule for {selectedDay} (Grade 11-A)
                </Text>
                <SMBadge label="4 Periods" variant="primary" size="sm" />
              </View>

              {MOCK_CLASS_SESSIONS.map((session) => (
                <View
                  key={session.id}
                  style={[
                    styles.sessionCard,
                    {
                      backgroundColor: session.status === 'Ongoing' ? colors.primaryContainer : colors.surface,
                      borderColor: session.status === 'Ongoing' ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <View style={styles.timeCol}>
                    <Text style={[styles.periodNum, { color: colors.primaryDark }]}>Period {session.period}</Text>
                    <Text style={[styles.timeText, { color: colors.textSecondary }]}>{session.startTime}</Text>
                    <Text style={[styles.timeText, { color: colors.textTertiary }]}>{session.endTime}</Text>
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={[styles.subjectName, { color: colors.textPrimary }]}>{session.subject}</Text>
                    <Text style={[styles.teacherName, { color: colors.textSecondary }]}>
                      Instructor: {session.teacherName}
                    </Text>
                    <Text style={[styles.roomName, { color: colors.primary }]}>
                      📍 {session.room}
                    </Text>
                  </View>

                  <SMBadge
                    label={session.status}
                    variant={session.status === 'Ongoing' ? 'primary' : session.status === 'Completed' ? 'neutral' : 'warning'}
                    size="sm"
                  />
                </View>
              ))}
            </SMCard>
          </>
        )}

        {/* 2. Curriculum Coverage View */}
        {activeSection === 'curriculum' && (
          <SMCard elevation="sm" padding="md" style={styles.sectionCard}>
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                Syllabus Progress (Term 1)
              </Text>
              <SMBadge label="Ahead by 8%" variant="success" size="sm" />
            </View>

            {curriculumProgress.map((item, idx) => (
              <View key={`curr-${idx}`} style={[styles.currItem, { borderBottomColor: colors.borderLight }]}>
                <View style={styles.currHeaderRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.currSubject, { color: colors.textPrimary }]}>{item.subject}</Text>
                    <Text style={[styles.currTeacher, { color: colors.textSecondary }]}>{item.teacher} • {item.units}</Text>
                  </View>
                  <Text style={[styles.currPercent, { color: colors.primary }]}>{item.progress}%</Text>
                </View>
                <SMProgressBar progress={item.progress} color={colors.primary} />
              </View>
            ))}
          </SMCard>
        )}

        {/* 3. Classes View */}
        {activeSection === 'classes' && (
          <View style={styles.classesGrid}>
            {gradeClasses.map((item) => (
              <SMCard key={item.grade} elevation="sm" padding="md" style={styles.classCard}>
                <View style={styles.classCardHeader}>
                  <Text style={[styles.classGradeTitle, { color: colors.textPrimary }]}>{item.grade}</Text>
                  <SMBadge label={`${item.studentsCount} Students`} variant="primary" size="sm" />
                </View>
                <Text style={[styles.classMentor, { color: colors.textSecondary }]}>
                  Dean / Mentor: {item.mentor}
                </Text>
                <View style={styles.sectionsPillRow}>
                  {item.sections.map((sec) => (
                    <View key={sec} style={[styles.sectionPill, { backgroundColor: colors.surfaceVariant }]}>
                      <Text style={[styles.sectionPillText, { color: colors.textPrimary }]}>{sec}</Text>
                    </View>
                  ))}
                </View>
              </SMCard>
            ))}
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
  quickNavRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: Layout.spacing.sm,
  },
  quickNavCard: {
    flex: 1,
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.lg,
    borderWidth: 1,
    alignItems: 'center',
    gap: 4,
  },
  quickNavTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
  quickNavSub: {
    fontSize: 11,
  },
  tabBar: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: Layout.borderRadius.md,
    marginBottom: Layout.spacing.sm,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: Layout.borderRadius.sm,
  },
  tabBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: Layout.spacing.xs,
  },
  dayChip: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    marginHorizontal: 2,
    borderRadius: Layout.borderRadius.sm,
    borderWidth: 1,
  },
  dayChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  sectionCard: {
    marginVertical: Layout.spacing.xs,
    borderRadius: Layout.borderRadius.xl,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  cardTitle: {
    fontSize: Layout.fontSize.titleMedium,
    fontWeight: '700',
  },
  sessionCard: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: Layout.borderRadius.md,
    borderWidth: 1,
    marginVertical: 4,
    gap: 12,
    alignItems: 'center',
  },
  timeCol: {
    minWidth: 70,
  },
  periodNum: {
    fontSize: 12,
    fontWeight: '800',
  },
  timeText: {
    fontSize: 10,
    marginTop: 1,
  },
  subjectName: {
    fontSize: 13,
    fontWeight: '700',
  },
  teacherName: {
    fontSize: 11,
    marginTop: 2,
  },
  roomName: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  currItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  currHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  currSubject: {
    fontSize: 13,
    fontWeight: '700',
  },
  currTeacher: {
    fontSize: 11,
    marginTop: 2,
  },
  currPercent: {
    fontSize: 14,
    fontWeight: '800',
  },
  classesGrid: {
    gap: 10,
  },
  classCard: {
    borderRadius: Layout.borderRadius.lg,
  },
  classCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  classGradeTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  classMentor: {
    fontSize: 12,
    marginBottom: 10,
  },
  sectionsPillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  sectionPill: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: Layout.borderRadius.full,
  },
  sectionPillText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
