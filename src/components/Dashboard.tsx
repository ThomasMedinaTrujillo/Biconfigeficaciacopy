import { ArrowLeft } from 'lucide-react';
import { KpiCard } from './graphs/KpiCard';
import { GaugeChart } from './graphs/GaugeChart';
import { BaseLineChart } from './graphs/BaseLineChart';
import { BaseBarChart } from './graphs/BaseBarChart';
import { BaseAreaChart } from './graphs/BaseAreaChart';
import { BasePieChart } from './graphs/BasePieChart';
import { BaseTreemap } from './graphs/BaseTreemap';
import { BaseScatterChart } from './graphs/BaseScatterChart';
import { BaseComposedChart } from './graphs/BaseComposedChart';
import { BaseFunnelChart } from './graphs/BaseFunnelChart';
import BoxPlotChart from './graphs/BoxPlotChart';
import HeatmapChart from './graphs/HeatmapChart/HeatmapChart';
import WaterfallChart from './graphs/WaterfallChart/WaterfallChart';

// Simple dummy data generators
const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
const categories = ['Norte', 'Sur', 'Este', 'Oeste', 'Centro'];
const products = ['Producto A', 'Producto B', 'Producto C', 'Producto D'];

const generateTimeSeriesData = () => 
  months.map(month => ({ period: month, value: random(50, 150) }));

const generateCategoryData = () =>
  categories.map(cat => ({ name: cat, value: random(30, 100) }));

const generatePieData = () =>
  products.slice(0, 4).map(prod => ({ name: prod, value: random(20, 80) }));

const generateScatterData = () =>
  Array.from({ length: 20 }, (_, i) => ({
    x: random(10, 100),
    y: random(10, 100),
    z: random(5, 50),
    name: `Punto ${i + 1}`
  }));

const generateHeatmapData = () => {
  const data: Array<{ x: string; y: string; value: number }> = [];
  categories.slice(0, 4).forEach(cat => {
    months.slice(0, 4).forEach(month => {
      data.push({ x: month, y: cat, value: random(10, 90) });
    });
  });
  return data;
};

const generateBoxPlotData = () =>
  categories.slice(0, 4).map(cat => ({
    name: cat,
    min: random(20, 30),
    q1: random(40, 50),
    median: random(60, 70),
    q3: random(80, 90),
    max: random(100, 120),
    outliers: [random(5, 15), random(130, 140)]
  }));

const generateFunnelData = () => [
  { name: 'Visitas', value: 1000 },
  { name: 'Interesados', value: 750 },
  { name: 'Propuestas', value: 400 },
  { name: 'Cerrados', value: 200 }
];

const generateWaterfallData = () => [
  { name: 'Inicio', value: 100, type: 'total' as const },
  { name: 'Ventas', value: 50, type: 'increase' as const },
  { name: 'Costos', value: -30, type: 'decrease' as const },
  { name: 'Resultado', value: 120, type: 'total' as const }
];

export interface FormData {
  industry: string | null;
  selectedVariables: string[];
  indicatorConfigs: Record<string, any>;
}

interface DashboardProps {
  formData: FormData;
  onBack: () => void;
}

const getChartComponent = (indicator: any, index: number) => {
  const componentName = indicator.visualizationOptions?.find(
    (opt: any) => opt.id === indicator.visualizationType
  )?.chartComponent || 'KpiCard';

  const key = `chart-${index}`;

  switch (componentName) {
    case 'KpiCard':
      return (
        <KpiCard
          key={key}
          value={random(50, 200)}
          previousValue={random(40, 180)}
          label={indicator.name}
          format="number"
          showTrend
        />
      );

    case 'GaugeChart':
      return (
        <GaugeChart
          key={key}
          value={random(30, 95)}
          min={0}
          max={100}
          showLabel
        />
      );

    case 'BaseLineChart':
      return (
        <BaseLineChart
          key={key}
          data={generateTimeSeriesData()}
          xKey="period"
          yKeys={['value']}
          showDots
        />
      );

    case 'BaseAreaChart':
      return (
        <BaseAreaChart
          key={key}
          data={generateTimeSeriesData()}
          xKey="period"
          yKeys={['value']}
        />
      );

    case 'BaseBarChart':
      return (
        <BaseBarChart
          key={key}
          data={generateCategoryData()}
          xKey="name"
          yKeys={['value']}
        />
      );

    case 'BasePieChart':
      return (
        <BasePieChart
          key={key}
          data={generatePieData()}
          dataKey="value"
          nameKey="name"
          innerRadius={50}
        />
      );

    case 'BaseTreemap':
      return (
        <BaseTreemap
          key={key}
          data={generatePieData()}
          dataKey="value"
          nameKey="name"
        />
      );

    case 'BaseScatterChart':
      return (
        <BaseScatterChart
          key={key}
          data={generateScatterData()}
          xKey="x"
          yKey="y"
          zKey="z"
          xAxisLabel="Valor X"
          yAxisLabel="Valor Y"
        />
      );

    case 'BaseComposedChart': {
      const catData = generateCategoryData();
      let cumulative = 0;
      const total = catData.reduce((sum, item) => sum + item.value, 0);
      const composedData = catData.map(item => {
        cumulative += item.value;
        return {
          name: item.name,
          value: item.value,
          cumulative: (cumulative / total) * 100
        };
      });
      return (
        <BaseComposedChart
          key={key}
          data={composedData}
          xKey="name"
          barKeys={['value']}
          lineKeys={['cumulative']}
          secondaryAxisKey="cumulative"
        />
      );
    }

    case 'BaseFunnelChart':
      return (
        <BaseFunnelChart
          key={key}
          data={generateFunnelData()}
          dataKey="value"
          nameKey="name"
        />
      );

    case 'HeatmapChart':
      return (
        <HeatmapChart
          key={key}
          data={generateHeatmapData()}
          xKey="x"
          yKey="y"
          valueKey="value"
        />
      );

    case 'HeatmapGridChart':
      return (
        <HeatmapChart
          key={key}
          data={generateHeatmapData()}
          xKey="x"
          yKey="y"
          valueKey="value"
        />
      );

    case 'BoxPlotChart':
      return (
        <BoxPlotChart
          key={key}
          data={generateBoxPlotData()}
        />
      );

    case 'WaterfallChart':
      return (
        <WaterfallChart
          key={key}
          data={generateWaterfallData()}
        />
      );

    default:
      return (
        <KpiCard
          key={key}
          value={random(75, 250)}
          label={indicator.name}
          format="number"
        />
      );
  }
};

export function Dashboard({ formData, onBack }: DashboardProps) {
  const indicators = Object.values(formData.indicatorConfigs).filter(
    (config: any) => config.visualizationType !== null
  );

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Header */}
      <div className="bg-white border-b border-[rgba(0,0,0,0.1)]">
        <div className="max-w-[1400px] mx-auto px-6 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#005fa0] hover:text-[#41c0f0] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver a configuración
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-[32px] text-[#253a66] mb-2">
            Dashboard de Indicadores
          </h1>
          <p className="text-[#979797]">
            Visualizando {indicators.length} indicador{indicators.length !== 1 ? 'es' : ''}
          </p>
        </div>

        {/* Industry Badge */}
        {formData.industry && (
          <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
            <span className="text-[#979797]">Industria: </span>
            <span className="text-[#005fa0] font-semibold capitalize">
              {formData.industry.replace(/_/g, ' ')}
            </span>
          </div>
        )}

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {indicators.map((indicator: any, idx: number) => (
            <div key={idx} className="bg-white rounded-lg shadow-lg p-6 overflow-hidden">
              <div className="mb-4">
                <p className="text-[12px] uppercase tracking-wide text-[#979797]">
                  {indicator.variable}
                </p>
                <h3 className="text-[18px] text-[#253a66] font-semibold">
                  {indicator.name}
                </h3>
              </div>
              <div style={{ width: '100%', height: '320px' }}>
                {getChartComponent(indicator, idx)}
              </div>
            </div>
          ))}
        </div>

        {indicators.length === 0 && (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <p className="text-[#979797]">
              Selecciona indicadores en la configuración para verlos aquí
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
