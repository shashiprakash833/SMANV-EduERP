/**
 * SMANV EduERP Examinations Management
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
import { SMBadge } from '@/components/SMBadge';
import { SMButton } from '@/components/SMButton';
import { SMBottomSheet } from '@/components/SMBottomSheet';
import { SMDialog } from '@/components/SMDialog';
import { MOCK_EXAMINATIONS } from '@/constants/MockData';
import { Examination } from '@/types';
import { Layout } from '@/constants/Layout';

export default function ExaminationsScreen() {
  const { colors } = useTheme();

  const [exams] = useState<Examination[]>(MOCK_EXAMINATIONS);
  const [selectedExam, setSelectedExam] = useState<Examination | null>(null);
  const [showHallTicket, setShowHallTicket] = useState(false);
  const [showMarksDialog, setShowMarksDialog] = useState(false);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <SMHeader
        title="Examinations Center"
        subtitle="Term 1 Mid-Term Assessments 2026"
        showBack
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Banner Alert */}
        <SMCard elevation="none" padding="md" style={[styles.bannerCard, { backgroundColor: colors.surfaceVariant }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Ionicons name="calendar-outline" size={24} color={colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.bannerTitle, { color: colors.textPrimary }]}>
                Mid-Term Examinations Timetable Published
              </Text>
              <Text style={[styles.bannerSubtitle, { color: colors.textSecondary }]}>
                Commencing Sept 22, 2026. Hall tickets available for download.
              </Text>
            </View>
          </View>
        </SMCard>

        {/* Quick Actions */}
        <View style={styles.actionRow}>
          <SMButton
            title="Download Hall Ticket"
            onPress={() => setShowHallTicket(true)}
            variant="outline"
            size="sm"
            icon={<Ionicons name="download-outline" size={16} color={colors.primary} />}
            style={{ flex: 1 }}
          />
          <SMButton
            title="Marks Entry Sheet"
            onPress={() => setShowMarksDialog(true)}
            variant="primary"
            size="sm"
            icon={<Ionicons name="create-outline" size={16} color="#FFFFFF" />}
            style={{ flex: 1 }}
          />
        </View>

        {/* Schedule List */}
        <View style={styles.list}>
          {exams.map((exam) => (
            <SMCard
              key={exam.id}
              onPress={() => setSelectedExam(exam)}
              elevation="sm"
              padding="md"
              style={styles.examCard}
            >
              <View style={styles.cardTop}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.examTitle, { color: colors.textPrimary }]}>
                    {exam.title}
                  </Text>
                  <Text style={[styles.examGrade, { color: colors.primary }]}>
                    {exam.grade} • {exam.subject}
                  </Text>
                </View>
                <SMBadge label={exam.status} variant="primary" size="sm" />
              </View>

              <View style={[styles.examDetailsGrid, { backgroundColor: colors.surfaceVariant }]}>
                <View style={styles.detailItem}>
                  <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Date</Text>
                  <Text style={[styles.detailValue, { color: colors.textPrimary }]}>{exam.date}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Time</Text>
                  <Text style={[styles.detailValue, { color: colors.textPrimary }]}>
                    {exam.startTime} - {exam.endTime}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Room</Text>
                  <Text style={[styles.detailValue, { color: colors.textPrimary }]}>{exam.room}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Max Marks</Text>
                  <Text style={[styles.detailValue, { color: colors.textPrimary }]}>{exam.maxMarks}</Text>
                </View>
              </View>
            </SMCard>
          ))}
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>

      {/* Hall Ticket Bottom Sheet */}
      <SMBottomSheet
        visible={showHallTicket}
        onClose={() => setShowHallTicket(false)}
        title="Official Examination Hall Ticket"
        subtitle="CBSE / SMANV Board Affiliated"
      >
        <View style={[styles.hallTicketBox, { backgroundColor: colors.card, borderColor: colors.primary }]}>
          <View style={[styles.ticketHeader, { backgroundColor: colors.primary }]}>
            <Text style={styles.ticketTitle}>st.peter's edu school (hnk)</Text>
            <Text style={styles.ticketSub}>ADMIT CARD - TERM 1 2026-27</Text>
          </View>

          <View style={styles.ticketBody}>
            <Text style={[styles.ticketInfo, { color: colors.textPrimary }]}>
              <Text style={{ fontWeight: '700' }}>Candidate: </Text>Aarav Sharma
            </Text>
            <Text style={[styles.ticketInfo, { color: colors.textPrimary }]}>
              <Text style={{ fontWeight: '700' }}>Roll No: </Text>11A-24
            </Text>
            <Text style={[styles.ticketInfo, { color: colors.textPrimary }]}>
              <Text style={{ fontWeight: '700' }}>Class: </Text>Grade 11 (Science)
            </Text>
            <Text style={[styles.ticketInfo, { color: colors.textPrimary }]}>
              <Text style={{ fontWeight: '700' }}>Center: </Text>Auditorium Hall B
            </Text>

            <View style={[styles.qrVerifyBox, { backgroundColor: colors.surfaceVariant }]}>
              <Ionicons name="qr-code-outline" size={60} color={colors.primary} />
              <Text style={[styles.qrVerifyText, { color: colors.textSecondary }]}>
                SMANV-EXAM-2026-HT-11024-VERIFIED
              </Text>
            </View>
          </View>
        </View>

        <SMButton
          title="Print / Save PDF Hall Ticket"
          onPress={() => setShowHallTicket(false)}
          variant="primary"
          size="md"
          fullWidth
          icon={<Ionicons name="print-outline" size={18} color="#FFFFFF" />}
          style={{ marginTop: 12 }}
        />
      </SMBottomSheet>

      {/* Marks Entry Dialog */}
      <SMDialog
        visible={showMarksDialog}
        title="Marks Evaluation Sheet"
        message="Enter subject marks for Grade 11-A Physics (Mid-Term Exam). Automatic grading curve and grade point calculation are enabled."
        confirmText="Open Excel Sheet"
        cancelText="Close"
        onConfirm={() => setShowMarksDialog(false)}
        onCancel={() => setShowMarksDialog(false)}
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
  bannerCard: {
    borderRadius: Layout.borderRadius.lg,
    marginBottom: Layout.spacing.sm,
  },
  bannerTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  bannerSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: Layout.spacing.sm,
  },
  list: {
    gap: 10,
  },
  examCard: {
    borderRadius: Layout.borderRadius.xl,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  examTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  examGrade: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 1,
  },
  examDetailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    borderRadius: Layout.borderRadius.md,
    gap: 8,
  },
  detailItem: {
    width: '47%',
  },
  detailLabel: {
    fontSize: 10,
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 1,
  },
  hallTicketBox: {
    borderRadius: Layout.borderRadius.lg,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  ticketHeader: {
    padding: 12,
    alignItems: 'center',
  },
  ticketTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  ticketSub: {
    color: '#FFFFFF',
    fontSize: 10,
    marginTop: 2,
  },
  ticketBody: {
    padding: 14,
    gap: 4,
  },
  ticketInfo: {
    fontSize: 12,
  },
  qrVerifyBox: {
    alignItems: 'center',
    padding: 12,
    borderRadius: Layout.borderRadius.md,
    marginTop: 12,
    gap: 6,
  },
  qrVerifyText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
