/**
 * SMANV EduERP Help & Support Center
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
import { SMDialog } from '@/components/SMDialog';
import { SMANV_BRAND } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';

export default function HelpScreen() {
  const { colors } = useTheme();

  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(0);
  const [showTicketModal, setShowTicketModal] = useState(false);

  const faqs = [
    {
      q: 'How does SMANV AI generate attendance interventions?',
      a: 'SMANV AI tracks continuous attendance patterns across 14-day rolling windows. If any cohort or student dips below the 75% regulatory criteria, predictive notifications are triggered for guardians and mentors.',
    },
    {
      q: 'Can teachers record marks and attendance in offline mode?',
      a: 'Yes. SMANV EduERP incorporates an offline pending queue. Attendance and marks recorded without an active internet connection are stored securely locally and synced automatically once connectivity is restored.',
    },
    {
      q: 'How are student fee receipts authenticated?',
      a: 'Every receipt generated through SMANV EduERP carries an encrypted QR code with HMAC verification. Parents and auditors can scan the QR code to verify payment authenticity directly on the server.',
    },
    {
      q: 'How do I download examination hall tickets?',
      a: 'Navigate to the Examinations module, select the active term (e.g. Mid-Term 2026), and tap "Download Hall Ticket". The digital admit card includes student details and examination center coordinates.',
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <SMHeader
        title="Help & Support"
        subtitle="FAQs, Ticket Desk & Knowledge Base"
        showBack
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Support Hotline Banner */}
        <SMCard elevation="sm" padding="md" style={styles.supportBanner}>
          <View style={styles.hotlineRow}>
            <View style={[styles.phoneBubble, { backgroundColor: colors.primaryContainer }]}>
              <Ionicons name="headset-outline" size={24} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.hotlineTitle, { color: colors.textPrimary }]}>
                SMANV Enterprise Desk
              </Text>
              <Text style={[styles.hotlineSub, { color: colors.textSecondary }]}>
                Dedicated 24/7 institutional technical assistance
              </Text>
            </View>
          </View>

          <View style={styles.btnRow}>
            <SMButton
              title="Raise Ticket"
              onPress={() => setShowTicketModal(true)}
              variant="primary"
              size="sm"
              icon={<Ionicons name="create-outline" size={16} color="#FFFFFF" />}
              style={{ flex: 1 }}
            />
            <SMButton
              title="Email Support"
              onPress={() => {}}
              variant="outline"
              size="sm"
              icon={<Ionicons name="mail-outline" size={16} color={colors.primary} />}
              style={{ flex: 1 }}
            />
          </View>
        </SMCard>

        {/* FAQs Section */}
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          Frequently Asked Questions
        </Text>

        <View style={styles.faqsList}>
          {faqs.map((faq, index) => {
            const isExpanded = expandedFAQ === index;
            return (
              <SMCard
                key={faq.q}
                onPress={() => setExpandedFAQ(isExpanded ? null : index)}
                elevation="sm"
                padding="md"
                style={styles.faqCard}
              >
                <View style={styles.faqHeader}>
                  <Text style={[styles.faqQuestion, { color: colors.textPrimary }]}>
                    {faq.q}
                  </Text>
                  <Ionicons
                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color={colors.textSecondary}
                  />
                </View>

                {isExpanded && (
                  <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>
                    {faq.a}
                  </Text>
                )}
              </SMCard>
            );
          })}
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>

      {/* Support Ticket Modal */}
      <SMDialog
        visible={showTicketModal}
        title="Support Ticket Dispatched"
        message="Your service request has been logged with SMANV Info Tech Helpdesk (Ticket #HD-8902). An enterprise customer engineer will contact your administration within 2 hours."
        confirmText="Understood"
        onConfirm={() => setShowTicketModal(false)}
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
  supportBanner: {
    borderRadius: Layout.borderRadius.xl,
    marginBottom: Layout.spacing.md,
  },
  hotlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  phoneBubble: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hotlineTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  hotlineSub: {
    fontSize: 12,
    marginTop: 2,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginVertical: Layout.spacing.sm,
  },
  faqsList: {
    gap: 8,
  },
  faqCard: {
    borderRadius: Layout.borderRadius.lg,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },
  faqAnswer: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
});
