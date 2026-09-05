/**
 * SMANV EduERP SMChart Component
 * Visual KPI Metrics, Bar Charts & Progress Meters
 * Developed by SMANV Info Tech Private Limited
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../store/ThemeContext';
import { Layout } from '../constants/Layout';

export interface ChartDataPoint {
  label: string;
  value: number;
  formattedValue?: string;
  color?: string;
}

interface SMBarChartProps {
  data: ChartDataPoint[];
  title?: string;
  subtitle?: string;
  height?: number;
  style?: ViewStyle;
}

export const SMBarChart: React.FC<SMBarChartProps> = ({
  data,
  title,
  subtitle,
  height = 160,
  style,
}) => {
  const { colors } = useTheme();

  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <View style={[styles.container, style]}>
      {title && (
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
          {subtitle && (
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
          )}
        </View>
      )}

      <View style={[styles.chartContainer, { height }]}>
        {data.map((item, index) => {
          const heightPercent = Math.min((item.value / maxValue) * 100, 100);
          const barColor = item.color || colors.primary;

          return (
            <View key={`bar-${index}`} style={styles.barColumn}>
              <Text style={[styles.valueLabel, { color: colors.textSecondary }]}>
                {item.formattedValue || item.value}
              </Text>
              <View style={[styles.barTrack, { backgroundColor: colors.surfaceVariant }]}>
                <View
                  style={[
                    styles.barFill,
                    {
                      height: `${heightPercent}%`,
                      backgroundColor: barColor,
                      borderTopLeftRadius: 6,
                      borderTopRightRadius: 6,
                    },
                  ]}
                />
              </View>
              <Text
                style={[styles.label, { color: colors.textSecondary }]}
                numberOfLines={1}
              >
                {item.label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

interface SMProgressBarProps {
  progress: number; // 0 to 100
  label?: string;
  valueText?: string;
  color?: string;
  height?: number;
  style?: ViewStyle;
}

export const SMProgressBar: React.FC<SMProgressBarProps> = ({
  progress,
  label,
  valueText,
  color,
  height = 8,
  style,
}) => {
  const { colors } = useTheme();
  const barColor = color || colors.primary;
  const clamped = Math.min(Math.max(progress, 0), 100);

  return (
    <View style={[styles.progressWrapper, style]}>
      {(label || valueText) && (
        <View style={styles.progressHeader}>
          {label && <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>{label}</Text>}
          {valueText && (
            <Text style={[styles.progressValue, { color: colors.textPrimary }]}>{valueText}</Text>
          )}
        </View>
      )}
      <View
        style={[
          styles.track,
          {
            height,
            backgroundColor: colors.surfaceVariant,
            borderRadius: height / 2,
          },
        ]}
      >
        <View
          style={[
            styles.fill,
            {
              width: `${clamped}%`,
              backgroundColor: barColor,
              borderRadius: height / 2,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Layout.spacing.sm,
  },
  titleRow: {
    marginBottom: Layout.spacing.md,
  },
  title: {
    fontSize: Layout.fontSize.titleMedium,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: Layout.fontSize.bodySmall,
    marginTop: 2,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingTop: 24,
    paddingBottom: 4,
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
    marginHorizontal: 4,
  },
  valueLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 4,
  },
  barTrack: {
    width: '100%',
    maxWidth: 28,
    flex: 1,
    borderRadius: 6,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
  },
  label: {
    fontSize: 11,
    marginTop: 6,
    fontWeight: '500',
    textAlign: 'center',
  },
  progressWrapper: {
    marginVertical: 4,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: Layout.fontSize.bodySmall,
    fontWeight: '500',
  },
  progressValue: {
    fontSize: Layout.fontSize.bodySmall,
    fontWeight: '700',
  },
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});
