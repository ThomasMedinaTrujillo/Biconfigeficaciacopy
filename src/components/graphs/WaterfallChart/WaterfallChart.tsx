import React, { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import '../dashboard-theme.css';

export type WaterfallType = 'increase' | 'decrease' | 'total';

export interface WaterfallDataPoint {
  name: string;
  value: number;
  type: WaterfallType;
}

interface WaterfallColors {
  increase: string;
  decrease: string;
  total: string;
}

interface WaterfallChartProps<T extends object = WaterfallDataPoint> {
  data: T[];
  xKey?: keyof T;
  valueKey?: keyof T;
  typeKey?: keyof T;
  className?: string;
  height?: number;
  width?: number | string;
  title?: string;
  subtitle?: string;
  colors?: Partial<WaterfallColors>;
  loading?: boolean;
  emptyStateText?: string;
  showConnectorLines?: boolean;
  showGrid?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
}

const DEFAULT_COLORS: WaterfallColors = {
  increase: 'var(--color-success)',
  decrease: 'var(--color-danger)',
  total: 'var(--color-blue-primary)',
};

const LEGEND_KEYS = {
  increase: 'increaseBar',
  decrease: 'decreaseBar',
  total: 'totalBar',
} as const;

const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
  }).format(value);
};

const WaterfallChart = <T extends object = WaterfallDataPoint>({
  data,
  xKey = 'name' as keyof T,
  valueKey = 'value' as keyof T,
  typeKey = 'type' as keyof T,
  className,
  height = 250,
  width = '100%',
  title,
  subtitle,
  colors,
  loading = false,
  emptyStateText = 'No data available',
  showConnectorLines = true,
  showGrid = true,
  showTooltip = true,
  showLegend = false,
}: WaterfallChartProps<T>) => {
  const palette = {
    ...DEFAULT_COLORS,
    ...colors,
  };

  const chartData = useMemo(() => {
    let runningTotal = 0;

    return data.map((entry, index) => {
      const rawName = entry[xKey];
      const rawValue = entry[valueKey];
      const rawType = entry[typeKey];

      const label = String(rawName ?? `Item ${index + 1}`);
      const value = typeof rawValue === 'number' ? rawValue : Number(rawValue ?? 0);
      const typeCandidate = rawType as unknown;
      const type: WaterfallType =
        typeCandidate === 'increase' || typeCandidate === 'decrease' || typeCandidate === 'total'
          ? typeCandidate
          : 'increase';

      const start = type === 'total' ? 0 : runningTotal;
      const amount = type === 'total' ? runningTotal + value : value;
      const end = start + amount;

      if (type !== 'total') {
        runningTotal = end;
      }

      return {
        label,
        start,
        amount,
        end,
        value,
        type,
        increaseBar: type === 'increase' ? amount : 0,
        decreaseBar: type === 'decrease' ? amount : 0,
        totalBar: type === 'total' ? amount : 0,
      };
    });
  }, [data, typeKey, valueKey, xKey]);

  if (loading) {
    return (
      <div className={`rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-card)] p-4 ${className ?? ''}`}>
        <div className="animate-pulse rounded-[var(--radius-card)] bg-[var(--color-soft-blue)]" style={{ height }} />
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className={`rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-card)] p-4 ${className ?? ''}`}>
        {(title || subtitle) && (
          <div className="mb-3">
            {title && <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">{title}</h3>}
            {subtitle && <p className="text-xs text-[var(--color-text-secondary)]">{subtitle}</p>}
          </div>
        )}
        <div className="flex items-center justify-center rounded-[var(--radius-card)] border border-dashed border-[var(--color-border)] text-sm text-[var(--color-text-secondary)]" style={{ height }}>
          {emptyStateText}
        </div>
      </div>
    );
  }

  return (
    <section className={`rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-card)] p-4 ${className ?? ''}`}>
      {(title || subtitle) && (
        <header className="mb-3">
          {title && <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">{title}</h3>}
          {subtitle && <p className="text-xs text-[var(--color-text-secondary)]">{subtitle}</p>}
        </header>
      )}

      <div className="w-full">
        <ResponsiveContainer width={width} height={height}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 20, left: 12, bottom: 12 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={showGrid ? 'var(--chart-grid)' : 'transparent'}
            />
            <XAxis
              dataKey="label"
              stroke="var(--color-text-secondary)"
              tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
            />
            <YAxis
              stroke="var(--color-text-secondary)"
              tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
            />

            {showTooltip && (
              <Tooltip
                formatter={(value: number, _name, payload) => {
                  const p = payload?.payload;
                  const typeLabel = p?.type ? String(p.type) : 'value';
                  return [`${formatNumber(Number(value))}`, typeLabel];
                }}
                labelFormatter={(value) => `Category: ${String(value)}`}
              />
            )}

            {showLegend && <Legend />}

            {showConnectorLines &&
              chartData.slice(0, -1).map((entry, idx) => (
                <ReferenceLine
                  key={`connector-${entry.label}-${idx}`}
                  y={entry.end}
                  stroke="var(--color-text-muted)"
                  strokeDasharray="3 3"
                  ifOverflow="extendDomain"
                />
              ))}

            <Bar dataKey="start" stackId="wf" fill="transparent" />

            <Bar dataKey={LEGEND_KEYS.increase} stackId="wf" name="Increase" fill={palette.increase} radius={[6, 6, 0, 0]}>
              {chartData.map((entry, idx) => (
                <Cell key={`inc-${entry.label}-${idx}`} fill={entry.type === 'increase' ? palette.increase : 'transparent'} />
              ))}
            </Bar>

            <Bar dataKey={LEGEND_KEYS.decrease} stackId="wf" name="Decrease" fill={palette.decrease} radius={[6, 6, 0, 0]}>
              {chartData.map((entry, idx) => (
                <Cell key={`dec-${entry.label}-${idx}`} fill={entry.type === 'decrease' ? palette.decrease : 'transparent'} />
              ))}
            </Bar>

            <Bar dataKey={LEGEND_KEYS.total} stackId="wf" name="Total" fill={palette.total} radius={[6, 6, 0, 0]}>
              {chartData.map((entry, idx) => (
                <Cell key={`tot-${entry.label}-${idx}`} fill={entry.type === 'total' ? palette.total : 'transparent'} />
              ))}
              <LabelList
                dataKey="end"
                position="top"
                formatter={(value: number) => formatNumber(value)}
                fill="var(--color-text-primary)"
                fontSize={11}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default WaterfallChart;
