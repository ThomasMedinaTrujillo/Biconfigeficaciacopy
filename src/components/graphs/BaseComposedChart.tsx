import React from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '../ui/chart';
import './dashboard-theme.css';

export interface BaseComposedChartProps {
  // Required props
  data: Record<string, any>[];
  xKey: string;
  barKeys: string[];
  lineKeys: string[];

  // Optional props
  stacked?: boolean;
  colors?: string[];
  showGrid?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  secondaryAxisKey?: string;
  secondaryAxisOrientation?: 'left' | 'right';
  xAxisLabel?: string;
  yAxisLabel?: string;
  className?: string;
}

const DEFAULT_COLORS = [
  'var(--color-blue-cyan)', // cyan blue

  'var(--color-blue-dark)', // dark blue

  'var(--color-blue-navy)', // navy blue
  'var(--color-blue-primary)', // primary blue
  'var(--color-blue-medium)', // medium blue
  'var(--color-blue-bright)', // bright blue
  'var(--color-blue-light)', // light blue
  'var(--color-accent)', // accent cyan
];

/**
 * BaseComposedChart - A flexible composed chart combining bars, lines, and areas
 *
 * Supports:
 * - Multiple bar series with customizable colors
 * - Multiple line series overlaid on bars
 * - Stacked bar visualizations
 * - Dual-axis visualization for comparing different scales
 * - Ideal for Pareto analysis and target vs actual comparisons
 * - Configurable grid, legend, and tooltip display
 *
 * @component
 * @example
 * const data = [
 *   { month: 'Jan', sales: 400, profit: 240, target: 300 },
 *   { month: 'Feb', sales: 300, profit: 221, target: 280 },
 * ];
 *
 * <BaseComposedChart
 *   data={data}
 *   xKey="month"
 *   barKeys={['sales', 'profit']}
 *   lineKeys={['target']}
 *   stacked={true}
 * />
 */
export const BaseComposedChart: React.FC<BaseComposedChartProps> = ({
  data,
  xKey,
  barKeys,
  lineKeys,
  stacked = false,
  colors = DEFAULT_COLORS,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  secondaryAxisKey,
  secondaryAxisOrientation = 'right',
  xAxisLabel,
  yAxisLabel,
  className = '',
}) => {
  // Validate inputs
  if (!data || data.length === 0) {
    return <div className={className}>No data available</div>;
  }

  if (!barKeys || barKeys.length === 0) {
    return <div className={className}>barKeys are required</div>;
  }

  if (!lineKeys || lineKeys.length === 0) {
    return <div className={className}>lineKeys are required</div>;
  }

  // Create chart configuration for shadcn/ui integration
  const chartConfig: ChartConfig = {};
  const allKeys = [...barKeys, ...lineKeys];
  allKeys.forEach((key, index) => {
    chartConfig[key] = {
      label: key.charAt(0).toUpperCase() + key.slice(1),
      color: colors[index % colors.length],
    };
  });

  // Determine which keys use the secondary axis
  const hasSecondaryAxis = !!secondaryAxisKey && allKeys.includes(secondaryAxisKey);

  return (
    <ChartContainer config={chartConfig} className={`w-full h-full ${className}`}>
      <div style={{ width: '100%', height: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{
              top: 20,
              right: hasSecondaryAxis ? 60 : 30,
              left: xAxisLabel ? 60 : 30,
              bottom: yAxisLabel ? 60 : 20,
            }}
          >
            {showGrid && (
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--chart-grid)"
                opacity={0.5}
              />
            )}

            <XAxis
              dataKey={xKey}
              stroke="var(--color-text-secondary)"
              tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
              label={
                xAxisLabel
                  ? {
                      value: xAxisLabel,
                      position: 'insideBottomRight',
                      offset: -10,
                      fill: 'var(--color-text-primary)',
                      fontSize: 13,
                      fontWeight: 500,
                    }
                  : undefined
              }
            />

            <YAxis
              yAxisId="left"
              stroke="var(--color-text-secondary)"
              tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
              label={
                yAxisLabel
                  ? {
                      value: yAxisLabel,
                      angle: -90,
                      position: 'insideLeft',
                      fill: 'var(--color-text-primary)',
                      fontSize: 13,
                      fontWeight: 500,
                    }
                  : undefined
              }
            />

            {hasSecondaryAxis && (
              <YAxis
                yAxisId="right"
                orientation={secondaryAxisOrientation}
                stroke="var(--color-text-secondary)"
                tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
              />
            )}

            {showTooltip && <Tooltip content={<ChartTooltipContent />} />}

            {showLegend && allKeys.length > 1 && (
              <Legend content={ChartLegendContent as any} />
            )}

            {/* Render bars */}
            {barKeys.map((key, index) => {
              const useSecondaryAxis = hasSecondaryAxis && key === secondaryAxisKey;
              return (
                <Bar
                  key={key}
                  dataKey={key}
                  stackId={stacked ? 'bars' : undefined}
                  fill={colors[index % colors.length]}
                  yAxisId={useSecondaryAxis ? 'right' : 'left'}
                />
              );
            })}

            {/* Render lines */}
            {lineKeys.map((key, index) => {
              const useSecondaryAxis = hasSecondaryAxis && key === secondaryAxisKey;
              const colorIndex = (barKeys.length + index) % colors.length;
              return (
                <Line
                  key={key}
                  dataKey={key}
                  stroke={colors[colorIndex]}
                  strokeWidth={2}
                  dot={false}
                  yAxisId={useSecondaryAxis ? 'right' : 'left'}
                  activeDot={{ r: 6 }}
                />
              );
            })}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
};

export default BaseComposedChart;
