/**
 * SMANV EduERP Dynamic Role-Based Enterprise Dashboard
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
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../store/AuthContext';
import { useTheme } from '../../store/ThemeContext';
import { SMHeader } from '../../components/SMHeader';
import { SMCard } from '../../components/SMCard';
import { SMButton } from '../../components/SMButton';
import { SMBadge } from '../../components/SMBadge';
import { SMAvatar } from '../../components/SMAvatar';
import { SMSearchBar } from '../../components/SMSearchBar';
import { SMFAB } from '../../components/SMFAB';
import { SMBarChart, SMProgressBar } from '../../components/SMChart';
import {
  MOCK_CLASS_SESSIONS,
  MOCK_ASSIGNMENTS,
  MOCK_AI_INSIGHTS,
  MOCK_ACTIVITIES,
  MOCK_ANNOUNCEMENTS,
  MOCK_FEES,
} from '../../constants/MockData';
import { Layout } from '../../constants/Layout';
import { UserRole } from '../../types';

export default function DashboardScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { user, organization, role, switchDemoRole } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'insights'>('overview');

  // Quick Action Grid Items for Org Admin
  const adminQuickActions = [
    { title: 'Admissions', icon: 'person-add-outline', route: '/admissions', count: '48 New', color: colors.info },
    { title: 'Students', icon: 'people-outline', route: '/students', count: '2,450', color: colors.primary },
    { title: 'Staff', icon: 'briefcase-outline', route: '/staff', count: '182', color: colors.secondaryDark },
    { title: 'Attendance', icon: 'finger-print-outline', route: '/attendance', count: '95.0%', color: colors.success },
    { title: 'Academics', icon: 'school-outline', route: '/(tabs)/academics', count: 'Active', color: colors.primaryDark },
    { title: 'Assignments', icon: 'document-text-outline', route: '/assignments', count: '14 Live', color: colors.warning },
    { title: 'Examinations', icon: 'medal-outline', route: '/examinations', count: 'Term 1', color: colors.error },
    { title: 'Fee Management', icon: 'cash-outline', route: '/fees', count: '₹1.84 Cr', color: colors.primary },
    { title: 'Reports', icon: 'bar-chart-outline', route: '/reports', count: 'Analytics', color: colors.info },
    { title: 'AI Assistant', icon: 'sparkles', route: '/ai-assistant', count: 'Copilot', color: colors.accent },
  ];

  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return 'Good Morning';
    if (hours < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const attendanceChartData = [
    { label: 'Gr 8', value: 96, formattedValue: '96%' },
    { label: 'Gr 9', value: 89, formattedValue: '89%', color: colors.warning },
    { label: 'Gr 10', value: 94, formattedValue: '94%' },
    { label: 'Gr 11', value: 97, formattedValue: '97%' },
    { label: 'Gr 12', value: 99, formattedValue: '99%', color: colors.success },
  ];

  // Role Switcher Chips
  const rolesList: { key: UserRole; label: string }[] = [
    { key: 'org_admin', label: 'Org Admin' },
    { key: 'staff', label: 'Teacher / Staff' },
    { key: 'student', label: 'Student' },
    { key: 'parent', label: 'Parent' },
    { key: 'finance', label: 'Finance & HR' },
    { key: 'super_admin', label: 'Super Admin' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Header */}
      <SMHeader showOrgBadge showNotificationIcon showAvatar />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Interactive Role Switcher Banner */}
        <View style={[styles.roleSwitcherBar, { backgroundColor: colors.surfaceVariant }]}>
          <Text style={[styles.roleSwitcherLabel, { color: colors.textSecondary }]}>
            Preview Role:
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.roleChipsRow}>
            {rolesList.map((r) => {
              const isSelected = role === r.key;
              return (
                <TouchableOpacity
                  key={r.key}
                  onPress={() => switchDemoRole(r.key)}
                  style={[
                    styles.roleChip,
                    {
                      backgroundColor: isSelected ? colors.primary : colors.card,
                      borderColor: isSelected ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.roleChipText,
                      { color: isSelected ? '#FFFFFF' : colors.textPrimary },
                    ]}
                  >
                    {r.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* User Greeting Section */}
        <View style={styles.greetingRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.greetingText, { color: colors.textSecondary }]}>
              {getGreeting()},
            </Text>
            <Text style={[styles.userName, { color: colors.textPrimary }]}>
              {user?.name}
            </Text>
            <Text style={[styles.userDesignation, { color: colors.primary }]}>
              {user?.designation || organization.name}
            </Text>
          </View>
          <SMAvatar name={user?.name || 'User'} size="lg" status="online" />
        </View>

        {/* Global Search Bar */}
        <SMSearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search students, faculty, fees, reports..."
          onFilterPress={() => router.push('/students')}
        />

        {/* ========================================================================= */}
        {/* 1. ORGANIZATION ADMIN DASHBOARD */}
        {/* ========================================================================= */}
        {role === 'org_admin' && (
          <>
            {/* KPI Statistics Row */}
            <View style={styles.statsGrid}>
              <SMCard
                onPress={() => router.push('/students')}
                style={styles.statCard}
                padding="sm"
              >
                <View style={[styles.statIconWrapper, { backgroundColor: colors.primaryContainer }]}>
                  <Ionicons name="people" size={20} color={colors.primary} />
                </View>
                <Text style={[styles.statValue, { color: colors.textPrimary }]}>2,450</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Students</Text>
                <Text style={[styles.statTrend, { color: colors.success }]}>↑ +8.4% YoY</Text>
              </SMCard>

              <SMCard
                onPress={() => router.push('/staff')}
                style={styles.statCard}
                padding="sm"
              >
                <View style={[styles.statIconWrapper, { backgroundColor: colors.secondaryContainer }]}>
                  <Ionicons name="briefcase" size={20} color={colors.secondaryDark} />
                </View>
                <Text style={[styles.statValue, { color: colors.textPrimary }]}>182</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Faculty</Text>
                <Text style={[styles.statTrend, { color: colors.primary }]}>98% Active</Text>
              </SMCard>

              <SMCard
                onPress={() => router.push('/attendance')}
                style={styles.statCard}
                padding="sm"
              >
                <View style={[styles.statIconWrapper, { backgroundColor: colors.successContainer }]}>
                  <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                </View>
                <Text style={[styles.statValue, { color: colors.textPrimary }]}>95.0%</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Today's Presence</Text>
                <Text style={[styles.statTrend, { color: colors.success }]}>↑ +1.2%</Text>
              </SMCard>

              <SMCard
                onPress={() => router.push('/fees')}
                style={styles.statCard}
                padding="sm"
              >
                <View style={[styles.statIconWrapper, { backgroundColor: colors.warningContainer }]}>
                  <Ionicons name="cash" size={20} color={colors.warning} />
                </View>
                <Text style={[styles.statValue, { color: colors.textPrimary }]}>86.4%</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Fee Recovery</Text>
                <Text style={[styles.statTrend, { color: colors.info }]}>₹1.84 Cr</Text>
              </SMCard>
            </View>

            {/* SMANV AI Insight Banner */}
            <TouchableOpacity
              onPress={() => router.push('/ai-assistant')}
              activeOpacity={0.9}
              style={[styles.aiInsightCard, Layout.shadows.md]}
            >
              <LinearGradient
                colors={[colors.aiGradientStart, colors.aiGradientMid, colors.aiGradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.aiInsightGradient}
              >
                <View style={styles.aiHeaderRow}>
                  <View style={styles.aiBadge}>
                    <Ionicons name="sparkles" size={14} color="#FEF08A" />
                    <Text style={styles.aiBadgeText}>SMANV AI Insights</Text>
                  </View>
                  <Text style={styles.aiActionLink}>Ask SMANV AI →</Text>
                </View>

                <Text style={styles.aiTitle}>Attendance Intervention Alert</Text>
                <Text style={styles.aiDescription}>
                  14 students in Grade 9-C have fallen below the 75% attendance threshold. Automated counseling notifications are prepared.
                </Text>

                <View style={styles.aiFooterRow}>
                  <Text style={styles.aiMetricChip}>Metric: 14 At-Risk</Text>
                  <View style={styles.aiButtonMini}>
                    <Text style={styles.aiButtonMiniText}>Review Grade 9-C</Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            {/* Quick Actions Grid */}
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                Quick Actions
              </Text>
              <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
                10 Connected ERP Modules
              </Text>
            </View>

            <View style={styles.quickGrid}>
              {adminQuickActions.map((action, idx) => (
                <TouchableOpacity
                  key={`qa-${idx}`}
                  onPress={() => router.push(action.route as any)}
                  activeOpacity={0.7}
                  style={[
                    styles.quickActionTile,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.cardBorder,
                    },
                    Layout.shadows.sm,
                  ]}
                >
                  <View style={[styles.actionIconCircle, { backgroundColor: `${action.color}15` }]}>
                    <Ionicons name={action.icon as any} size={22} color={action.color} />
                  </View>
                  <Text style={[styles.actionTitle, { color: colors.textPrimary }]} numberOfLines={1}>
                    {action.title}
                  </Text>
                  <Text style={[styles.actionCount, { color: colors.textSecondary }]}>
                    {action.count}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Attendance Analytics Preview */}
            <SMCard elevation="sm" padding="md" style={styles.sectionCard}>
              <View style={styles.cardHeaderRow}>
                <View>
                  <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                    Classwise Attendance Rate
                  </Text>
                  <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
                    Real-time biometric & teacher logs
                  </Text>
                </View>
                <TouchableOpacity onPress={() => router.push('/attendance')}>
                  <Text style={[styles.viewAllText, { color: colors.primary }]}>View Details →</Text>
                </TouchableOpacity>
              </View>
              <SMBarChart data={attendanceChartData} height={140} />
            </SMCard>

            {/* Recent Activities Feed */}
            <SMCard elevation="sm" padding="md" style={styles.sectionCard}>
              <View style={styles.cardHeaderRow}>
                <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                  Recent Activities
                </Text>
                <SMBadge label="Live Feed" variant="success" size="sm" dot />
              </View>

              {MOCK_ACTIVITIES.slice(0, 3).map((act) => (
                <View key={act.id} style={[styles.activityItem, { borderBottomColor: colors.borderLight }]}>
                  <View style={[styles.actIconBubble, { backgroundColor: colors.surfaceVariant }]}>
                    <Ionicons name={act.icon as any} size={16} color={colors.primary} />
                  </View>
                  <View style={styles.actTextCol}>
                    <Text style={[styles.actTitle, { color: colors.textPrimary }]}>{act.title}</Text>
                    <Text style={[styles.actMeta, { color: colors.textTertiary }]}>
                      {act.user} • {act.timestamp}
                    </Text>
                  </View>
                </View>
              ))}
            </SMCard>
          </>
        )}

        {/* ========================================================================= */}
        {/* 2. STAFF / TEACHER DASHBOARD */}
        {/* ========================================================================= */}
        {role === 'staff' && (
          <>
            <SMCard elevation="sm" padding="md" style={styles.sectionCard}>
              <View style={styles.cardHeaderRow}>
                <View>
                  <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                    Today's Class Schedule
                  </Text>
                  <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
                    4 lectures scheduled for Prof. Priya Nair
                  </Text>
                </View>
                <SMBadge label="In Session" variant="info" size="sm" />
              </View>

              {MOCK_CLASS_SESSIONS.map((session) => (
                <View
                  key={session.id}
                  style={[
                    styles.timelineCard,
                    {
                      backgroundColor: session.status === 'Ongoing' ? colors.primaryContainer : colors.surface,
                      borderColor: session.status === 'Ongoing' ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <View style={styles.periodCol}>
                    <Text style={[styles.periodNumber, { color: colors.primaryDark }]}>
                      P{session.period}
                    </Text>
                    <Text style={[styles.periodTime, { color: colors.textSecondary }]}>
                      {session.startTime}
                    </Text>
                  </View>

                  <View style={styles.sessionDetailsCol}>
                    <Text style={[styles.sessionSubject, { color: colors.textPrimary }]}>
                      {session.subject}
                    </Text>
                    <Text style={[styles.sessionRoom, { color: colors.textSecondary }]}>
                      {session.grade} - {session.section} • {session.room}
                    </Text>
                  </View>

                  <SMBadge
                    label={session.status}
                    variant={session.status === 'Ongoing' ? 'primary' : session.status === 'Completed' ? 'neutral' : 'warning'}
                    size="sm"
                  />
                </View>
              ))}

              <SMButton
                title="Mark Attendance for Current Class"
                onPress={() => router.push('/attendance')}
                variant="primary"
                size="md"
                fullWidth
                style={{ marginTop: 12 }}
              />
            </SMCard>

            {/* Assignments to Review */}
            <SMCard elevation="sm" padding="md" style={styles.sectionCard}>
              <View style={styles.cardHeaderRow}>
                <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                  Assignments Submitted
                </Text>
                <TouchableOpacity onPress={() => router.push('/assignments')}>
                  <Text style={[styles.viewAllText, { color: colors.primary }]}>View All →</Text>
                </TouchableOpacity>
              </View>

              {MOCK_ASSIGNMENTS.map((asn) => (
                <View key={asn.id} style={styles.asnRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.asnTitle, { color: colors.textPrimary }]}>{asn.title}</Text>
                    <Text style={[styles.asnMeta, { color: colors.textSecondary }]}>
                      Due: {asn.dueDate} • {asn.submissionsCount}/{asn.totalStudents} Submitted
                    </Text>
                  </View>
                  <SMProgressBar
                    progress={(asn.submissionsCount / asn.totalStudents) * 100}
                    valueText={`${Math.round((asn.submissionsCount / asn.totalStudents) * 100)}%`}
                    style={{ width: 90 }}
                  />
                </View>
              ))}
            </SMCard>
          </>
        )}

        {/* ========================================================================= */}
        {/* 3. STUDENT DASHBOARD */}
        {/* ========================================================================= */}
        {role === 'student' && (
          <>
            {/* Student Stats Banner */}
            <SMCard elevation="sm" padding="md" style={styles.sectionCard}>
              <View style={styles.studentStatsHeader}>
                <View>
                  <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                    Academic Standing: Grade 11-A
                  </Text>
                  <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
                    Roll #11A-24 • Aarav Sharma
                  </Text>
                </View>
                <SMBadge label="Top 5%" variant="success" size="sm" />
              </View>

              <View style={styles.studentMetricsRow}>
                <View style={[styles.metricBox, { backgroundColor: colors.surfaceVariant }]}>
                  <Text style={[styles.metricBig, { color: colors.primary }]}>95.8%</Text>
                  <Text style={[styles.metricSub, { color: colors.textSecondary }]}>My Attendance</Text>
                </View>
                <View style={[styles.metricBox, { backgroundColor: colors.surfaceVariant }]}>
                  <Text style={[styles.metricBig, { color: colors.info }]}>A (89%)</Text>
                  <Text style={[styles.metricSub, { color: colors.textSecondary }]}>Overall Grade</Text>
                </View>
                <View style={[styles.metricBox, { backgroundColor: colors.surfaceVariant }]}>
                  <Text style={[styles.metricBig, { color: colors.warning }]}>2 Due</Text>
                  <Text style={[styles.metricSub, { color: colors.textSecondary }]}>Assignments</Text>
                </View>
              </View>
            </SMCard>

            {/* Today's Timetable */}
            <SMCard elevation="sm" padding="md" style={styles.sectionCard}>
              <View style={styles.cardHeaderRow}>
                <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                  Today's Lectures
                </Text>
                <TouchableOpacity onPress={() => router.push('/(tabs)/academics')}>
                  <Text style={[styles.viewAllText, { color: colors.primary }]}>Full Timetable →</Text>
                </TouchableOpacity>
              </View>

              {MOCK_CLASS_SESSIONS.slice(0, 3).map((session) => (
                <View key={session.id} style={[styles.sessionMiniRow, { borderBottomColor: colors.borderLight }]}>
                  <View style={[styles.periodDot, { backgroundColor: colors.primary }]}>
                    <Text style={styles.periodDotText}>P{session.period}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.sessionSubject, { color: colors.textPrimary }]}>{session.subject}</Text>
                    <Text style={[styles.sessionRoom, { color: colors.textSecondary }]}>{session.teacherName} • {session.room}</Text>
                  </View>
                  <Text style={[styles.sessionTimeTag, { color: colors.primary }]}>{session.startTime}</Text>
                </View>
              ))}
            </SMCard>

            {/* Quick Link to ID Card */}
            <SMButton
              title="View Digital Student ID & QR Code"
              onPress={() => router.push('/students')}
              variant="outline"
              size="md"
              fullWidth
              icon={<Ionicons name="qr-code-outline" size={18} color={colors.primary} />}
              style={{ marginVertical: 8 }}
            />
          </>
        )}

        {/* ========================================================================= */}
        {/* 4. PARENT DASHBOARD */}
        {/* ========================================================================= */}
        {role === 'parent' && (
          <>
            <SMCard elevation="sm" padding="md" style={styles.sectionCard}>
              <View style={styles.parentStudentCard}>
                <SMAvatar name="Aarav Sharma" size="md" status="online" />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                    Aarav Sharma (Ward)
                  </Text>
                  <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
                    Grade 11 - Section A • CBSE Board
                  </Text>
                </View>
                <SMBadge label="Present Today" variant="success" size="sm" dot />
              </View>

              <View style={[styles.parentDuesBanner, { backgroundColor: colors.surfaceVariant }]}>
                <View>
                  <Text style={[styles.duesLabel, { color: colors.textSecondary }]}>
                    Term 2 Tuition Fees
                  </Text>
                  <Text style={[styles.duesStatus, { color: colors.success }]}>
                    ✓ Paid in Full (₹32,500)
                  </Text>
                </View>
                <SMButton
                  title="View Receipt"
                  onPress={() => router.push('/fees')}
                  variant="outline"
                  size="sm"
                />
              </View>
            </SMCard>

            {/* Attendance & Performance Progress */}
            <SMCard elevation="sm" padding="md" style={styles.sectionCard}>
              <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                Attendance Tracker (Term 1)
              </Text>
              <SMProgressBar
                progress={95.8}
                label="Days Present: 114 of 119 Days"
                valueText="95.8%"
                color={colors.success}
                style={{ marginTop: 8 }}
              />

              <View style={styles.contactTeacherRow}>
                <Ionicons name="call-outline" size={18} color={colors.primary} />
                <Text style={[styles.contactTeacherText, { color: colors.textPrimary }]}>
                  Class Mentor: Prof. Priya Nair (+91 98333 22333)
                </Text>
              </View>
            </SMCard>
          </>
        )}

        {/* ========================================================================= */}
        {/* 5. FINANCE & HR DASHBOARD */}
        {/* ========================================================================= */}
        {role === 'finance' && (
          <>
            <View style={styles.statsGrid}>
              <SMCard style={styles.statCard} padding="sm">
                <Text style={[styles.statValue, { color: colors.success }]}>₹1.84 Cr</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Collected This Term</Text>
              </SMCard>
              <SMCard style={styles.statCard} padding="sm">
                <Text style={[styles.statValue, { color: colors.error }]}>₹28.95 L</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Outstanding Dues</Text>
              </SMCard>
              <SMCard style={styles.statCard} padding="sm">
                <Text style={[styles.statValue, { color: colors.info }]}>84</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Defaulter Accounts</Text>
              </SMCard>
              <SMCard style={styles.statCard} padding="sm">
                <Text style={[styles.statValue, { color: colors.primary }]}>₹4.85 L</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Today's Bankings</Text>
              </SMCard>
            </View>

            <SMCard elevation="sm" padding="md" style={styles.sectionCard}>
              <View style={styles.cardHeaderRow}>
                <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                  Recent Fee Collections
                </Text>
                <TouchableOpacity onPress={() => router.push('/fees')}>
                  <Text style={[styles.viewAllText, { color: colors.primary }]}>Fee Manager →</Text>
                </TouchableOpacity>
              </View>

              {MOCK_FEES.map((fee) => (
                <View key={fee.id} style={[styles.feeRow, { borderBottomColor: colors.borderLight }]}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.feeStudentName, { color: colors.textPrimary }]}>
                      {fee.studentName} ({fee.grade})
                    </Text>
                    <Text style={[styles.feeReceiptNo, { color: colors.textSecondary }]}>
                      {fee.receiptNumber} • {fee.category} Fee
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={[styles.feeAmount, { color: colors.textPrimary }]}>
                      ₹{fee.amount.toLocaleString()}
                    </Text>
                    <SMBadge
                      label={fee.status}
                      variant={fee.status === 'Paid' ? 'success' : fee.status === 'Pending' ? 'warning' : 'error'}
                      size="sm"
                    />
                  </View>
                </View>
              ))}
            </SMCard>
          </>
        )}

        {/* ========================================================================= */}
        {/* 6. SUPER ADMIN DASHBOARD */}
        {/* ========================================================================= */}
        {role === 'super_admin' && (
          <>
            <View style={styles.statsGrid}>
              <SMCard style={styles.statCard} padding="sm">
                <Text style={[styles.statValue, { color: colors.primary }]}>48</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Institutions</Text>
              </SMCard>
              <SMCard style={styles.statCard} padding="sm">
                <Text style={[styles.statValue, { color: colors.success }]}>₹42.8 L</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Monthly MRR</Text>
              </SMCard>
              <SMCard style={styles.statCard} padding="sm">
                <Text style={[styles.statValue, { color: colors.info }]}>1,18,400</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Platform Students</Text>
              </SMCard>
              <SMCard style={styles.statCard} padding="sm">
                <Text style={[styles.statValue, { color: colors.secondaryDark }]}>99.98%</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Cloud SLA Uptime</Text>
              </SMCard>
            </View>

            <SMCard elevation="sm" padding="md" style={styles.sectionCard}>
              <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                SMANV Enterprise Platform Status
              </Text>
              <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
                Developed by SMANV Info Tech Private Limited
              </Text>
              <SMProgressBar
                progress={98}
                label="AI Model Inference Compute & Cache"
                valueText="Healthy (12ms latency)"
                color={colors.accent}
                style={{ marginTop: 12 }}
              />
            </SMCard>
          </>
        )}

        {/* Campus Announcements (Common for all roles) */}
        <SMCard elevation="sm" padding="md" style={styles.sectionCard}>
          <View style={styles.cardHeaderRow}>
            <View>
              <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                Campus Announcements
              </Text>
              <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
                Official updates & circulars
              </Text>
            </View>
            <SMBadge label="Official" variant="primary" size="sm" />
          </View>

          {MOCK_ANNOUNCEMENTS.map((ann) => (
            <View key={ann.id} style={[styles.announcementItem, { borderBottomColor: colors.borderLight }]}>
              <Text style={[styles.annTitle, { color: colors.textPrimary }]}>{ann.title}</Text>
              <Text style={[styles.annContent, { color: colors.textSecondary }]}>{ann.content}</Text>
              <Text style={[styles.annMeta, { color: colors.textTertiary }]}>
                {ann.date} • by {ann.author}
              </Text>
            </View>
          ))}
        </SMCard>

        {/* Bottom Spacing */}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Floating SMANV AI Assistant FAB */}
      <SMFAB
        onPress={() => router.push('/ai-assistant')}
        label="SMANV AI"
        iconName="sparkles"
        variant="ai"
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
  roleSwitcherBar: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: Layout.borderRadius.md,
    marginBottom: Layout.spacing.sm,
    gap: 6,
  },
  roleSwitcherLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  roleChipsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  roleChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: Layout.borderRadius.full,
    borderWidth: 1,
  },
  roleChipText: {
    fontSize: 11,
    fontWeight: '600',
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: Layout.spacing.sm,
  },
  greetingText: {
    fontSize: Layout.fontSize.bodyMedium,
  },
  userName: {
    fontSize: Layout.fontSize.headlineSmall,
    fontWeight: '800',
  },
  userDesignation: {
    fontSize: Layout.fontSize.bodySmall,
    fontWeight: '600',
    marginTop: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginVertical: Layout.spacing.sm,
  },
  statCard: {
    width: '48%',
    borderRadius: Layout.borderRadius.lg,
  },
  statIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: Layout.fontSize.headlineSmall,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: Layout.fontSize.caption,
    marginTop: 2,
  },
  statTrend: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 6,
  },
  aiInsightCard: {
    borderRadius: Layout.borderRadius.xl,
    overflow: 'hidden',
    marginVertical: Layout.spacing.sm,
  },
  aiInsightGradient: {
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.xl,
  },
  aiHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: Layout.borderRadius.full,
  },
  aiBadgeText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 11,
    letterSpacing: 0.3,
  },
  aiActionLink: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 12,
  },
  aiTitle: {
    color: '#FFFFFF',
    fontSize: Layout.fontSize.titleMedium,
    fontWeight: '800',
    marginBottom: 4,
  },
  aiDescription: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: Layout.fontSize.bodySmall,
    lineHeight: 18,
    marginBottom: 12,
  },
  aiFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  aiMetricChip: {
    color: '#FEF08A',
    fontWeight: '700',
    fontSize: 12,
  },
  aiButtonMini: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: Layout.borderRadius.full,
  },
  aiButtonMiniText: {
    color: '#1B5E20',
    fontWeight: '700',
    fontSize: 11,
  },
  sectionHeader: {
    marginTop: Layout.spacing.md,
    marginBottom: Layout.spacing.xs,
  },
  sectionTitle: {
    fontSize: Layout.fontSize.titleLarge,
    fontWeight: '800',
  },
  sectionSubtitle: {
    fontSize: Layout.fontSize.caption,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: Layout.spacing.sm,
  },
  quickActionTile: {
    width: '31%',
    borderRadius: Layout.borderRadius.lg,
    borderWidth: 1,
    padding: 10,
    alignItems: 'center',
  },
  actionIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  actionCount: {
    fontSize: 10,
    marginTop: 2,
  },
  sectionCard: {
    marginVertical: Layout.spacing.xs,
    borderRadius: Layout.borderRadius.xl,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.sm,
  },
  cardTitle: {
    fontSize: Layout.fontSize.titleMedium,
    fontWeight: '700',
  },
  cardSubtitle: {
    fontSize: Layout.fontSize.caption,
    marginTop: 1,
  },
  viewAllText: {
    fontSize: Layout.fontSize.bodySmall,
    fontWeight: '600',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
    borderBottomWidth: 1,
    gap: 12,
  },
  actIconBubble: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  actTextCol: {
    flex: 1,
  },
  actTitle: {
    fontSize: Layout.fontSize.bodySmall,
    fontWeight: '600',
    lineHeight: 18,
  },
  actMeta: {
    fontSize: 11,
    marginTop: 2,
  },
  timelineCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: Layout.borderRadius.md,
    borderWidth: 1,
    marginVertical: 4,
    gap: 12,
  },
  periodCol: {
    alignItems: 'center',
    minWidth: 46,
  },
  periodNumber: {
    fontSize: 14,
    fontWeight: '800',
  },
  periodTime: {
    fontSize: 9,
    marginTop: 2,
  },
  sessionDetailsCol: {
    flex: 1,
  },
  sessionSubject: {
    fontSize: 13,
    fontWeight: '700',
  },
  sessionRoom: {
    fontSize: 11,
    marginTop: 2,
  },
  asnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    gap: 8,
  },
  asnTitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  asnMeta: {
    fontSize: 11,
    marginTop: 2,
  },
  studentStatsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.sm,
  },
  studentMetricsRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 6,
  },
  metricBox: {
    flex: 1,
    padding: 10,
    borderRadius: Layout.borderRadius.md,
    alignItems: 'center',
  },
  metricBig: {
    fontSize: 16,
    fontWeight: '800',
  },
  metricSub: {
    fontSize: 10,
    marginTop: 2,
  },
  sessionMiniRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    gap: 10,
  },
  periodDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  periodDotText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  sessionTimeTag: {
    fontSize: 11,
    fontWeight: '600',
  },
  parentStudentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.sm,
  },
  parentDuesBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: Layout.borderRadius.md,
    marginTop: 6,
  },
  duesLabel: {
    fontSize: 11,
  },
  duesStatus: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
  contactTeacherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    paddingTop: 8,
  },
  contactTeacherText: {
    fontSize: 12,
    fontWeight: '500',
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  feeStudentName: {
    fontSize: 13,
    fontWeight: '700',
  },
  feeReceiptNo: {
    fontSize: 11,
    marginTop: 2,
  },
  feeAmount: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 4,
  },
  announcementItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  annTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  annContent: {
    fontSize: 12,
    lineHeight: 18,
    marginVertical: 4,
  },
  annMeta: {
    fontSize: 10,
  },
});
