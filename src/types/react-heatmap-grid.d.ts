declare module 'react-heatmap-grid' {
  import type { CSSProperties, ReactNode } from 'react';

  export interface HeatMapProps {
    xLabels: string[];
    yLabels: string[];
    data: number[][];
    squares?: boolean;
    height?: number;
    xLabelWidth?: number;
    yLabelWidth?: number;
    xLabelsLocation?: 'top' | 'bottom';
    yLabelTextAlign?: 'left' | 'right' | 'center';
    xLabelsVisibility?: boolean[];
    displayYLabels?: boolean;
    unit?: string;
    xLabelsStyle?: CSSProperties;
    yLabelsStyle?: CSSProperties;
    cellStyle?: (background: unknown, value: number, min: number, max: number, data: number[][], x: number, y: number) => CSSProperties;
    cellRender?: (value: number, x: number, y: number) => ReactNode;
    title?: (value: number, unit: string, x: number, y: number) => string;
  }

  const HeatMap: (props: HeatMapProps) => ReactNode;
  export default HeatMap;
}
