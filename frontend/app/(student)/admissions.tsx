/**
 * SMANV EduERP Admissions Management Screen
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
import { SMSearchBar } from '@/components/SMSearchBar';
import { SMBottomSheet } from '@/components/SMBottomSheet';
import { SMInput } from '@/components/SMInput';
import { MOCK_ADMISSIONS } from '@/constants/MockData';
import { AdmissionApplication } from '@/types';
import { Layout } from '@/constants/Layout';

export default function AdmissionsScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const [applications, setApplications] = useState<AdmissionApplication[]>(MOCK_ADMISSIONS);
  const [selectedStage, setSelectedStage] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);

  // New Application Form State
  const [applicantName, setApplicantName] = useState('');
  const [gradeApplying, setGradeApplying] = useState('Grade 11 (Science)');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [previousSchool, setPreviousSchool] = useState('');
  const [notes, setNotes] = useState('');

  const stages = ['All', 'Screening', 'Interview', 'Offered', 'Enrolled'];

  const filtered = applications.filter((item) => {
    const matchesStage = selectedStage === 'All' || item.stage === selectedStage;
    const matchesSearch =
      item.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.gradeApplying.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStage && matchesSearch;
  });

  const handleCreateApplication = () => {
    if (!applicantName.trim() || !parentName.trim()) return;

    const newApp: AdmissionApplication = {
      id: `ADM-2026-${Math.floor(100 + Math.random() * 900)}`,
      applicantName,
      gradeApplying,
      parentName,
      parentPhone: parentPhone || '+91 98000 00000',
      appliedDate: new Date().toISOString().split('T')[0],
      stage: 'Screening',
      previousSchool: previousSchool || 'Previous Academy',
      notes,
    };

    setApplications([newApp, ...applications]);
    setShowNewModal(false);
    setApplicantName('');
    setParentName('');
    setParentPhone('');
    setPreviousSchool('');
    setNotes('');
  };

  const getStageVariant = (stage: AdmissionApplication['stage']) => {
    switch (stage) {
      case 'Enrolled':
        return 'success';
      case 'Offered':
        return 'primary';
      case 'Interview':
        return 'warning';
      case 'Screening':
        return 'info';
      default:
        return 'neutral';
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <SMHeader
        title="Admissions Pipeline"
        subtitle="Applications & Enrollment Management"
        showBack
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* KPI Metrics Row */}
        <View style={styles.kpiRow}>
          <SMCard style={styles.kpiCard} padding="sm">
            <Text style={[styles.kpiVal, { color: colors.primary }]}>{applications.length + 45}</Text>
            <Text style={[styles.kpiLabel, { color: colors.textSecondary }]}>Total Inquiries</Text>
          </SMCard>
          <SMCard style={styles.kpiCard} padding="sm">
            <Text style={[styles.kpiVal, { color: colors.warning }]}>18</Text>
            <Text style={[styles.kpiLabel, { color: colors.textSecondary }]}>In Screening</Text>
          </SMCard>
          <SMCard style={styles.kpiCard} padding="sm">
            <Text style={[styles.kpiVal, { color: colors.success }]}>350</Text>
            <Text style={[styles.kpiLabel, { color: colors.textSecondary }]}>Confirmed</Text>
          </SMCard>
        </View>

        {/* Search and New Application Trigger */}
        <View style={styles.actionHeaderRow}>
          <SMSearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search applicants or grades..."
            style={{ flex: 1 }}
          />
          <SMButton
            title="+ New"
            onPress={() => setShowNewModal(true)}
            variant="primary"
            size="md"
            style={{ marginLeft: 8 }}
          />
        </View>

        {/* Stage Filter Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
          {stages.map((stg) => {
            const isSelected = selectedStage === stg;
            return (
              <TouchableOpacity
                key={stg}
                onPress={() => setSelectedStage(stg)}
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
                  {stg}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Applications List */}
        <View style={styles.listContainer}>
          {filtered.map((item) => (
            <SMCard key={item.id} elevation="sm" padding="md" style={styles.appCard}>
              <View style={styles.appCardHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.applicantName, { color: colors.textPrimary }]}>
                    {item.applicantName}
                  </Text>
                  <Text style={[styles.appGrade, { color: colors.primary }]}>
                    {item.gradeApplying}
                  </Text>
                </View>
                <SMBadge label={item.stage} variant={getStageVariant(item.stage)} size="sm" />
              </View>

              <View style={[styles.appDetailsBox, { backgroundColor: colors.surfaceVariant }]}>
                <Text style={[styles.detailRow, { color: colors.textSecondary }]}>
                  <Text style={{ fontWeight: '700' }}>Parent: </Text>
                  {item.parentName} ({item.parentPhone})
                </Text>
                <Text style={[styles.detailRow, { color: colors.textSecondary }]}>
                  <Text style={{ fontWeight: '700' }}>Prior Academy: </Text>
                  {item.previousSchool}
                </Text>
                {item.notes && (
                  <Text style={[styles.detailRow, { color: colors.textTertiary, fontStyle: 'italic' }]}>
                    Note: {item.notes}
                  </Text>
                )}
              </View>

              <View style={styles.appFooter}>
                <Text style={[styles.appDate, { color: colors.textTertiary }]}>
                  Applied on: {item.appliedDate} • App #{item.id}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    const nextStages: Record<string, AdmissionApplication['stage']> = {
                      Screening: 'Interview',
                      Interview: 'Offered',
                      Offered: 'Enrolled',
                    };
                    const next = nextStages[item.stage];
                    if (next) {
                      setApplications(
                        applications.map((a) => (a.id === item.id ? { ...a, stage: next } : a))
                      );
                    }
                  }}
                  style={[styles.advanceBtn, { backgroundColor: colors.primaryContainer }]}
                >
                  <Text style={[styles.advanceBtnText, { color: colors.primaryDark }]}>
                    Advance Stage →
                  </Text>
                </TouchableOpacity>
              </View>
            </SMCard>
          ))}
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>

      {/* New Application Bottom Sheet */}
      <SMBottomSheet
        visible={showNewModal}
        onClose={() => setShowNewModal(false)}
        title="Register New Applicant"
        subtitle="SMANV Academic Session 2026-2027"
      >
        <SMInput
          label="Applicant Student Full Name"
          placeholder="e.g. Navya Sengupta"
          value={applicantName}
          onChangeText={setApplicantName}
          required
        />
        <SMInput
          label="Grade & Stream Applying For"
          placeholder="e.g. Grade 11 (Commerce & AI)"
          value={gradeApplying}
          onChangeText={setGradeApplying}
          required
        />
        <SMInput
          label="Parent / Guardian Full Name"
          placeholder="e.g. Dr. Subir Sengupta"
          value={parentName}
          onChangeText={setParentName}
          required
        />
        <SMInput
          label="Guardian Phone Number"
          placeholder="+91 98000 11111"
          value={parentPhone}
          onChangeText={setParentPhone}
          keyboardType="phone-pad"
          required
        />
        <SMInput
          label="Previous School & Score"
          placeholder="e.g. St. Columba's School (92.4%)"
          value={previousSchool}
          onChangeText={setPreviousSchool}
        />
        <SMInput
          label="Interview Panel Notes / Remarks"
          placeholder="Special achievements, scholarship inquiry, etc."
          value={notes}
          onChangeText={setNotes}
          multiline
        />
        <SMButton
          title="Submit Application to Pipeline"
          onPress={handleCreateApplication}
          variant="primary"
          size="lg"
          fullWidth
          style={{ marginTop: 12 }}
        />
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
  kpiRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: Layout.spacing.sm,
  },
  kpiCard: {
    flex: 1,
    borderRadius: Layout.borderRadius.lg,
    alignItems: 'center',
  },
  kpiVal: {
    fontSize: 18,
    fontWeight: '800',
  },
  kpiLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  actionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.xs,
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
  listContainer: {
    gap: 10,
  },
  appCard: {
    borderRadius: Layout.borderRadius.xl,
  },
  appCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  applicantName: {
    fontSize: 15,
    fontWeight: '700',
  },
  appGrade: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 1,
  },
  appDetailsBox: {
    padding: 10,
    borderRadius: Layout.borderRadius.md,
    gap: 4,
  },
  detailRow: {
    fontSize: 12,
  },
  appFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  appDate: {
    fontSize: 10,
  },
  advanceBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: Layout.borderRadius.full,
  },
  advanceBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
