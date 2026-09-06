/**
 * SMANV EduERP SMBottomSheet Component
 * Slide-up drawer panel for filters, actions, and interactive forms.
 * Developed by SMANV Info Tech Private Limited
 */

import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../store/ThemeContext';
import { Layout } from '../constants/Layout';

interface SMBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxHeightPercentage?: number;
}

export const SMBottomSheet: React.FC<SMBottomSheetProps> = ({
  visible,
  onClose,
  title,
  subtitle,
  children,
  maxHeightPercentage = 85,
}) => {
  const { colors } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={[styles.backdrop, { backgroundColor: colors.backdrop }]}>
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.sheetContainer,
                {
                  backgroundColor: colors.modalBackground,
                  borderColor: colors.border,
                  maxHeight: `${maxHeightPercentage}%`,
                },
                Layout.shadows.xl,
              ]}
            >
              {/* Drag Handle Indicator */}
              <View style={styles.handleContainer}>
                <View style={[styles.handle, { backgroundColor: colors.border }]} />
              </View>

              {/* Sheet Header */}
              <View style={[styles.header, { borderBottomColor: colors.borderLight }]}>
                <View style={styles.titleContainer}>
                  <Text style={[styles.title, { color: colors.textPrimary }]}>
                    {title}
                  </Text>
                  {subtitle && (
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                      {subtitle}
                    </Text>
                  )}
                </View>

                <TouchableOpacity
                  onPress={onClose}
                  style={[styles.closeBtn, { backgroundColor: colors.surfaceVariant }]}
                >
                  <Ionicons name="close" size={20} color={colors.textPrimary} />
                </TouchableOpacity>
              </View>

              {/* Content */}
              <ScrollView
                style={styles.scrollArea}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
              >
                {children}
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    width: '100%',
    borderTopLeftRadius: Layout.borderRadius.xxl,
    borderTopRightRadius: Layout.borderRadius.xxl,
    borderTopWidth: 1,
    paddingTop: 8,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.spacing.lg,
    paddingBottom: Layout.spacing.md,
    borderBottomWidth: 1,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: Layout.fontSize.titleLarge,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: Layout.fontSize.bodySmall,
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollArea: {
    paddingHorizontal: Layout.spacing.lg,
  },
  scrollContent: {
    paddingVertical: Layout.spacing.md,
    paddingBottom: Layout.spacing.xxxl,
  },
});
