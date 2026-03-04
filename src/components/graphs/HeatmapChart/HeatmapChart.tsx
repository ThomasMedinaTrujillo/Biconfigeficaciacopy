import React from 'react';
import {
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import '../dashboard-theme.css';

type DataRecord = Record<string, unknown>;
type DataKey<T extends DataRecord> = Extract<keyof T, string>;

export interface HeatmapChartProps<T extends DataRecord> {
  data: T[];
  xKey: DataKey<T>;
  yKey: DataKey<T>;
  valueKey: DataKey<T>;
  colorScale?: (value: number, min: number, max: number) => string;
  showLegend?: boolean;
  showTooltip?: boolean;
  cellSize?: number;
  className?: string;
  height?: number;
  width?: number | string;
  title?: string;
  subtitle?: string;
  colors?: string[];
  loading?: boolean;
  emptyState?: React.ReactNode;
}

const DEFAULT_HEIGHT = 250;
const DEFAULT_COLORS = [
  'var(--color-soft-blue)',
  'var(--color-blue-light)',
  'var(--color-blue-bright)',
  'var(--color-blue-primary)',
  'var(--color-blue-dark)',
];

const defaultColorScale = (
  value: number,
  min: number,
  max: number,
  colors: string[]
): string => {
  if (colors.length === 0) {
    return 'var(--color-blue-primary)';
  }

  if (max <= min) {
    return colors[colors.length - 1];
  }

  const normalized = (value - min) / (max - min);
  const index = Math.min(
    colors.length - 1,
    Math.max(0, Math.floor(normalized * colors.length))
  );

  return colors[index];
};

const HeatmapChart = <T extends DataRecord>({
  data,
  xKey,
  yKey,
  valueKey,
  colorScale,
  showLegend = true,
  showTooltip = true,
  cellSize = 24,
  className,
  height = DEFAULT_HEIGHT,
  width = '100%',
  title,
  subtitle,
  colors = DEFAULT_COLORS,
  loading = false,
  emptyState,
}: HeatmapChartProps<T>) => {
  const values = data
    .map((item) => Number(item[valueKey]))
    .filter((value) => Number.isFinite(value));

  const minValue = values.length > 0 ? Math.min(...values) : 0;
  const maxValue = values.length > 0 ? Math.max(...values) : 0;

  const getColor = (value: number): string => {
    if (!Number.isFinite(value)) {
      return 'var(--color-soft-blue)';
    }

    if (colorScale) {
      return colorScale(value, minValue, maxValue);
    }

    return defaultColorScale(value, minValue, maxValue, colors);
  };

  const renderCell = (props: { cx?: number; cy?: number; fill?: string }) => {
    const { cx = 0, cy = 0, fill = 'var(--color-blue-primary)' } = props;
    const halfSize = cellSize / 2;

    return (
      <rect
        x={cx - halfSize}
        y={cy - halfSize}
        width={cellSize}
        height={cellSize}
        rx="var(--radius-bar)"
        ry="var(--radius-bar)"
        fill={fill}
        stroke="var(--color-card)"
        strokeWidth={1}
      />
    );
  };

  const legendSteps = [0, 0.25, 0.5, 0.75, 1].map((step) => {
    const value = minValue + (maxValue - minValue) * step;
    return {
      value,
      color: getColor(value),
    };
  });

  if (loading) {
    return (
      <div className={`w-full rounded-[var(--radius-card)] border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-4 ${className ?? ''}`}>
        {(title || subtitle) && (
          <div className="mb-3">
            {title && <h3 className="text-sm font-semibold text-[color:var(--color-text-primary)]">{title}</h3>}
            {subtitle && <p className="mt-1 text-xs text-[color:var(--color-text-secondary)]">{subtitle}</p>}
          </div>
        )}
        <div className="flex items-center justify-center rounded-[var(--radius-bar)] bg-[color:var(--color-soft-blue)]" style={{ height }}>
          <p className="text-sm text-[color:var(--color-text-secondary)]">Loading chart...</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={`w-full rounded-[var(--radius-card)] border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-4 ${className ?? ''}`}>
        {(title || subtitle) && (
          <div className="mb-3">
            {title && <h3 className="text-sm font-semibold text-[color:var(--color-text-primary)]">{title}</h3>}
            {subtitle && <p className="mt-1 text-xs text-[color:var(--color-text-secondary)]">{subtitle}</p>}
          </div>
        )}
        <div className="flex items-center justify-center rounded-[var(--radius-bar)] bg-[color:var(--color-soft-blue)]" style={{ height }}>
          {emptyState ?? <p className="text-sm text-[color:var(--color-text-secondary)]">No data available</p>}
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full rounded-[var(--radius-card)] border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-4 ${className ?? ''}`}>
      {(title || subtitle) && (
        <div className="mb-3">
          {title && <h3 className="text-sm font-semibold text-[color:var(--color-text-primary)]">{title}</h3>}
          {subtitle && <p className="mt-1 text-xs text-[color:var(--color-text-secondary)]">{subtitle}</p>}
        </div>
      )}

      <ResponsiveContainer width={width} height={height}>
        <ScatterChart margin={{ top: 12, right: 12, bottom: 12, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
          <XAxis
            dataKey={xKey}
            type="category"
            stroke="var(--color-text-secondary)"
            tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
          />
          <YAxis
            dataKey={yKey}
            type="category"
            stroke="var(--color-text-secondary)"
            tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
          />

          {showTooltip && (
            <Tooltip
              formatter={(_, __, payload) => {
                const item = payload?.payload as T | undefined;
                const rawValue = item ? item[valueKey] : undefined;
                return [String(rawValue ?? '-'), String(valueKey)];
              }}
            />
          )}

          <Scatter data={data} dataKey={valueKey} shape={renderCell}>
            {data.map((item, index) => {
              const numericValue = Number(item[valueKey]);
              return <Cell key={`heat-cell-${index}`} fill={getColor(numericValue)} />;
            })}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>

      {showLegend && (
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="text-xs text-[color:var(--color-text-secondary)]">{minValue.toFixed(0)}</span>
          <div className="flex flex-1 items-center gap-1">
            {legendSteps.map((step, index) => (
              <div
                key={`legend-step-${index}`}
                className="h-2 flex-1 rounded-[var(--radius-bar)]"
                style={{ backgroundColor: step.color }}
              />
            ))}
          </div>
          <span className="text-xs text-[color:var(--color-text-secondary)]">{maxValue.toFixed(0)}</span>
        </div>
      )}
    </div>
  );
};

export default HeatmapChart;