import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
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

export interface BasePieChartProps {
  // Required props
  data: Record<string, any>[];
  dataKey: string;
  nameKey: string;

  // Optional props
  innerRadius?: number;
  outerRadius?: number;
  colors?: string[];
  showLegend?: boolean;
  showTooltip?: boolean;
  label?: boolean;
  paddingAngle?: number;
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
 * BasePieChart - A flexible pie/donut chart component for proportional data representation
 *
 * Supports:
 * - Pie and donut chart visualizations (via innerRadius)
 * - Customizable colors and sizes
 * - Configurable legend, tooltip, and label display
 * - Padding angle for visual separation
 * - Multiple data series with custom naming
 *
 * @component
 * @example
 * const data = [
 *   { name: 'Product A', value: 400 },
 *   { name: 'Product B', value: 300 },
 * ];
 *
 * <BasePieChart
 *   data={data}
 *   dataKey="value"
 *   nameKey="name"
 *   innerRadius={60}
 * />
 */
export const BasePieChart: React.FC<BasePieChartProps> = ({
  data,
  dataKey,
  nameKey,
  innerRadius = 0,
  outerRadius = 80,
  colors = DEFAULT_COLORS,
  showLegend = true,
  showTooltip = true,
  label = false,
  paddingAngle = 0,
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
  data.forEach((item, index) => {
    const name = item[nameKey];
    chartConfig[name] = {
      label: name,
      color: colors[index % colors.length],
    };
  });

  return (
    <ChartContainer config={chartConfig} className={`w-full h-full ${className}`}>
      <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            {showTooltip && (
              <Tooltip content={<ChartTooltipContent />} />
            )}

            {showLegend && <Legend content={ChartLegendContent as any} />}

            <Pie
              data={data}
              dataKey={dataKey}
              nameKey={nameKey}
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              paddingAngle={paddingAngle}
              label={label}
              cx="50%"
              cy="50%"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
};

export default BasePieChart;
