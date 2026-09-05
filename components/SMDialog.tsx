/**
 * SMANV EduERP SMDialog Component
 * Enterprise Modal Alert & Confirmation Dialog
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
} from 'react-native';
import { useTheme } from '../store/ThemeContext';
import { SMButton } from './SMButton';
import { Layout } from '../constants/Layout';

interface SMDialogProps {
  visible: boolean;
  title: string;
  message?: string;
  children?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmVariant?: 'primary' | 'danger' | 'ai';
  loading?: boolean;
}

export const SMDialog: React.FC<SMDialogProps> = ({
  visible,
  title,
  message,
  children,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  confirmVariant = 'primary',
  loading = false,
}) => {
  const { colors } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={[styles.backdrop, { backgroundColor: colors.backdrop }]}>
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.dialogBox,
                {
                  backgroundColor: colors.modalBackground,
                  borderColor: colors.border,
                },
                Layout.shadows.xl,
              ]}
            >
              <Text style={[styles.title, { color: colors.textPrimary }]}>
                {title}
              </Text>

              {message && (
                <Text style={[styles.message, { color: colors.textSecondary }]}>
                  {message}
                </Text>
              )}

              {children && <View style={styles.children}>{children}</View>}

              <View style={styles.buttonRow}>
                {onCancel && (
                  <SMButton
                    title={cancelText}
                    onPress={onCancel}
                    variant="outline"
                    size="sm"
                    style={styles.actionBtn}
                  />
                )}
                {onConfirm && (
                  <SMButton
                    title={confirmText}
                    onPress={onConfirm}
                    variant={confirmVariant}
                    size="sm"
                    loading={loading}
                    style={styles.actionBtn}
                  />
                )}
              </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: Layout.spacing.lg,
  },
  dialogBox: {
    width: '100%',
    maxWidth: 420,
    borderRadius: Layout.borderRadius.xl,
    padding: Layout.spacing.xl,
    borderWidth: 1,
  },
  title: {
    fontSize: Layout.fontSize.titleLarge,
    fontWeight: '700',
    marginBottom: 8,
  },
  message: {
    fontSize: Layout.fontSize.bodyMedium,
    lineHeight: Layout.lineHeight.bodyMedium,
    marginBottom: Layout.spacing.md,
  },
  children: {
    marginVertical: Layout.spacing.sm,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Layout.spacing.sm,
    marginTop: Layout.spacing.lg,
  },
  actionBtn: {
    minWidth: 100,
  },
});
