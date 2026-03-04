import React from 'react';
import {
  AreaChart,
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

export interface BaseAreaChartProps {
  // Required props
  data: Record<string, any>[];
  xKey: string;
  yKeys: string[];

  // Optional props
  stacked?: boolean;
  colors?: string[];
  showGrid?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  curveType?: 'monotone' | 'linear';
  opacity?: number;
  xAxisLabel?: string;
  yAxisLabel?: string;
  className?: string;
}

const DEFAULT_COLORS = [
  'var(--color-blue-dark)', // dark blue
  'var(--color-blue-cyan)', // cyan blue

  'var(--color-blue-navy)', // navy blue
  'var(--color-blue-primary)', // primary blue
  'var(--color-blue-medium)', // medium blue
  'var(--color-blue-bright)', // bright blue
  'var(--color-blue-light)', // light blue
  'var(--color-accent)', // accent cyan
];

/**
 * BaseAreaChart - A configurable area chart supporting stacked areas, cumulative areas, and confidence bands
 *
 * Supports:
 * - Stacked and non-stacked area visualizations
 * - Multiple area series with customizable colors and opacity
 * - Different curve types (monotone, linear)
 * - Configurable grid, legend, and tooltip display
 * - Cumulative and confidence band visualizations
 *
 * @component
 * @example
 * const data = [
 *   { month: 'Jan', revenue: 4000, profit: 2400 },
 *   { month: 'Feb', revenue: 3000, profit: 1398 },
 * ];
 *
 * <BaseAreaChart
 *   data={data}
 *   xKey="month"
 *   yKeys={['revenue', 'profit']}
 *   stacked={true}
 *   opacity={0.7}
 * />
 */
export const BaseAreaChart: React.FC<BaseAreaChartProps> = ({
  data,
  xKey,
  yKeys,
  stacked = false,
  colors = DEFAULT_COLORS,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  curveType = 'monotone',
  opacity = 0.8,
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

  return (
    <ChartContainer config={chartConfig} className={`w-full h-full ${className}`}>
      <div style={{ width: '100%', height: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 20,
              right: 30,
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

            {showTooltip && (
              <Tooltip content={<ChartTooltipContent />} />
            )}

            {showLegend && yKeys.length > 1 && <Legend content={ChartLegendContent as any} />}

            {yKeys.map((key, index) => (
              <Area
                key={key}
                type={curveType}
                dataKey={key}
                stackId={stacked ? 'stack' : undefined}
                stroke={colors[index % colors.length]}
                fill={colors[index % colors.length]}
                fillOpacity={opacity}
                activeDot={{ r: 6 }}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
};

export default BaseAreaChart;
