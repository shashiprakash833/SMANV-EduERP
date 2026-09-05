/**
 * SMANV EduERP Fee Management & Financial Records
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
import { SMButton } from '../components/SMButton';
import { SMBadge } from '../components/SMBadge';
import { SMSearchBar } from '../components/SMSearchBar';
import { SMBottomSheet } from '../components/SMBottomSheet';
import { SMDialog } from '../components/SMDialog';
import { SMInput } from '../components/SMInput';
import { SMProgressBar } from '../components/SMChart';
import { MOCK_FEES } from '../constants/MockData';
import { FeeRecord } from '../types';
import { Layout } from '../constants/Layout';

export default function FeeManagementScreen() {
  const { colors } = useTheme();

  const [fees, setFees] = useState<FeeRecord[]>(MOCK_FEES);
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Paid' | 'Pending' | 'Overdue'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCollectModal, setShowCollectModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<FeeRecord | null>(null);
  const [showReminderToast, setShowReminderToast] = useState(false);

  // New Collection Form
  const [studentName, setStudentName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<'Tuition' | 'Transport' | 'Laboratory' | 'Annual'>('Tuition');
  const [paymentMode, setPaymentMode] = useState<'UPI' | 'Online' | 'Cash'>('UPI');

  const filtered = fees.filter((f) => {
    const matchesFilter = selectedFilter === 'All' || f.status === selectedFilter;
    const matchesSearch =
      f.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleRecordPayment = () => {
    if (!studentName.trim() || !amount.trim()) return;

    const newFee: FeeRecord = {
      id: `FEE-${Date.now()}`,
      receiptNumber: `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      studentId: 'STU-NEW',
      studentName,
      grade: 'Grade 11',
      section: 'A',
      category,
      amount: Number(amount) || 25000,
      dueDate: '2026-09-05',
      paidDate: '2026-09-05',
      status: 'Paid',
      paymentMode,
      qrCode: `SMANV-FEE-REC-PAID-${Date.now()}`,
    };

    setFees([newFee, ...fees]);
    setShowCollectModal(false);
    setSelectedReceipt(newFee);
    setStudentName('');
    setAmount('');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <SMHeader
        title="Fee Management"
        subtitle="Accounts, Invoicing & Bank Reconciliation"
        showBack
        rightAction={
          <SMButton
            title="+ Collect"
            onPress={() => setShowCollectModal(true)}
            variant="primary"
            size="sm"
          />
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* KPI Financial Overview */}
        <SMCard elevation="sm" padding="md" style={styles.kpiCard}>
          <Text style={[styles.kpiTitle, { color: colors.textPrimary }]}>
            Term 2 Fee Realisation Summary
          </Text>
          <SMProgressBar
            progress={86.4}
            label="Total Collected: ₹1,84,30,000 / ₹2,13,25,000"
            valueText="86.4%"
            color={colors.primary}
            style={{ marginTop: 8 }}
          />

          <View style={styles.metricsRow}>
            <View style={[styles.metricBox, { backgroundColor: colors.surfaceVariant }]}>
              <Text style={[styles.metricVal, { color: colors.success }]}>₹1.84 Cr</Text>
              <Text style={[styles.metricSub, { color: colors.textSecondary }]}>Realised</Text>
            </View>
            <View style={[styles.metricBox, { backgroundColor: colors.surfaceVariant }]}>
              <Text style={[styles.metricVal, { color: colors.error }]}>₹28.95 L</Text>
              <Text style={[styles.metricSub, { color: colors.textSecondary }]}>Pending Dues</Text>
            </View>
            <View style={[styles.metricBox, { backgroundColor: colors.surfaceVariant }]}>
              <Text style={[styles.metricVal, { color: colors.warning }]}>84</Text>
              <Text style={[styles.metricSub, { color: colors.textSecondary }]}>Defaulters</Text>
            </View>
          </View>
        </SMCard>

        {/* Search and Filters */}
        <SMSearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by student or receipt #..."
        />

        <View style={[styles.filterBar, { backgroundColor: colors.surfaceVariant }]}>
          {(['All', 'Paid', 'Pending', 'Overdue'] as const).map((filter) => {
            const isSelected = selectedFilter === filter;
            return (
              <TouchableOpacity
                key={filter}
                onPress={() => setSelectedFilter(filter)}
                style={[
                  styles.filterBtn,
                  isSelected && { backgroundColor: colors.card, ...Layout.shadows.sm },
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    { color: isSelected ? colors.primary : colors.textSecondary },
                  ]}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Fees Invoices List */}
        <View style={styles.list}>
          {filtered.map((item) => (
            <SMCard
              key={item.id}
              onPress={() => setSelectedReceipt(item)}
              elevation="sm"
              padding="md"
              style={styles.recordCard}
            >
              <View style={styles.cardTop}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.studentName, { color: colors.textPrimary }]}>
                    {item.studentName}
                  </Text>
                  <Text style={[styles.receiptSub, { color: colors.textSecondary }]}>
                    {item.receiptNumber} • {item.category} ({item.grade})
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={[styles.amountText, { color: colors.textPrimary }]}>
                    ₹{item.amount.toLocaleString()}
                  </Text>
                  <SMBadge
                    label={item.status}
                    variant={item.status === 'Paid' ? 'success' : item.status === 'Pending' ? 'warning' : 'error'}
                    size="sm"
                  />
                </View>
              </View>

              {item.status !== 'Paid' && (
                <View style={styles.defaulterActionRow}>
                  <Text style={[styles.dueNotice, { color: colors.error }]}>
                    Due by: {item.dueDate}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowReminderToast(true)}
                    style={[styles.remindBtn, { backgroundColor: colors.warningContainer }]}
                  >
                    <Ionicons name="logo-whatsapp" size={14} color={colors.warning} />
                    <Text style={[styles.remindBtnText, { color: colors.warning }]}>
                      WhatsApp Reminder
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </SMCard>
          ))}
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>

      {/* Collect Fee Bottom Sheet */}
      <SMBottomSheet
        visible={showCollectModal}
        onClose={() => setShowCollectModal(false)}
        title="Collect Student Fee"
        subtitle="Issue official receipt with instant verification QR"
      >
        <SMInput
          label="Student Full Name"
          placeholder="e.g. Diya Patel (Grade 10-A)"
          value={studentName}
          onChangeText={setStudentName}
          required
        />

        <SMInput
          label="Collection Amount (INR)"
          placeholder="e.g. 18500"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          required
        />

        {/* Fee Category Selector */}
        <View style={styles.selectorBlock}>
          <Text style={[styles.selectorLabel, { color: colors.textPrimary }]}>Fee Category *</Text>
          <View style={styles.chipsRow}>
            {(['Tuition', 'Transport', 'Laboratory', 'Annual'] as const).map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() => setCategory(cat)}
                style={[
                  styles.optionChip,
                  {
                    backgroundColor: category === cat ? colors.primaryContainer : colors.surface,
                    borderColor: category === cat ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.optionChipText,
                    { color: category === cat ? colors.primaryDark : colors.textPrimary },
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Payment Mode */}
        <View style={styles.selectorBlock}>
          <Text style={[styles.selectorLabel, { color: colors.textPrimary }]}>Payment Mode *</Text>
          <View style={styles.chipsRow}>
            {(['UPI', 'Online', 'Cash'] as const).map((mode) => (
              <TouchableOpacity
                key={mode}
                onPress={() => setPaymentMode(mode)}
                style={[
                  styles.optionChip,
                  {
                    backgroundColor: paymentMode === mode ? colors.primaryContainer : colors.surface,
                    borderColor: paymentMode === mode ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.optionChipText,
                    { color: paymentMode === mode ? colors.primaryDark : colors.textPrimary },
                  ]}
                >
                  {mode}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <SMButton
          title="Confirm & Generate Receipt"
          onPress={handleRecordPayment}
          variant="primary"
          size="lg"
          fullWidth
          style={{ marginTop: 16 }}
        />
      </SMBottomSheet>

      {/* Digital Receipt Modal */}
      <SMBottomSheet
        visible={selectedReceipt !== null}
        onClose={() => setSelectedReceipt(null)}
        title="Official Fee Receipt"
        subtitle={selectedReceipt?.receiptNumber}
      >
        {selectedReceipt && (
          <View style={[styles.receiptContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.receiptTop}>
              <Ionicons name="receipt-outline" size={32} color={colors.primary} />
              <Text style={[styles.receiptHeading, { color: colors.textPrimary }]}>
                SMANV the schools
              </Text>
              <Text style={[styles.receiptStatusText, { color: colors.success }]}>
                ✓ PAYMENT VERIFIED & RECORDED
              </Text>
            </View>

            <View style={[styles.receiptRows, { backgroundColor: colors.surfaceVariant }]}>
              <Text style={[styles.receiptDetail, { color: colors.textPrimary }]}>
                <Text style={{ fontWeight: '700' }}>Student: </Text>{selectedReceipt.studentName}
              </Text>
              <Text style={[styles.receiptDetail, { color: colors.textPrimary }]}>
                <Text style={{ fontWeight: '700' }}>Receipt #: </Text>{selectedReceipt.receiptNumber}
              </Text>
              <Text style={[styles.receiptDetail, { color: colors.textPrimary }]}>
                <Text style={{ fontWeight: '700' }}>Category: </Text>{selectedReceipt.category} Fee
              </Text>
              <Text style={[styles.receiptDetail, { color: colors.textPrimary }]}>
                <Text style={{ fontWeight: '700' }}>Amount Paid: </Text>₹{selectedReceipt.amount.toLocaleString()}
              </Text>
              <Text style={[styles.receiptDetail, { color: colors.textPrimary }]}>
                <Text style={{ fontWeight: '700' }}>Mode: </Text>{selectedReceipt.paymentMode || 'UPI'}
              </Text>
            </View>

            {/* Receipt QR Code */}
            <View style={styles.receiptQRBlock}>
              <Ionicons name="qr-code" size={72} color={colors.primary} />
              <Text style={[styles.receiptQRText, { color: colors.textTertiary }]}>
                {selectedReceipt.qrCode}
              </Text>
            </View>

            <SMButton
              title="Close Receipt"
              onPress={() => setSelectedReceipt(null)}
              variant="outline"
              size="md"
              fullWidth
            />
          </View>
        )}
      </SMBottomSheet>

      {/* Reminder Sent Dialog */}
      <SMDialog
        visible={showReminderToast}
        title="Fee Reminder Dispatched"
        message="An automated WhatsApp fee notification with UPI direct payment link has been delivered to the student's guardian."
        confirmText="Done"
        onConfirm={() => setShowReminderToast(false)}
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
  kpiCard: {
    borderRadius: Layout.borderRadius.xl,
    marginBottom: Layout.spacing.sm,
  },
  kpiTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  metricBox: {
    flex: 1,
    padding: 8,
    borderRadius: Layout.borderRadius.md,
    alignItems: 'center',
  },
  metricVal: {
    fontSize: 15,
    fontWeight: '800',
  },
  metricSub: {
    fontSize: 10,
    marginTop: 2,
  },
  filterBar: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: Layout.borderRadius.md,
    marginBottom: Layout.spacing.sm,
  },
  filterBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: Layout.borderRadius.sm,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '700',
  },
  list: {
    gap: 8,
  },
  recordCard: {
    borderRadius: Layout.borderRadius.lg,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  studentName: {
    fontSize: 14,
    fontWeight: '700',
  },
  receiptSub: {
    fontSize: 11,
    marginTop: 2,
  },
  amountText: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
  },
  defaulterActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  dueNotice: {
    fontSize: 11,
    fontWeight: '600',
  },
  remindBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: Layout.borderRadius.full,
  },
  remindBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
  selectorBlock: {
    marginBottom: Layout.spacing.md,
  },
  selectorLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: Layout.borderRadius.full,
    borderWidth: 1,
  },
  optionChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  receiptContainer: {
    borderRadius: Layout.borderRadius.lg,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  receiptTop: {
    alignItems: 'center',
    gap: 4,
  },
  receiptHeading: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  receiptStatusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  receiptRows: {
    padding: 12,
    borderRadius: Layout.borderRadius.md,
    gap: 4,
  },
  receiptDetail: {
    fontSize: 12,
  },
  receiptQRBlock: {
    alignItems: 'center',
    padding: 8,
    gap: 4,
  },
  receiptQRText: {
    fontSize: 9,
    fontWeight: '700',
  },
});
