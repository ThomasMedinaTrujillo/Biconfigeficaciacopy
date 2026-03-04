import React from 'react';
import BaseBarChart from "./components/graphs/BaseBarChart";
import BaseLineChart from "./components/graphs/BaseLineChart";
import BaseAreaChart from "./components/graphs/BaseAreaChart";
import BasePieChart from "./components/graphs/BasePieChart";
import BaseScatterChart from "./components/graphs/BaseScatterChart";
import BaseComposedChart from "./components/graphs/BaseComposedChart";
import BaseTreemap from "./components/graphs/BaseTreemap";
import BaseFunnelChart from "./components/graphs/BaseFunnelChart";
import GaugeChart from "./components/graphs/GaugeChart";
import WaterfallChart from "./components/graphs/WaterfallChart/WaterfallChart";
import HeatmapChart from "./components/graphs/HeatmapChart/HeatmapChart";
import HeatmapGridChart from "./components/graphs/HeatmapGridChart/HeatmapGridChart";
import BoxPlotChart from "./components/graphs/BoxPlotChart";
import KpiCard from "./components/graphs/KpiCard";

interface CardProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  formula?: string;
}

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
}

const Card: React.FC<CardProps> = ({ children, title, description, formula }) => (
  <div
    style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
      border: '1px solid #e5e7eb',
    }}
  >
    <div style={{ marginBottom: '16px' }}>
      <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600', color: '#253a66' }}>
        {title}
      </h3>
      {description && (
        <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#666' }}>
          {description}
        </p>
      )}
      {formula && (
        <p style={{ margin: '0', fontSize: '12px', color: '#005fa0', fontFamily: 'monospace' }}>
          {formula}
        </p>
      )}
    </div>
    <div style={{ height: '380px' }}>
      {children}
    </div>
  </div>
);

const MetricCard: React.FC<MetricCardProps> = ({ label, value, unit }) => (
  <div
    style={{
      flex: '1',
      padding: '16px',
      backgroundColor: '#f0f9ff',
      borderRadius: '8px',
      textAlign: 'center',
      minWidth: '150px',
    }}
  >
    <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
      {label}
    </div>
    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#005fa0' }}>
      {value}{unit && <span style={{ fontSize: '14px' }}>{unit}</span>}
    </div>
  </div>
);

const GraphShowcase = () => {
  // Core business data - reusable across multiple charts
  const monthlyData = [
    { month: 'Enero', salesQ1: 68, salesQ2: 72, salesQ3: 65, target: 75, completed: 68 },
    { month: 'Feb', salesQ1: 71, salesQ2: 68, salesQ3: 70, target: 75, completed: 71 },
    { month: 'Mar', salesQ1: 65, salesQ2: 75, salesQ3: 72, target: 75, completed: 65 },
    { month: 'Abr', salesQ1: 50, salesQ2: 56, salesQ3: 54, target: 75, completed: 50 },
    { month: 'May', salesQ1: 68, salesQ2: 65, salesQ3: 69, target: 75, completed: 68 },
    { month: 'Jun', salesQ1: 72, salesQ2: 70, salesQ3: 71, target: 75, completed: 72 },
  ];

  const departmentData = [
    { name: 'Sales', value: 35, percentage: 35 },
    { name: 'Marketing', value: 25, percentage: 25 },
    { name: 'Development', value: 28, percentage: 28 },
    { name: 'Operations', value: 12, percentage: 12 },
  ];

  const performanceData = [
    { quarter: 'Q1', revenue: 45000, profit: 12000, expenses: 33000 },
    { quarter: 'Q2', revenue: 52000, profit: 15600, expenses: 36400 },
    { quarter: 'Q3', revenue: 48000, profit: 14400, expenses: 33600 },
    { quarter: 'Q4', revenue: 62000, profit: 18600, expenses: 43400 },
  ];

  const correlationData = [
    { teamSize: 3, productivity: 65, efficiency: 72 },
    { teamSize: 5, productivity: 72, efficiency: 78 },
    { teamSize: 8, productivity: 80, efficiency: 85 },
    { teamSize: 10, productivity: 88, efficiency: 92 },
    { teamSize: 12, productivity: 82, efficiency: 80 },
    { teamSize: 15, productivity: 75, efficiency: 72 },
  ];

  const hierarchicalData = [
    { name: 'Product A', value: 120 },
    { name: 'Product B', value: 200 },
    { name: 'Product C', value: 150 },
    { name: 'Product D', value: 180 },
    { name: 'Product E', value: 95 },
  ];

  const funnelData = [
    { name: 'Visited', value: 12000 },
    { name: 'Viewed', value: 9600 },
    { name: 'Added to Cart', value: 6400 },
    { name: 'Checked Out', value: 4800 },
    { name: 'Purchased', value: 3200 },
  ];

  const waterfallData = [
    { name: 'Start', value: 1000, type: 'total' as const },
    { name: 'Sales', value: 420, type: 'increase' as const },
    { name: 'Returns', value: -120, type: 'decrease' as const },
    { name: 'Marketing', value: 180, type: 'increase' as const },
    { name: 'Fees', value: -90, type: 'decrease' as const },
    { name: 'End', value: 0, type: 'total' as const },
  ];

  const gaugeThresholds = [
    { value: 33, color: 'var(--color-danger)' },
    { value: 66, color: '#f59e0b' },
    { value: 100, color: 'var(--color-success)' },
  ];

  const satisfactionThresholds = [
    { value: 25, color: '#ef4444' },
    { value: 50, color: '#f97316' },
    { value: 75, color: '#eab308' },
    { value: 100, color: '#22c55e' },
  ];

  const heatmapData = [
    { day: 'Mon', period: 'Morning', intensity: 18 },
    { day: 'Mon', period: 'Afternoon', intensity: 42 },
    { day: 'Mon', period: 'Evening', intensity: 29 },
    { day: 'Tue', period: 'Morning', intensity: 24 },
    { day: 'Tue', period: 'Afternoon', intensity: 50 },
    { day: 'Tue', period: 'Evening', intensity: 35 },
    { day: 'Wed', period: 'Morning', intensity: 31 },
    { day: 'Wed', period: 'Afternoon', intensity: 63 },
    { day: 'Wed', period: 'Evening', intensity: 47 },
    { day: 'Thu', period: 'Morning', intensity: 28 },
    { day: 'Thu', period: 'Afternoon', intensity: 58 },
    { day: 'Thu', period: 'Evening', intensity: 40 },
    { day: 'Fri', period: 'Morning', intensity: 36 },
    { day: 'Fri', period: 'Afternoon', intensity: 72 },
    { day: 'Fri', period: 'Evening', intensity: 55 },
  ];

  const boxPlotData = [
    { name: 'SKU A', min: 78, q1: 86, median: 92, q3: 98, max: 108, outliers: [72, 114] },
    { name: 'SKU B', min: 64, q1: 72, median: 81, q3: 89, max: 99, outliers: [58, 104] },
    { name: 'SKU C', min: 52, q1: 60, median: 67, q3: 74, max: 82, outliers: [48, 86] },
    { name: 'SKU D', min: 88, q1: 95, median: 103, q3: 111, max: 121, outliers: [84, 128] },
    { name: 'SKU E', min: 70, q1: 79, median: 87, q3: 94, max: 102, outliers: [66, 108] },
  ];

  const kpiSparklineData = [58, 61, 63, 60, 66, 68, 71, 69, 73, 76, 75, 79];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '48px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#253a66', margin: '0 0 12px 0' }}>
            Dashboard Charts Showcase
          </h1>
          <p style={{ fontSize: '14px', color: '#666', margin: '0' }}>
            A comprehensive collection of reusable chart components for data visualization
          </p>
        </div>

        {/* Performance Metrics Section */}
        <div style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#253a66', marginBottom: '24px', paddingBottom: '12px', borderBottom: '2px solid #005fa0' }}>
            Performance Metrics
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
            <Card
              title="% estrategia implementada"
              description="Strategic implementation progress across the organization"
              formula="(COUNT(estrategias_implementadas) / COUNT(total_estrategias)) * 100"
            >
              <BaseLineChart
                data={monthlyData}
                xKey="month"
                yKeys={['completed', 'target']}
                curveType="monotone"
                showDots={true}
                showLegend={true}
              />
            </Card>
          </div>

          {/* Metrics Row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px',
              marginTop: '20px',
            }}
          >
            <MetricCard label="Histórico" value="6" unit=" meses" />
            <MetricCard label="Frecuencia" value="Mensual" unit="" />
            <MetricCard label="Accionables" value="4" unit="" />
          </div>
        </div>

        {/* Area & Composed Charts */}
        <div style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#253a66', marginBottom: '24px', paddingBottom: '12px', borderBottom: '2px solid #005fa0' }}>
            Trend Analysis
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            <Card
              title="Quarterly Revenue Distribution"
              description="Stacked area view of revenue streams"
            >
              <BaseAreaChart
                data={performanceData}
                xKey="quarter"
                yKeys={['profit', 'expenses']}
                stacked={true}
                opacity={0.7}
                curveType="monotone"
              />
            </Card>

            <Card
              title="Target vs Actual Performance"
              description="Revenue achievement across quarters"
            >
              <BaseComposedChart
                data={performanceData}
                xKey="quarter"
                barKeys={['revenue']}
                lineKeys={['profit']}
                showLegend={true}
              />
            </Card>
          </div>
        </div>

        {/* Bar Charts */}
        <div style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#253a66', marginBottom: '24px', paddingBottom: '12px', borderBottom: '2px solid #005fa0' }}>
            Quarterly Breakdown
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
            <Card
              title="Monthly Sales by Quarter"
              description="Grouped comparison of sales metrics"
            >
              <BaseBarChart
                data={monthlyData}
                xKey="month"
                yKeys={['salesQ1', 'salesQ2', 'salesQ3']}
                stacked={false}
                showLegend={true}
              />
            </Card>

            <Card
              title="Compliance Rate"
              description="Monthly implementation progress"
            >
              <BaseBarChart
                data={monthlyData}
                xKey="month"
                yKeys={['completed']}
                showLegend={false}
              />
            </Card>
          </div>
        </div>

        {/* Pie & Composition */}
        <div style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#253a66', marginBottom: '24px', paddingBottom: '12px', borderBottom: '2px solid #005fa0' }}>
            Distribution & Allocation
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
            <Card
              title="Department Resource Allocation"
              description="Budget distribution across teams"
            >
              <BasePieChart
                data={departmentData}
                dataKey="value"
                nameKey="name"
                showLegend={true}
                innerRadius={60}
                outerRadius={100}
              />
            </Card>

            <Card
              title="Implementation by Department"
              description="Percentage breakdown of completed strategies"
            >
              <BasePieChart
                data={departmentData}
                dataKey="percentage"
                nameKey="name"
                showLegend={true}
                label={true}
              />
            </Card>
          </div>
        </div>

        {/* Correlation Analysis */}
        <div style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#253a66', marginBottom: '24px', paddingBottom: '12px', borderBottom: '2px solid #005fa0' }}>
            Correlation Insights
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
            <Card
              title="Team Size vs Productivity"
              description="Correlation between team composition and performance metrics"
            >
              <BaseScatterChart
                data={correlationData}
                xKey="teamSize"
                yKey="productivity"
                zKey="efficiency"
                shape="circle"
                showLegend={true}
                showTooltip={true}
              />
            </Card>

            <Card
              title="Activity Intensity Heatmap"
              description="2D grid view of intensity values by day and period"
            >
              <HeatmapChart
                data={heatmapData}
                xKey="day"
                yKey="period"
                valueKey="intensity"
                showLegend={true}
                showTooltip={true}
                cellSize={28}
              />
            </Card>

            <Card
              title="Activity Intensity Heatmap (Grid Lib)"
              description="Alternative implementation using react-heatmap-grid"
            >
              <HeatmapGridChart
                data={heatmapData}
                xKey="day"
                yKey="period"
                valueKey="intensity"
                showLegend={true}
                showTooltip={true}
                cellSize={28}
              />
            </Card>
          </div>
        </div>

        {/* Advanced Visualizations */}
        <div style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#253a66', marginBottom: '24px', paddingBottom: '12px', borderBottom: '2px solid #005fa0' }}>
            Advanced Visualizations
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            <Card
              title="Revenue vs Profit Analysis"
              description="Pareto-style analysis of quarterly performance"
            >
              <BaseComposedChart
                data={performanceData}
                xKey="quarter"
                barKeys={['revenue']}
                lineKeys={['profit']}
                showLegend={true}
                showTooltip={true}
              />
            </Card>

            <Card
              title="7️⃣ BaseTreemap"
              description="Hierarchical proportional data visualization"
            >
              <BaseTreemap
                data={hierarchicalData}
                dataKey="value"
                nameKey="name"
                showTooltip={true}
              />
            </Card>

            <Card
              title="8️⃣ BaseFunnelChart"
              description="Conversion flow visualization"
            >
              <BaseFunnelChart
                data={funnelData}
                dataKey="value"
                nameKey="name"
                showLegend={true}
                showTooltip={true}
                isAnimationActive={true}
              />
            </Card>

            <Card
              title="1️⃣2️⃣ BoxPlotChart (Custom)"
              description="A box plot chart implemented with Line, Rectangle, and custom shapes"
            >
              <BoxPlotChart
                data={boxPlotData}
                showOutliers={true}
                showTooltip={true}
                showGrid={true}
                colors={{
                  box: 'var(--color-blue-cyan)',
                  median: 'var(--color-primary-dark)',
                  whisker: 'var(--color-blue-navy)',
                }}
              />
            </Card>
          </div>
        </div>

        {/* Performance Indicators */}
        <div style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#253a66', marginBottom: '24px', paddingBottom: '12px', borderBottom: '2px solid #005fa0' }}>
            Performance Indicators
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            <Card
              title="System Load"
              description="CPU usage monitoring with warning thresholds"
            >
              <GaugeChart
                value={58}
                min={0}
                max={100}
                thresholds={gaugeThresholds}
                showLabel={true}
                labelFormatter={(val) => `${val}% CPU`}
                needleColor="var(--color-primary)"
              />
            </Card>

            <Card
              title="Customer Satisfaction"
              description="Multi-level satisfaction score (4 thresholds)"
            >
              <GaugeChart
                value={88}
                min={0}
                max={100}
                thresholds={satisfactionThresholds}
                showLabel={true}
                labelFormatter={(val) => `${val}/100 Score`}
                needleColor="#22c55e"
              />
            </Card>

            <Card
              title="1️⃣3️⃣ KpiCard"
              description="KPI display card with trend and sparkline"
            >
              <KpiCard
                value={79}
                label="On-shelf Availability"
                previousValue={72}
                format="percent"
                showTrend={true}
                sparklineData={kpiSparklineData}
                target={85}
                showProgress={true}
              />
            </Card>
          </div>
        </div>

        {/* Waterfall Analysis */}
        <div style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#253a66', marginBottom: '24px', paddingBottom: '12px', borderBottom: '2px solid #005fa0' }}>
            Waterfall Analysis
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
            <Card
              title="Cumulative Contribution Breakdown"
              description="Waterfall view of positive and negative drivers"
            >
              <WaterfallChart
                data={waterfallData}
                showConnectorLines={true}
                showGrid={true}
                showTooltip={true}
                showLegend={true}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphShowcase;