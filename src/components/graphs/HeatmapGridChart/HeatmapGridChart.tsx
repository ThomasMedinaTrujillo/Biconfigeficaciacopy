import React from 'react';
import HeatMap from 'react-heatmap-grid';
import '../dashboard-theme.css';
import './HeatmapGridChart.css';

const HeatMapComponent = HeatMap as unknown as React.ComponentType<Record<string, unknown>>;

type DataRecord = Record<string, unknown>;
type DataKey<T extends DataRecord> = Extract<keyof T, string>;

export interface HeatmapGridChartProps<T extends DataRecord> {
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

const HeatmapGridChart = <T extends DataRecord>({
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
}: HeatmapGridChartProps<T>) => {
  const xLabels = Array.from(new Set(data.map((item) => String(item[xKey]))));
  const yLabels = Array.from(new Set(data.map((item) => String(item[yKey]))));
  const yLabelWidth = Math.max(
    72,
    ...yLabels.map((label) => label.length * 7 + 12)
  );
  const xLabelWidth = Math.max(32, cellSize + 2);
  const cellPixelSize = Math.max(16, cellSize);

  const matrix = yLabels.map((yValue) =>
    xLabels.map((xValue) => {
      const match = data.find(
        (item) => String(item[xKey]) === xValue && String(item[yKey]) === yValue
      );
      return Number(match?.[valueKey] ?? 0);
    })
  );

  const values = matrix.flat().filter((value) => Number.isFinite(value));
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

      <div style={{ width, height }} className="heatmap-grid-chart overflow-auto">
        <HeatMapComponent
          xLabels={xLabels}
          yLabels={yLabels}
          data={matrix}
          squares
          height={cellPixelSize}
          xLabelWidth={xLabelWidth}
          yLabelWidth={yLabelWidth}
          yLabelTextAlign="right"
          xLabelsLocation="top"
          cellStyle={(_background: unknown, value: number) => ({
            background: getColor(Number(value)),
            borderRadius: 'var(--radius-bar)',
            width: `${cellPixelSize}px`,
            height: `${cellPixelSize}px`,
            margin: '2px',
            border: '1px solid var(--color-card)',
            flex: 'none',
          })}
          cellRender={(value: number) =>
            showTooltip ? (
              <div title={`${valueKey}: ${String(value)}`} className="h-full w-full" />
            ) : (
              <div className="h-full w-full" />
            )
          }
          title={(value: number, _unit: string, x: number, y: number) =>
            showTooltip
              ? `${xKey}: ${xLabels[x]} | ${yKey}: ${yLabels[y]} | ${valueKey}: ${String(value)}`
              : ''
          }
        />
      </div>

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

export default HeatmapGridChart;
