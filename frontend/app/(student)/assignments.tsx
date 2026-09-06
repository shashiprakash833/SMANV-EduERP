/**
 * SMANV EduERP Assignments Management
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
import { SMBottomSheet } from '@/components/SMBottomSheet';
import { SMInput } from '@/components/SMInput';
import { SMProgressBar } from '@/components/SMChart';
import { MOCK_ASSIGNMENTS } from '@/constants/MockData';
import { Assignment } from '@/types';
import { Layout } from '@/constants/Layout';

export default function AssignmentsScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const [assignments, setAssignments] = useState<Assignment[]>(MOCK_ASSIGNMENTS);
  const [selectedTab, setSelectedTab] = useState<'All' | 'Active' | 'Graded'>('All');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Physics');
  const [grade, setGrade] = useState('Grade 11-A');
  const [dueDate, setDueDate] = useState('2026-09-15');
  const [totalMarks, setTotalMarks] = useState('50');
  const [description, setDescription] = useState('');

  const filtered = assignments.filter((item) => {
    if (selectedTab === 'All') return true;
    return item.status === selectedTab;
  });

  const handleCreate = () => {
    if (!title.trim()) return;

    const newAsn: Assignment = {
      id: `ASN-${Date.now()}`,
      title,
      subject,
      grade,
      section: 'A',
      dueDate,
      assignedDate: '2026-09-05',
      totalMarks: Number(totalMarks) || 50,
      submissionsCount: 0,
      totalStudents: 32,
      status: 'Active',
      description,
    };

    setAssignments([newAsn, ...assignments]);
    setShowCreateModal(false);
    setTitle('');
    setDescription('');
  };

  const handleAIGenerate = () => {
    setTitle('Wave Optics & Polarisation Analytical Problems');
    setSubject('Physics');
    setGrade('Grade 12-A');
    setTotalMarks('40');
    setDescription(
      'AI Generated: 1. Explain Brewster\'s law with ray diagram. 2. Calculate the thickness of a quarter wave plate for wavelength 589nm. 3. Derive condition for constructive interference.'
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <SMHeader
        title="Assignments"
        subtitle="Homework, Projects & Evaluation"
        showBack
        rightAction={
          <SMButton
            title="+ Create"
            onPress={() => setShowCreateModal(true)}
            variant="primary"
            size="sm"
          />
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Filter Tabs */}
        <View style={[styles.tabBar, { backgroundColor: colors.surfaceVariant }]}>
          {(['All', 'Active', 'Graded'] as const).map((tab) => {
            const isSelected = selectedTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                onPress={() => setSelectedTab(tab)}
                style={[
                  styles.tabBtn,
                  isSelected && { backgroundColor: colors.card, ...Layout.shadows.sm },
                ]}
              >
                <Text
                  style={[
                    styles.tabBtnText,
                    { color: isSelected ? colors.primary : colors.textSecondary },
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* AI Quick Generator Chip */}
        <TouchableOpacity
          onPress={() => {
            setShowCreateModal(true);
            handleAIGenerate();
          }}
          activeOpacity={0.8}
          style={[styles.aiChipBanner, { backgroundColor: colors.aiContainer, borderColor: colors.aiBorder }]}
        >
          <Ionicons name="sparkles" size={18} color={colors.accent} />
          <Text style={[styles.aiChipText, { color: colors.primaryDark }]}>
            SMANV AI: Auto-generate Homework & Marking Rubric →
          </Text>
        </TouchableOpacity>

        {/* Assignments List */}
        <View style={styles.list}>
          {filtered.map((asn) => {
            const percent = Math.round((asn.submissionsCount / asn.totalStudents) * 100);

            return (
              <SMCard key={asn.id} elevation="sm" padding="md" style={styles.asnCard}>
                <View style={styles.cardHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.asnTitle, { color: colors.textPrimary }]}>
                      {asn.title}
                    </Text>
                    <Text style={[styles.asnSub, { color: colors.primary }]}>
                      {asn.subject} • {asn.grade}
                    </Text>
                  </View>
                  <SMBadge
                    label={asn.status}
                    variant={asn.status === 'Active' ? 'warning' : 'success'}
                    size="sm"
                  />
                </View>

                <Text style={[styles.asnDesc, { color: colors.textSecondary }]}>
                  {asn.description}
                </Text>

                <View style={styles.progressSection}>
                  <SMProgressBar
                    progress={percent}
                    label={`Submissions: ${asn.submissionsCount} of ${asn.totalStudents} Students`}
                    valueText={`${percent}%`}
                    color={percent === 100 ? colors.success : colors.primary}
                  />
                </View>

                <View style={[styles.footerRow, { borderTopColor: colors.borderLight }]}>
                  <Text style={[styles.dueText, { color: colors.textTertiary }]}>
                    Due: {asn.dueDate} • Max Marks: {asn.totalMarks}
                  </Text>
                  <TouchableOpacity style={styles.actionBtn}>
                    <Text style={[styles.actionBtnText, { color: colors.primary }]}>
                      Evaluate Submissions →
                    </Text>
                  </TouchableOpacity>
                </View>
              </SMCard>
            );
          })}
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>

      {/* Create Assignment Modal */}
      <SMBottomSheet
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Publish Assignment"
        subtitle="Distribute to class portals instantly"
      >
        <TouchableOpacity onPress={handleAIGenerate} style={styles.autoFillBtn}>
          <Ionicons name="sparkles" size={14} color={colors.accent} />
          <Text style={[styles.autoFillText, { color: colors.primary }]}>
            Auto-generate with SMANV AI
          </Text>
        </TouchableOpacity>

        <SMInput
          label="Assignment Title"
          placeholder="e.g. Electromagnetic Induction Problem Set"
          value={title}
          onChangeText={setTitle}
          required
        />

        <View style={{ flexDirection: 'row', gap: 12 }}>
          <SMInput
            label="Subject"
            value={subject}
            onChangeText={setSubject}
            containerStyle={{ flex: 1 }}
          />
          <SMInput
            label="Class / Grade"
            value={grade}
            onChangeText={setGrade}
            containerStyle={{ flex: 1 }}
          />
        </View>

        <View style={{ flexDirection: 'row', gap: 12 }}>
          <SMInput
            label="Submission Due Date"
            value={dueDate}
            onChangeText={setDueDate}
            containerStyle={{ flex: 1 }}
          />
          <SMInput
            label="Total Marks"
            value={totalMarks}
            onChangeText={setTotalMarks}
            keyboardType="numeric"
            containerStyle={{ flex: 1 }}
          />
        </View>

        <SMInput
          label="Instructions / Problem Description"
          placeholder="Enter problem set or reference book chapters..."
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <SMButton
          title="Publish Assignment"
          onPress={handleCreate}
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
    fontSize: 12,
    fontWeight: '700',
  },
  aiChipBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: Layout.borderRadius.md,
    borderWidth: 1,
    marginBottom: Layout.spacing.sm,
  },
  aiChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  list: {
    gap: 10,
  },
  asnCard: {
    borderRadius: Layout.borderRadius.xl,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  asnTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  asnSub: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 1,
  },
  asnDesc: {
    fontSize: 12,
    lineHeight: 18,
    marginVertical: 6,
  },
  progressSection: {
    marginVertical: 4,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
  },
  dueText: {
    fontSize: 11,
  },
  actionBtn: {
    paddingVertical: 4,
  },
  actionBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
  autoFillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
    alignSelf: 'flex-end',
  },
  autoFillText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
