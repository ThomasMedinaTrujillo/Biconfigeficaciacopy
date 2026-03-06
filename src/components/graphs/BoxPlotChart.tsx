import React, { useMemo } from 'react';
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Customized,
} from 'recharts';
import {
  ChartContainer,
  type ChartConfig,
} from '../ui/chart';
import './dashboard-theme.css';

export interface BoxPlotPoint {
  name: string;
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  outliers?: number[];
}

export interface BoxPlotColors {
  box: string;
  median: string;
  whisker: string;
}

export interface BoxPlotChartProps {
  // Required props
  data: BoxPlotPoint[];

  // Optional props
  showOutliers?: boolean;
  colors?: Partial<BoxPlotColors>;
  showTooltip?: boolean;
  showGrid?: boolean;
  className?: string;
}

const DEFAULT_COLORS: BoxPlotColors = {
  box: 'var(--color-blue-cyan)',
  median: 'var(--color-primary-dark)',
  whisker: 'var(--color-blue-navy)',
};

const BoxPlotShapes: React.FC<{
  chartProps: any;
  data: BoxPlotPoint[];
  colors: BoxPlotColors;
  showOutliers: boolean;
}> = ({ chartProps, data, colors, showOutliers }) => {
  const xAxisKey = Object.keys(chartProps.xAxisMap || {})[0];
  const yAxisKey = Object.keys(chartProps.yAxisMap || {})[0];

  if (!xAxisKey || !yAxisKey) {
    return null;
  }

  const xScale = chartProps.xAxisMap[xAxisKey]?.scale;
  const yScale = chartProps.yAxisMap[yAxisKey]?.scale;

  if (!xScale || !yScale) {
    return null;
  }

  // For band scale this is > 0, for point scale this is usually 0.
  const rawBandWidth =
    typeof xScale.bandwidth === 'function' ? Number(xScale.bandwidth()) : 0;

  // Fallback slot width when using point scale.
  const plotWidth = Number(chartProps?.offset?.width ?? 0);
  const estimatedSlotWidth = plotWidth > 0 ? plotWidth / Math.max(data.length, 1) : 40;

  const slotWidth = rawBandWidth > 0 ? rawBandWidth : estimatedSlotWidth;

  // Dynamic: 55% of slot, with sensible min/max limits.
  const boxWidth = Math.max(10, Math.min(42, slotWidth * 0.55));
  const whiskerCapWidth = Math.max(8, boxWidth * 0.7);

  return (
    <g>
      {data.map((point) => {
        const xValue = Number(xScale(point.name));
        if (!Number.isFinite(xValue)) return null;

        // If band scale, convert left-edge -> center. If point scale, xValue is already center.
        const xCenter = xValue + (rawBandWidth > 0 ? rawBandWidth / 2 : 0);

        const yMin = yScale(point.min);
        const yQ1 = yScale(point.q1);
        const yMedian = yScale(point.median);
        const yQ3 = yScale(point.q3);
        const yMax = yScale(point.max);

        const boxTop = Math.min(yQ1, yQ3);
        const rawBoxHeight = Math.abs(yQ1 - yQ3);

        // Keep IQR box visible even when q1 ~= q3
        const minVisualBoxHeight = 10;
        const boxHeight = Math.max(rawBoxHeight, minVisualBoxHeight);
        const boxY = boxTop - (boxHeight - rawBoxHeight) / 2;

        return (
          <g key={point.name}>
            {/* Whiskers */}
            <line x1={xCenter} y1={yMax} x2={xCenter} y2={yQ3} stroke={colors.whisker} strokeWidth={2} />
            <line x1={xCenter} y1={yMin} x2={xCenter} y2={yQ1} stroke={colors.whisker} strokeWidth={2} />

            {/* Whisker caps */}
            <line
              x1={xCenter - whiskerCapWidth / 2}
              y1={yMax}
              x2={xCenter + whiskerCapWidth / 2}
              y2={yMax}
              stroke={colors.whisker}
              strokeWidth={2}
            />
            <line
              x1={xCenter - whiskerCapWidth / 2}
              y1={yMin}
              x2={xCenter + whiskerCapWidth / 2}
              y2={yMin}
              stroke={colors.whisker}
              strokeWidth={2}
            />

            {/* IQR box */}
            <rect
              x={xCenter - boxWidth / 2}
              y={boxY}
              width={boxWidth}
              height={boxHeight}
              fill={colors.box}
              fillOpacity={0.35}
              stroke={colors.whisker}
              strokeWidth={2}
              rx={4}
              ry={4}
            />

            {/* Median line inside box */}
            <line
              x1={xCenter - boxWidth / 2}
              y1={yMedian}
              x2={xCenter + boxWidth / 2}
              y2={yMedian}
              stroke={colors.median}
              strokeWidth={3}
            />

            {/* Outliers rendered as custom points */}
            {showOutliers &&
              (point.outliers || []).map((outlier, index) => (
                <circle
                  key={`${point.name}-outlier-${index}`}
                  cx={xCenter}
                  cy={yScale(outlier)}
                  r={4}
                  fill={colors.median}
                  fillOpacity={0.9}
                  stroke="white"
                  strokeWidth={1.5}
                />
              ))}
          </g>
        );
      })}
    </g>
  );
};

/**
 * BoxPlotChart - Quartile distribution chart with custom box/whisker rendering.
 *
 * Built with Recharts primitives (`Line`, `Rectangle`) and custom SVG shapes.
 */
export const BoxPlotChart: React.FC<BoxPlotChartProps> = ({
  data,
  showOutliers = true,
  colors,
  showTooltip = true,
  showGrid = true,
  className = '',
}) => {
  if (!data || data.length === 0) {
    return <div className={className}>No data available</div>;
  }

  const activeColors = { ...DEFAULT_COLORS, ...(colors || {}) };

  const chartConfig: ChartConfig = {
    median: {
      label: 'Median',
      color: activeColors.median,
    },
  };

  const yDomain = useMemo(() => {
    const values = data.flatMap((point) => [
      point.min,
      point.q1,
      point.median,
      point.q3,
      point.max,
      ...(point.outliers || []),
    ]);

    const min = Math.min(...values);
    const max = Math.max(...values);
    const pad = (max - min) * 0.1 || 1;

    return [min - pad, max + pad];
  }, [data]);

  return (
    <ChartContainer config={chartConfig} className={`w-full h-full ${className}`}>
      <div style={{ width: '100%', height: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 20, right: 20, left: 16, bottom: 20 }}
          >
            {showGrid && (
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--chart-grid)"
                opacity={0.5}
              />
            )}

            <XAxis
              dataKey="name"
              padding={{ left: 24, right: 24 }}
              stroke="var(--color-text-secondary)"
              tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
            />
            <YAxis
              domain={yDomain as [number, number]}
              stroke="var(--color-text-secondary)"
              tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
            />

            {showTooltip && (
              <Tooltip
                formatter={(value: number, key: string) => [value, key]}
                contentStyle={{
                  borderRadius: 8,
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-card)',
                }}
              />
            )}

            {/* A subtle trend line for median progression across categories. */}
            <Line
              type="monotone"
              dataKey="median"
              stroke={activeColors.median}
              strokeWidth={1.5}
              dot={false}
              activeDot={{ r: 4 }}
            />

            <Customized
              component={(chartProps: any) => (
                <BoxPlotShapes
                  chartProps={chartProps}
                  data={data}
                  colors={activeColors}
                  showOutliers={showOutliers}
                />
              )}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
};

export default BoxPlotChart;
