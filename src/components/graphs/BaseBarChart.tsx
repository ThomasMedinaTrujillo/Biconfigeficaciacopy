import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  Cell as RechartsCell,
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

export interface BaseBarChartProps {
  // Required props
  data: Record<string, any>[];
  xKey: string;
  yKeys: string[];

  // Optional props
  layout?: 'vertical' | 'horizontal';
  stacked?: boolean;
  barSize?: number;
  colors?: string[];
  showGrid?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  xAxisLabel?: string;
  yAxisLabel?: string;
  maxBarSize?: number;
  className?: string;
}

const DEFAULT_COLORS = [
  'var(--color-blue-dark)', // dark blue
  'var(--color-blue-cyan)', // cyan blue

  'var(--color-blue-primary)', // primary blue
  'var(--color-blue-bright)', // bright blue
  'var(--color-blue-navy)', // navy blue
  'var(--color-blue-medium)', // medium blue
  'var(--color-blue-light)', // light blue
  'var(--color-accent)', // accent cyan
];

/**
 * BaseBarChart - A flexible bar chart component supporting multiple visualization styles
 *
 * Supports:
 * - Vertical and horizontal layouts
 * - Grouped (side-by-side) and stacked bar visualizations
 * - Histogram-style (single continuous bars)
 * - Customizable colors, sizes, and labels
 * - Configurable grid, legend, and tooltip display
 *
 * @component
 * @example
 * const data = [
 *   { month: 'Jan', sales: 400, profit: 240 },
 *   { month: 'Feb', sales: 300, profit: 221 },
 * ];
 *
 * <BaseBarChart
 *   data={data}
 *   xKey="month"
 *   yKeys={['sales', 'profit']}
 *   layout="vertical"
 *   stacked={true}
 * />
 */
export const BaseBarChart: React.FC<BaseBarChartProps> = ({
  data,
  xKey,
  yKeys,
  layout = 'vertical',
  stacked = false,
  barSize,
  colors = DEFAULT_COLORS,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  xAxisLabel,
  yAxisLabel,
  maxBarSize = 80,
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

  // Determine if layout is horizontal (data X-axis becomes Y-axis)
  const isHorizontal = layout === 'horizontal';

  // Calculate bar size if not provided
  const finalBarSize = barSize || (yKeys.length > 1 ? 30 : 40);
  const constrainedBarSize = Math.min(finalBarSize, maxBarSize);

  return (
    <ChartContainer config={chartConfig} className={`w-full h-full ${className}`}>
      <div style={{ width: '100%', height: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout={isHorizontal ? 'vertical' : 'horizontal'}
            margin={{
              top: 20,
              right: 30,
              left: xAxisLabel ? 50 : 20,
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

            {isHorizontal ? (
              <>
                <XAxis 
                  type="number"
                  stroke="var(--color-text-secondary)"
                  tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
                />
                <YAxis
                  dataKey={xKey}
                  type="category"
                  width={120}
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
              </>
            ) : (
              <>
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
              </>
            )}

            {showTooltip && (
              <Tooltip content={<ChartTooltipContent />} />
            )}

            {showLegend && yKeys.length > 1 && <Legend content={ChartLegendContent as any} />}

            {yKeys.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                stackId={stacked ? 'stack' : undefined}
                fill={colors[index % colors.length]}
                barSize={constrainedBarSize}
                radius={[8, 8, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
};

export default BaseBarChart;
