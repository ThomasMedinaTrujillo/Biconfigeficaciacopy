import React from 'react';
import {
  LineChart,
  Line,
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

export interface BaseLineChartProps {
  // Required props
  data: Record<string, any>[];
  xKey: string;
  yKeys: string[];

  // Optional props
  colors?: string[];
  strokeWidth?: number;
  showDots?: boolean;
  showGrid?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  curveType?: 'monotone' | 'linear' | 'step';
  secondaryAxisKey?: string;
  secondaryAxisOrientation?: 'left' | 'right';
  xAxisLabel?: string;
  yAxisLabel?: string;
  className?: string;
}

const DEFAULT_COLORS = [
  'var(--color-primary)', // primary blue
  'var(--color-accent)', // accent cyan
  'var(--color-success)', // success green
  'var(--color-danger)', // danger red
  '#7c3aed', // vibrant purple
  '#06b6d4', // light cyan
  '#6366f1', // indigo
  '#14b8a6', // teal
];

/**
 * BaseLineChart - A configurable line chart for time-series trends, comparisons, and dual-axis visualizations
 *
 * Supports:
 * - Multiple line series with customizable colors and stroke widths
 * - Different curve types (monotone, linear, step)
 * - Optional dots at data points
 * - Dual-axis visualization for comparing different scales
 * - Configurable grid, legend, and tooltip display
 *
 * @component
 * @example
 * const data = [
 *   { month: 'Jan', revenue: 4000, users: 240 },
 *   { month: 'Feb', revenue: 3000, users: 221 },
 * ];
 *
 * <BaseLineChart
 *   data={data}
 *   xKey="month"
 *   yKeys={['revenue', 'users']}
 *   curveType="monotone"
 *   showDots={true}
 * />
 */
export const BaseLineChart: React.FC<BaseLineChartProps> = ({
  data,
  xKey,
  yKeys,
  colors = DEFAULT_COLORS,
  strokeWidth = 2,
  showDots = true,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  curveType = 'monotone',
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

  if (!yKeys || yKeys.length === 0) {
    return <div className={className}>No yKeys provided</div>;
  }

  // Create chart configuration for shadcn/ui integration
  const chartConfig: ChartConfig = {};
  yKeys.forEach((key, index) => {
    chartConfig[key] = {
      label: key.charAt(0).toUpperCase() + key.slice(1),
      color: colors[index % colors.length],
    };
  });

  // Determine which keys use the secondary axis
  const hasSecondaryAxis = !!secondaryAxisKey && yKeys.includes(secondaryAxisKey);

  return (
    <ChartContainer config={chartConfig} className={`w-full h-full ${className}`}>
      <div style={{ width: '100%', height: '400px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
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
              label={xAxisLabel ? { 
                value: xAxisLabel, 
                position: 'insideBottomRight', 
                offset: -10,
                fill: 'var(--color-text-primary)',
                fontSize: 13,
                fontWeight: 500
              } : undefined}
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
                      fontWeight: 500
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

            {showTooltip && (
              <Tooltip content={<ChartTooltipContent />} />
            )}

            {showLegend && yKeys.length > 1 && <Legend content={ChartLegendContent as any} />}

            {yKeys.map((key, index) => {
              const useSecondaryAxis = hasSecondaryAxis && key === secondaryAxisKey;
              
              return (
                <Line
                  key={key}
                  dataKey={key}
                  type={curveType}
                  stroke={colors[index % colors.length]}
                  strokeWidth={strokeWidth}
                  dot={showDots}
                  activeDot={{ r: 6 }}
                  yAxisId={useSecondaryAxis ? 'right' : 'left'}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
};

export default BaseLineChart;
