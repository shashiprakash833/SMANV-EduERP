/**
 * SMANV EduERP Reports & Performance Analytics
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
import { SMBarChart, SMProgressBar } from '@/components/SMChart';
import { SMDialog } from '@/components/SMDialog';
import { Layout } from '@/constants/Layout';

export default function ReportsScreen() {
  const { colors } = useTheme();

  const [activeCategory, setActiveCategory] = useState<'All' | 'Academic' | 'Financial' | 'Attendance'>('All');
  const [showExportSuccess, setShowExportSuccess] = useState<string | null>(null);

  const feeMonthlyData = [
    { label: 'May', value: 42, formattedValue: '₹42L' },
    { label: 'Jun', value: 65, formattedValue: '₹65L' },
    { label: 'Jul', value: 88, formattedValue: '₹88L' },
    { label: 'Aug', value: 110, formattedValue: '₹1.1Cr' },
    { label: 'Sep', value: 184, formattedValue: '₹1.84Cr', color: colors.primary },
  ];

  const gradeDistributionData = [
    { label: 'A+ (90%+)', value: 340, formattedValue: '340', color: colors.success },
    { label: 'A (80-89%)', value: 820, formattedValue: '820' },
    { label: 'B (70-79%)', value: 910, formattedValue: '910' },
    { label: 'C (60-69%)', value: 280, formattedValue: '280', color: colors.warning },
    { label: 'Needs Support', value: 100, formattedValue: '100', color: colors.error },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <SMHeader
        title="Reports & Analytics"
        subtitle="Institutional Intelligence & Audit Trails"
        showBack
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Category Selector */}
        <View style={[styles.tabBar, { backgroundColor: colors.surfaceVariant }]}>
          {(['All', 'Academic', 'Financial', 'Attendance'] as const).map((cat) => {
            const isSelected = activeCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                onPress={() => setActiveCategory(cat)}
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
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Export Document Actions */}
        <View style={styles.exportRow}>
          <SMButton
            title="Export PDF Report"
            onPress={() => setShowExportSuccess('PDF')}
            variant="outline"
            size="sm"
            icon={<Ionicons name="document-outline" size={16} color={colors.primary} />}
            style={{ flex: 1 }}
          />
          <SMButton
            title="Export Excel (XLSX)"
            onPress={() => setShowExportSuccess('Excel')}
            variant="outline"
            size="sm"
            icon={<Ionicons name="grid-outline" size={16} color={colors.primary} />}
            style={{ flex: 1 }}
          />
        </View>

        {/* 1. Financial Trend Chart */}
        {(activeCategory === 'All' || activeCategory === 'Financial') && (
          <SMCard elevation="sm" padding="md" style={styles.chartCard}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                  Monthly Fee Collections (FY 2026-27)
                </Text>
                <Text style={[styles.cardSub, { color: colors.textSecondary }]}>
                  Net fee recovery per calendar month
                </Text>
              </View>
              <SMBadge label="+18% vs Last Year" variant="success" size="sm" />
            </View>
            <SMBarChart data={feeMonthlyData} height={150} />
          </SMCard>
        )}

        {/* 2. Academic Score Distribution */}
        {(activeCategory === 'All' || activeCategory === 'Academic') && (
          <SMCard elevation="sm" padding="md" style={styles.chartCard}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                  School-Wide Academic Grade Distribution
                </Text>
                <Text style={[styles.cardSub, { color: colors.textSecondary }]}>
                  Based on Term 1 internal assessments
                </Text>
              </View>
              <SMBadge label="2,450 Scholars" variant="primary" size="sm" />
            </View>
            <SMBarChart data={gradeDistributionData} height={150} />
          </SMCard>
        )}

        {/* 3. Campus Attendance Overview */}
        {(activeCategory === 'All' || activeCategory === 'Attendance') && (
          <SMCard elevation="sm" padding="md" style={styles.chartCard}>
            <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
              Campus Attendance Audit
            </Text>
            <Text style={[styles.cardSub, { color: colors.textSecondary }]}>
              Regulated under CBSE & Directorate of Education Standards
            </Text>

            <View style={{ marginTop: 12, gap: 8 }}>
              <SMProgressBar
                progress={96.2}
                label="Senior Secondary (Grade 11-12)"
                valueText="96.2%"
                color={colors.success}
              />
              <SMProgressBar
                progress={93.8}
                label="Secondary Wing (Grade 9-10)"
                valueText="93.8%"
                color={colors.primary}
              />
              <SMProgressBar
                progress={97.4}
                label="Faculty & Instructional Staff"
                valueText="97.4%"
                color={colors.secondaryDark}
              />
            </View>
          </SMCard>
        )}

        <View style={{ height: 60 }} />
      </ScrollView>

      {/* Export Confirmation Dialog */}
      <SMDialog
        visible={showExportSuccess !== null}
        title="Report Generated"
        message={`Official SMANV EduERP ${showExportSuccess} audit package has been prepared with digital cryptographic watermark. Dispatched to administrator email.`}
        confirmText="Download File"
        cancelText="Close"
        onConfirm={() => setShowExportSuccess(null)}
        onCancel={() => setShowExportSuccess(null)}
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
  exportRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: Layout.spacing.sm,
  },
  chartCard: {
    borderRadius: Layout.borderRadius.xl,
    marginBottom: Layout.spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  cardSub: {
    fontSize: 11,
    marginTop: 2,
  },
});
