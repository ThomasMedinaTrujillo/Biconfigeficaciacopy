import React from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
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

export interface BaseScatterChartProps {
  // Required props
  data: Record<string, any>[];
  xKey: string;
  yKey: string;

  // Optional props
  zKey?: string;
  colors?: string[];
  showGrid?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  shape?: 'circle' | 'triangle' | 'square';
  xDomain?: [number, number];
  yDomain?: [number, number];
  xAxisLabel?: string;
  yAxisLabel?: string;
  className?: string;
}

const DEFAULT_COLORS = [
  'var(--color-blue-dark)', // dark blue
  'var(--color-blue-navy)', // navy blue
  'var(--color-blue-primary)', // primary blue
  'var(--color-blue-medium)', // medium blue
  'var(--color-blue-bright)', // bright blue
  'var(--color-blue-light)', // light blue
  'var(--color-blue-cyan)', // cyan blue
  'var(--color-accent)', // accent cyan
];

/**
 * BaseScatterChart - A flexible scatter plot component for correlation and positioning analysis
 *
 * Supports:
 * - Correlation analysis between two numeric variables
 * - Optional bubble size representation via zKey
 * - Customizable point shapes (circle, triangle, square)
 * - Configurable domains for both axes
 * - Configurable grid, legend, and tooltip display
 *
 * @component
 * @example
 * const data = [
 *   { age: 25, salary: 45000, experience: 2 },
 *   { age: 30, salary: 65000, experience: 5 },
 * ];
 *
 * <BaseScatterChart
 *   data={data}
 *   xKey="age"
 *   yKey="salary"
 *   zKey="experience"
 *   shape="circle"
 * />
 */
export const BaseScatterChart: React.FC<BaseScatterChartProps> = ({
  data,
  xKey,
  yKey,
  zKey,
  colors = DEFAULT_COLORS,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  shape = 'circle',
  xDomain,
  yDomain,
  xAxisLabel,
  yAxisLabel,
  className = '',
}) => {
  // Validate inputs
  if (!data || data.length === 0) {
    return <div className={className}>No data available</div>;
  }

  if (!xKey) {
    return <div className={className}>xKey is required</div>;
  }

  if (!yKey) {
    return <div className={className}>yKey is required</div>;
  }

  // Create chart configuration for shadcn/ui integration
  const chartConfig: ChartConfig = {
    [xKey]: {
      label: xKey.charAt(0).toUpperCase() + xKey.slice(1),
      color: colors[0],
    },
    [yKey]: {
      label: yKey.charAt(0).toUpperCase() + yKey.slice(1),
      color: colors[1],
    },
  };

  if (zKey) {
    chartConfig[zKey] = {
      label: zKey.charAt(0).toUpperCase() + zKey.slice(1),
      color: colors[2],
    };
  }

  return (
    <ChartContainer config={chartConfig} className={`w-full h-full ${className}`}>
      <div style={{ width: '100%', height: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
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
              type="number"
              dataKey={xKey}
              name={xKey.charAt(0).toUpperCase() + xKey.slice(1)}
              stroke="var(--color-text-secondary)"
              tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
              domain={xDomain}
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
              type="number"
              dataKey={yKey}
              name={yKey.charAt(0).toUpperCase() + yKey.slice(1)}
              stroke="var(--color-text-secondary)"
              tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
              domain={yDomain}
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
              <Tooltip content={<ChartTooltipContent />} cursor={{ strokeDasharray: '3 3' }} />
            )}

            {showLegend && zKey && <Legend content={ChartLegendContent as any} />}

            <Scatter
              name={zKey ? zKey.charAt(0).toUpperCase() + zKey.slice(1) : yKey.charAt(0).toUpperCase() + yKey.slice(1)}
              dataKey={yKey}
              data={data}
              fill={colors[0]}
              fillOpacity={0.6}
            >
              {data.map((entry, index) => {
                // Use zKey for bubble size if provided, otherwise use fixed size
                const size = zKey && entry[zKey] ? (entry[zKey] / 100) * 10 : 4;
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                    fillOpacity={0.6}
                  />
                );
              })}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
};

export default BaseScatterChart;
