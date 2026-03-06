import React, { useMemo, useState, useCallback } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Customized,
} from 'recharts';
import {
  ChartContainer,
  type ChartConfig,
} from '../ui/chart';
import './dashboard-theme.css';

export interface Threshold {
  value: number;
  color: string;
}

export interface GaugeChartProps {
  // Required props
  value: number;
  min: number;
  max: number;

  // Optional props
  thresholds?: Threshold[];
  needleColor?: string;
  arcWidth?: number;
  showTicks?: boolean;
  showLabel?: boolean;
  labelFormatter?: (value: number) => string;
  startAngle?: number;
  endAngle?: number;
  className?: string;
}

/**
 * GaugeChart - A radial gauge chart for performance visualization
 *
 * Supports:
 * - Customizable value range (min/max)
 * - Color thresholds for performance levels
 * - Custom needle/pointer rendering
 * - Tick marks and labels
 * - Angle customization for partial gauges
 *
 * @component
 * @example
 * const thresholds = [
 *   { value: 30, color: '#d4183d' },
 *   { value: 70, color: '#f59e0b' },
 *   { value: 100, color: '#10b981' },
 * ];
 *
 * <GaugeChart
 *   value={75}
 *   min={0}
 *   max={100}
 *   thresholds={thresholds}
 *   showLabel={true}
 * />
 */
const toPx = (value: number | string, total: number): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string' && value.endsWith('%')) {
    const pct = Number(value.replace('%', ''));
    return (pct / 100) * total;
  }
  return Number(value) || 0;
};

export const GaugeChart: React.FC<GaugeChartProps> = ({
  value,
  min,
  max,
  thresholds,
  needleColor = 'var(--color-text-primary)',
  arcWidth = 30,
  showTicks = true,
  showLabel = true,
  labelFormatter,
  startAngle = 180,
  endAngle = 0,
  className = '',
}) => {
  // Validate inputs
  if (value < min || value > max) {
    console.warn(
      `GaugeChart: value (${value}) should be between min (${min}) and max (${max})`
    );
  }

  // Calculate percentage
  const percentage = ((value - min) / (max - min)) * 100;

  // Default thresholds if not provided
  const defaultThresholds: Threshold[] = [
    { value: 33, color: 'var(--color-danger)' },
    { value: 66, color: '#f59e0b' },
    { value: 100, color: 'var(--color-success)' },
  ];

  const activeThresholds = thresholds || defaultThresholds;

  // Create gauge data segments
  const gaugeData = useMemo(() => {
    const segments = [];
    let lastValue = 0;

    for (let i = 0; i < activeThresholds.length; i++) {
      const threshold = activeThresholds[i];
      const segmentSize = threshold.value - lastValue;

      segments.push({
        name: `${lastValue}-${threshold.value}%`,
        value: segmentSize,
        color: threshold.color,
      });

      lastValue = threshold.value;
    }

    return segments;
  }, [activeThresholds]);

  // Calculate needle angle
  const percentageClamped = Math.max(0, Math.min(1, (value - min) / (max - min)));
  const needleAngle = startAngle + (endAngle - startAngle) * percentageClamped;

  const chartConfig: ChartConfig = {};

  const cx: number | string = '50%';
  const cy: number | string = '100%';
  const outerRadius = 80;
  const innerRadius = Math.max(0, outerRadius - arcWidth);

  const needleLength = outerRadius - 8;

  return (
    <ChartContainer config={chartConfig} className={`w-full h-full ${className}`}>
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 40 }}>
            <Pie
              data={gaugeData}
              cx={cx}
              cy={cy}
              startAngle={startAngle}
              endAngle={endAngle}
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              dataKey="value"
              stroke="none"
            >
              {gaugeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>

            <Customized
              component={({ width, height }: any) => {
                // Calculate center based on actual container dimensions
                const centerX = (width || 400) / 2;
                const centerY = (height || 300) - 40;

                console.log('GaugeChart dimensions:', { width, height, centerX, centerY, needleAngle });

                return (
                  <g>
                    <line
                      x1={centerX}
                      y1={centerY}
                      x2={centerX + Math.cos((needleAngle * Math.PI) / 180) * needleLength}
                      y2={centerY - Math.sin((needleAngle * Math.PI) / 180) * needleLength}
                      stroke={needleColor}
                      strokeWidth={2}
                      strokeLinecap="round"
                    />
                    <circle cx={centerX} cy={centerY} r={4} fill={needleColor} />
                  </g>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Label below gauge */}
        {showLabel && (
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <div
              style={{
                fontSize: '28px',
                fontWeight: 'bold',
                color: 'var(--color-primary)',
              }}
            >
              {labelFormatter ? labelFormatter(value) : `${value}%`}
            </div>
            <div
              style={{
                fontSize: '12px',
                color: 'var(--color-text-secondary)',
                marginTop: '4px',
              }}
            >
              Range: {min} - {max}
            </div>
          </div>
        )}
      </div>
    </ChartContainer>
  );
};

export default GaugeChart;