import React, { memo, useMemo } from 'react';
import {
  Line,
  LineChart,
  ResponsiveContainer,
} from 'recharts';
import './dashboard-theme.css';

type ValueFormat = 'currency' | 'percent' | 'number';
type KpiStatus = 'positive' | 'negative' | 'neutral';

type SparklinePoint = Record<string, number | string>;

export interface KpiCardProps {
  // Required props
  value: number;

  // Optional props
  label?: string;
  previousValue?: number;
  format?: ValueFormat;
  showTrend?: boolean;
  sparklineData?: Array<number | SparklinePoint>;
  sparklineKey?: string;
  target?: number;
  showProgress?: boolean;
  status?: KpiStatus;
  className?: string;
}

const clamp = (value: number, min = 0, max = 100): number => Math.min(max, Math.max(min, value));

const formatValue = (value: number, format: ValueFormat): string => {
  if (format === 'currency') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  }

  if (format === 'percent') {
    return `${value.toFixed(1)}%`;
  }

  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
  }).format(value);
};

export const KpiCard: React.FC<KpiCardProps> = memo(({
  value,
  label = 'KPI',
  previousValue,
  format = 'number',
  showTrend = true,
  sparklineData,
  sparklineKey = 'value',
  target,
  showProgress = false,
  status,
  className = '',
}) => {
  const trend = useMemo(() => {
    if (typeof previousValue !== 'number') {
      return null;
    }

    const delta = value - previousValue;
    const percentChange = previousValue === 0 ? 0 : (delta / Math.abs(previousValue)) * 100;

    return {
      delta,
      percentChange,
    };
  }, [value, previousValue]);

  const resolvedStatus: KpiStatus = useMemo(() => {
    if (status) {
      return status;
    }

    if (!trend) {
      return 'neutral';
    }

    if (trend.delta > 0) {
      return 'positive';
    }

    if (trend.delta < 0) {
      return 'negative';
    }

    return 'neutral';
  }, [status, trend]);

  const statusColor = useMemo(() => {
    if (resolvedStatus === 'positive') {
      return 'var(--color-success)';
    }

    if (resolvedStatus === 'negative') {
      return 'var(--color-danger)';
    }

    return 'var(--color-text-secondary)';
  }, [resolvedStatus]);

  const progress = useMemo(() => {
    if (typeof target !== 'number' || target === 0) {
      return null;
    }

    return clamp((value / target) * 100);
  }, [target, value]);

  const normalizedSparkline = useMemo(() => {
    if (!sparklineData || sparklineData.length === 0) {
      return [] as Array<{ index: number; value: number }>;
    }

    return sparklineData
      .map((point, index) => {
        if (typeof point === 'number') {
          return { index, value: point };
        }

        const raw = Number(point[sparklineKey]);
        if (!Number.isFinite(raw)) {
          return null;
        }

        return { index, value: raw };
      })
      .filter((point): point is { index: number; value: number } => point !== null);
  }, [sparklineData, sparklineKey]);

  return (
    <div
      className={className}
      style={{
        width: '100%',
        height: '100%',
        borderRadius: '12px',
        border: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-card)',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
    >
      <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', letterSpacing: '0.3px' }}>
        {label}
      </div>

      <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--color-primary-dark)', lineHeight: 1 }}>
        {formatValue(value, format)}
      </div>

      {showTrend && trend && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: statusColor, fontSize: '12px', fontWeight: 600 }}>
          <span>
            {trend.delta > 0 ? 'UP' : trend.delta < 0 ? 'DOWN' : 'FLAT'} {Math.abs(trend.percentChange).toFixed(1)}%
          </span>
          <span style={{ color: 'var(--color-text-secondary)', fontWeight: 500 }}>
            vs previous
          </span>
        </div>
      )}

      {showProgress && progress !== null && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
            <span>Target</span>
            <span>{progress.toFixed(1)}%</span>
          </div>
          <div style={{ width: '100%', height: '8px', borderRadius: '999px', backgroundColor: 'var(--color-soft-blue)', overflow: 'hidden' }}>
            <div
              style={{
                width: `${progress}%`,
                height: '100%',
                borderRadius: '999px',
                backgroundColor: statusColor,
                transition: 'width 200ms ease-out',
              }}
            />
          </div>
        </div>
      )}

      {normalizedSparkline.length > 1 && (
        <div style={{ width: '100%', height: '56px', marginTop: 'auto' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={normalizedSparkline} margin={{ top: 6, right: 0, left: 0, bottom: 0 }}>
              <Line
                type="monotone"
                dataKey="value"
                stroke={statusColor}
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
});

KpiCard.displayName = 'KpiCard';

export default KpiCard;
