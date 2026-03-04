import React from 'react';
import {
  Treemap,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '../ui/chart';
import './dashboard-theme.css';

export interface BaseTreemapProps {
  // Required props
  data: Record<string, any>[];
  dataKey: string;
  nameKey: string;

  // Optional props
  colors?: string[];
  aspectRatio?: number;
  stroke?: string;
  showTooltip?: boolean;
  className?: string;
}

const DEFAULT_COLORS = [
  'var(--color-blue-dark)', // dark blue
  'var(--color-blue-cyan)', // cyan blue
  'var(--color-blue-bright)', // bright blue
  'var(--color-blue-navy)', // navy blue
  'var(--color-blue-primary)', // primary blue
  'var(--color-blue-medium)', // medium blue
  'var(--color-blue-light)', // light blue
  'var(--color-accent)', // accent cyan
];

/**
 * BaseTreemap - A flexible treemap chart component for hierarchical proportional data visualization
 *
 * Supports:
 * - Hierarchical data visualization
 * - Customizable colors and aspect ratio
 * - Configurable tooltip and stroke styling
 * - Automatic layout and sizing
 *
 * @component
 * @example
 * const data = [
 *   { name: 'Category A', value: 120 },
 *   { name: 'Category B', value: 80 },
 *   { name: 'Category C', value: 150 },
 * ];
 *
 * <BaseTreemap
 *   data={data}
 *   dataKey="value"
 *   nameKey="name"
 *   strokeOpacity={0.3}
 * />
 */
export const BaseTreemap: React.FC<BaseTreemapProps> = ({
  data,
  dataKey,
  nameKey,
  colors = DEFAULT_COLORS,
  aspectRatio = 2,
  stroke = '#fff',
  showTooltip = true,
  className = '',
}) => {
  // Validate inputs
  if (!data || data.length === 0) {
    return <div className={className}>No data available</div>;
  }

  if (!dataKey) {
    return <div className={className}>dataKey is required</div>;
  }

  if (!nameKey) {
    return <div className={className}>nameKey is required</div>;
  }

  // Create chart configuration for shadcn/ui integration
  const chartConfig: ChartConfig = {};

  // Assign colors to data items
  const coloredData = data.map((item, index) => ({
    ...item,
    fill: colors[index % colors.length],
  }));

  return (
    <ChartContainer config={chartConfig} className={`w-full h-full ${className}`}>
      <div style={{ width: '100%', height: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <Treemap
            data={coloredData}
            dataKey={dataKey}
            nameKey={nameKey}
            stroke={stroke}
            fill="var(--color-blue-primary)"
            isAnimationActive={true}
          >
            {showTooltip && (
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                }}
                formatter={(value: number) => value.toLocaleString()}
                labelFormatter={(label: string) =>
                  `${label}`
                }
              />
            )}
          </Treemap>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
};

export default BaseTreemap;
