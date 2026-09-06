/**
 * SMANV EduERP SMTable Component
 * Responsive Enterprise Data Table
 * Developed by SMANV Info Tech Private Limited
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../store/ThemeContext';
import { Layout } from '../constants/Layout';

export interface ColumnDef<T> {
  key: string;
  header: string;
  width?: number;
  render?: (item: T, index: number) => React.ReactNode;
}

interface SMTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  keyExtractor: (item: T, index: number) => string;
  onRowPress?: (item: T) => void;
  style?: ViewStyle;
}

export function SMTable<T>({
  columns,
  data,
  keyExtractor,
  onRowPress,
  style,
}: SMTableProps<T>) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.tableContainer,
        {
          borderColor: colors.cardBorder,
          backgroundColor: colors.card,
        },
        style,
      ]}
    >
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          {/* Header Row */}
          <View
            style={[
              styles.headerRow,
              {
                backgroundColor: colors.surfaceVariant,
                borderBottomColor: colors.border,
              },
            ]}
          >
            {columns.map((col) => (
              <View
                key={col.key}
                style={[styles.headerCell, col.width ? { width: col.width } : { flex: 1, minWidth: 100 }]}
              >
                <Text style={[styles.headerText, { color: colors.textSecondary }]}>
                  {col.header}
                </Text>
              </View>
            ))}
          </View>

          {/* Data Rows */}
          {data.map((item, rowIndex) => {
            const rowKey = keyExtractor(item, rowIndex);
            const isEven = rowIndex % 2 === 0;

            const rowContent = (
              <View
                style={[
                  styles.dataRow,
                  {
                    backgroundColor: isEven ? colors.card : colors.surface,
                    borderBottomColor: colors.borderLight,
                  },
                ]}
              >
                {columns.map((col) => {
                  return (
                    <View
                      key={`${rowKey}-${col.key}`}
                      style={[styles.cell, col.width ? { width: col.width } : { flex: 1, minWidth: 100 }]}
                    >
                      {col.render ? (
                        col.render(item, rowIndex)
                      ) : (
                        <Text
                          style={[styles.cellText, { color: colors.textPrimary }]}
                          numberOfLines={1}
                        >
                          {String((item as any)[col.key] ?? '')}
                        </Text>
                      )}
                    </View>
                  );
                })}
              </View>
            );

            if (onRowPress) {
              return (
                <TouchableOpacity
                  key={rowKey}
                  onPress={() => onRowPress(item)}
                  activeOpacity={0.7}
                >
                  {rowContent}
                </TouchableOpacity>
              );
            }

            return <View key={rowKey}>{rowContent}</View>;
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  tableContainer: {
    borderRadius: Layout.borderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    marginVertical: Layout.spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingVertical: Layout.spacing.sm,
  },
  headerCell: {
    paddingHorizontal: Layout.spacing.md,
    justifyContent: 'center',
  },
  headerText: {
    fontSize: Layout.fontSize.caption,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingVertical: Layout.spacing.md,
  },
  cell: {
    paddingHorizontal: Layout.spacing.md,
    justifyContent: 'center',
  },
  cellText: {
    fontSize: Layout.fontSize.bodySmall,
  },
});
