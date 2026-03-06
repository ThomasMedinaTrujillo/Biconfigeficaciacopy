import React, { useMemo } from 'react';
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

// Gradient from lightest to darkest blue
const GRADIENT_COLORS = [
  '#E8F4F8', // Very light blue
  '#B8E0ED', // Light blue
  '#7CC5DD', // Medium light blue
  '#4BA8C8', // Medium blue
  '#2B8AAF', // Medium dark blue
  '#1A6B8F', // Dark blue
  '#0D4C6F', // Very dark blue
];

const interpolateColor = (color1: string, color2: string, factor: number): string => {
  const hex2rgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
  };

  const rgb2hex = (r: number, g: number, b: number) => {
    return '#' + [r, g, b].map(x => {
      const hex = Math.round(x).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  };

  const [r1, g1, b1] = hex2rgb(color1);
  const [r2, g2, b2] = hex2rgb(color2);

  const r = r1 + factor * (r2 - r1);
  const g = g1 + factor * (g2 - g1);
  const b = b1 + factor * (b2 - b1);

  return rgb2hex(r, g, b);
};

const defaultColorScale = (
  value: number,
  min: number,
  max: number,
  colors: string[]
): string => {
  if (colors.length === 0) {
    return colors[colors.length - 1] || GRADIENT_COLORS[GRADIENT_COLORS.length - 1];
  }

  if (max <= min) {
    return colors[colors.length - 1];
  }

  const normalized = (value - min) / (max - min);
  
  // Find the two colors to interpolate between
  const segmentSize = 1 / (colors.length - 1);
  const segmentIndex = Math.min(colors.length - 2, Math.floor(normalized / segmentSize));
  const segmentFactor = (normalized - segmentIndex * segmentSize) / segmentSize;

  return interpolateColor(colors[segmentIndex], colors[segmentIndex + 1], segmentFactor);
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
  colors = GRADIENT_COLORS,
  loading = false,
  emptyState,
}: HeatmapChartProps<T>) => {
  const [hoveredCell, setHoveredCell] = React.useState<{ x: string; y: string; value: number } | null>(null);

  const { xLabels, yLabels, gridData, minValue, maxValue } = useMemo(() => {
    const xSet = new Set<string>();
    const ySet = new Set<string>();
    const grid = new Map<string, number>();

    data.forEach((item) => {
      const x = String(item[xKey]);
      const y = String(item[yKey]);
      const value = Number(item[valueKey]);

      xSet.add(x);
      ySet.add(y);
      grid.set(`${x}_${y}`, value);
    });

    const values = Array.from(grid.values()).filter((value) => Number.isFinite(value));
    const min = values.length > 0 ? Math.min(...values) : 0;
    const max = values.length > 0 ? Math.max(...values) : 0;

    return {
      xLabels: Array.from(xSet),
      yLabels: Array.from(ySet),
      gridData: grid,
      minValue: min,
      maxValue: max,
    };
  }, [data, xKey, yKey, valueKey]);

  const getColor = (value: number): string => {
    if (!Number.isFinite(value)) {
      return colors[0];
    }

    if (colorScale) {
      return colorScale(value, minValue, maxValue);
    }

    return defaultColorScale(value, minValue, maxValue, colors);
  };

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

  const yLabelWidth = 60;
  const xLabelHeight = 30;
  const padding = 12;
  const chartWidth = typeof width === 'string' ? 600 : width;
  const availableWidth = chartWidth - yLabelWidth - padding * 2;
  const availableHeight = height - xLabelHeight - padding * 2 - (showLegend ? 40 : 0);
  
  const cellWidth = availableWidth / xLabels.length;
  const cellHeight = availableHeight / yLabels.length;
  const actualCellSize = Math.min(cellWidth, cellHeight);

  // Create gradient ID
  const gradientId = `heatmap-gradient-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`w-full rounded-[var(--radius-card)] border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-4 ${className ?? ''}`}>
      {(title || subtitle) && (
        <div className="mb-3">
          {title && <h3 className="text-sm font-semibold text-[color:var(--color-text-primary)]">{title}</h3>}
          {subtitle && <p className="mt-1 text-xs text-[color:var(--color-text-secondary)]">{subtitle}</p>}
        </div>
      )}

      <div className="relative" style={{ width: '100%', height }}>
        <svg width="100%" height={height} style={{ overflow: 'visible' }}>
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              {colors.map((color, index) => (
                <stop
                  key={`gradient-${index}`}
                  offset={`${(index / (colors.length - 1)) * 100}%`}
                  stopColor={color}
                />
              ))}
            </linearGradient>
          </defs>

          {/* Y-axis labels */}
          {yLabels.map((label, i) => (
            <text
              key={`y-${label}`}
              x={yLabelWidth - 8}
              y={padding + i * actualCellSize + actualCellSize / 2}
              textAnchor="end"
              dominantBaseline="middle"
              fill="var(--color-text-secondary)"
              fontSize="12"
            >
              {label}
            </text>
          ))}

          {/* X-axis labels */}
          {xLabels.map((label, i) => (
            <text
              key={`x-${label}`}
              x={yLabelWidth + i * actualCellSize + actualCellSize / 2}
              y={height - (showLegend ? 40 : 10)}
              textAnchor="middle"
              fill="var(--color-text-secondary)"
              fontSize="12"
            >
              {label}
            </text>
          ))}

          {/* Heatmap cells */}
          {yLabels.map((yLabel, yIndex) =>
            xLabels.map((xLabel, xIndex) => {
              const value = gridData.get(`${xLabel}_${yLabel}`);
              const color = value !== undefined ? getColor(value) : colors[0];

              return (
                <rect
                  key={`cell-${xLabel}-${yLabel}`}
                  x={yLabelWidth + xIndex * actualCellSize + 1}
                  y={padding + yIndex * actualCellSize + 1}
                  width={actualCellSize - 2}
                  height={actualCellSize - 2}
                  rx="4"
                  ry="4"
                  fill={color}
                  stroke="var(--color-card)"
                  strokeWidth={1}
                  style={{ cursor: showTooltip ? 'pointer' : 'default' }}
                  onMouseEnter={() =>
                    showTooltip && value !== undefined &&
                    setHoveredCell({ x: xLabel, y: yLabel, value })
                  }
                  onMouseLeave={() => setHoveredCell(null)}
                />
              );
            })
          )}
        </svg>

        {/* Tooltip */}
        {showTooltip && hoveredCell && (
          <div
            className="pointer-events-none absolute rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-card)] px-2 py-1 shadow-lg"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 10,
            }}
          >
            <div className="text-xs">
              <div className="text-[color:var(--color-text-secondary)]">
                {String(xKey)}: {hoveredCell.x}
              </div>
              <div className="text-[color:var(--color-text-secondary)]">
                {String(yKey)}: {hoveredCell.y}
              </div>
              <div className="font-semibold text-[color:var(--color-text-primary)]">
                {String(valueKey)}: {hoveredCell.value}
              </div>
            </div>
          </div>
        )}
      </div>

      {showLegend && (
        <div className="mt-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-[color:var(--color-text-secondary)]">
              {minValue.toFixed(0)}
            </span>
            <div className="relative flex-1">
              <svg width="100%" height="16" style={{ display: 'block' }}>
                <defs>
                  <linearGradient id={`${gradientId}-legend`} x1="0%" y1="0%" x2="100%" y2="0%">
                    {colors.map((color, index) => (
                      <stop
                        key={`legend-gradient-${index}`}
                        offset={`${(index / (colors.length - 1)) * 100}%`}
                        stopColor={color}
                      />
                    ))}
                  </linearGradient>
                </defs>
                <rect
                  x="0"
                  y="0"
                  width="100%"
                  height="16"
                  rx="4"
                  fill={`url(#${gradientId}-legend)`}
                />
              </svg>
            </div>
            <span className="text-xs font-medium text-[color:var(--color-text-secondary)]">
              {maxValue.toFixed(0)}
            </span>
          </div>
          <div className="mt-1 text-center">
            <span className="text-xs text-[color:var(--color-text-secondary)]">
              {String(valueKey)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeatmapChart;