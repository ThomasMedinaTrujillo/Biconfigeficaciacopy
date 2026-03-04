import React from 'react';
import {
  Funnel,
  FunnelChart,
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

export interface BaseFunnelChartProps {
  // Required props
  data: Record<string, any>[];
  dataKey: string;
  nameKey: string;

  // Optional props
  colors?: string[];
  showTooltip?: boolean;
  showLegend?: boolean;
  isAnimationActive?: boolean;
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
 * BaseFunnelChart - A flexible funnel chart component for conversion flow visualization
 *
 * Supports:
 * - Funnel visualization for conversion funnels and drop-off analysis
 * - Customizable colors and animation
 * - Configurable legend, tooltip display
 * - Multi-stage conversion tracking
 *
 * @component
 * @example
 * const data = [
 *   { name: 'Visited', value: 1000 },
 *   { name: 'Viewed', value: 800 },
 *   { name: 'Added to Cart', value: 500 },
 *   { name: 'Purchased', value: 300 },
 * ];
 *
 * <BaseFunnelChart
 *   data={data}
 *   dataKey="value"
 *   nameKey="name"
 *   showLegend={true}
 * />
 */
export const BaseFunnelChart: React.FC<BaseFunnelChartProps> = ({
  data,
  dataKey,
  nameKey,
  colors = DEFAULT_COLORS,
  showTooltip = true,
  showLegend = true,
  isAnimationActive = true,
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
      <div style={{ width: '100%', height: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <FunnelChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            {showTooltip && (
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                }}
                formatter={(value: number) => value.toLocaleString()}
              />
            )}

            {showLegend && <Legend content={ChartLegendContent as any} />}

            <Funnel
              data={data}
              dataKey={dataKey}
              nameKey={nameKey}
              isAnimationActive={isAnimationActive}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Funnel>
          </FunnelChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
};

export default BaseFunnelChart;
