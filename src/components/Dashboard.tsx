import { ArrowLeft, BarChart3, Database, Store, TrendingUp } from 'lucide-react';
import type { DataEntry } from './DataEntryForm';
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

const getIndicatorCandidateFields = (indicator: any) => {
  const fields = new Set<string>();

  if (typeof indicator?.variable === 'string' && indicator.variable.trim()) {
    fields.add(indicator.variable.trim());
  }

  const formula = formatIndicatorFormula(indicator?.formula);
  if (formula) {
    (formula.match(/[a-z_]+/gi) || []).forEach((f) => fields.add(f));
  }

  return Array.from(fields);
};

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
  dataEntries?: DataEntry[];
}

interface DashboardProps {
  formData: FormData;
  onBack: () => void;
}

const formatVariableLabel = (value: string | null | undefined) => {
  if (!value) return 'Sin variable asignada';
  return value
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

const formatIndicatorFormula = (formula: string | null | undefined) => {
  if (!formula || !formula.trim()) {
    return null;
  }
  return formula.replace(/\s+/g, ' ').trim();
};

const toNumeric = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const getIndicatorNumericValues = (indicator: any, dataEntries: DataEntry[]) => {
  if (!dataEntries.length) {
    return [] as number[];
  }

  const candidateFields = new Set<string>();
  if (typeof indicator?.variable === 'string' && indicator.variable.trim()) {
    candidateFields.add(indicator.variable.trim());
  }

  const formula = formatIndicatorFormula(indicator?.formula);
  if (formula) {
    const formulaMatches = formula.match(/[a-z_]+/gi) || [];
    formulaMatches.forEach(field => candidateFields.add(field));
  }

  const values: number[] = [];
  dataEntries.forEach((entry) => {
    const numericValuesForEntry: number[] = [];
    candidateFields.forEach((field) => {
      const num = toNumeric(entry[field]);
      if (num !== null) {
        numericValuesForEntry.push(num);
      }
    });
    if (numericValuesForEntry.length) {
      values.push(numericValuesForEntry[0]);
    }
  });

  return values;
};

const buildIndicatorInsights = (indicator: any, dataEntries: DataEntry[], totalUniquePdvs: number) => {
  if (!dataEntries.length) {
    return [] as Array<{ label: string; value: string }>;
  }

  const numericValues = getIndicatorNumericValues(indicator, dataEntries);
  if (!numericValues.length) {
    return [] as Array<{ label: string; value: string }>;
  }

  const avg = numericValues.reduce((sum, value) => sum + value, 0) / numericValues.length;
  const max = Math.max(...numericValues);
  const withDataCount = numericValues.filter(value => value > 0).length;
  const coverage = totalUniquePdvs > 0
    ? Math.min(100, Math.round((withDataCount / totalUniquePdvs) * 100))
    : 0;

  return [
    { label: 'Promedio', value: avg.toFixed(1) },
    { label: 'Maximo', value: max.toFixed(1) },
    { label: 'Cobertura PDV', value: `${coverage}%` },
  ];
};

const getChartComponent = (indicator: any, index: number, dataEntries?: DataEntry[]) => {
  const componentName = indicator.visualizationOptions?.find(
    (opt: any) => opt.id === indicator.visualizationType
  )?.chartComponent || 'KpiCard';

  const key = `chart-${index}`;

  // Transform data entries based on formula/variable
  const transformDataForChart = () => {
    if (!dataEntries || dataEntries.length === 0) {
      return null;
    }

    const data = dataEntries;
    
    // Extract numeric fields for the indicator
    const numericFields: Record<string, number[]> = {};
    const fieldNames = [
      'exhibiciones_propias', 'exhibiciones_competencia', 'impulsadoras_propias',
      'impulsadoras_competencia', 'productos_agotados', 'total_productos',
      'presencia_actual', 'presencia_anterior', 'ventas_totales', 'precio',
      'precio_competencia', 'metros_lineal_propios', 'transferencias_realizadas',
      'ventas_potenciales_perdidas'
    ];

    fieldNames.forEach(field => {
      numericFields[field] = data
        .map(entry => typeof entry[field] === 'number' ? entry[field] : 0)
        .filter(val => !isNaN(val));
    });

    return {
      data,
      numericFields,
      // For aggregation
      sum: (field: string) => numericFields[field]?.reduce((a, b) => a + b, 0) || 0,
      avg: (field: string) => {
        const vals = numericFields[field] || [];
        return vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
      },
      max: (field: string) => numericFields[field]?.length ? Math.max(...numericFields[field]) : 0,
      min: (field: string) => numericFields[field]?.length ? Math.min(...numericFields[field]) : 0,
    };
  };

  const chartData = transformDataForChart();

  switch (componentName) {
    case 'KpiCard': {
      let value = random(50, 200);
      let previousValue = random(40, 180);
      
      if (chartData) {
        // Use real data if available
        value = Math.round(chartData.avg('exhibiciones_propias') || chartData.avg('productos_agotados') || chartData.avg('presencia_actual') || random(50, 200));
        previousValue = Math.round(value * (0.85 + Math.random() * 0.2));
      }
      
      return (
        <KpiCard
          key={key}
          value={value}
          previousValue={previousValue}
          label={indicator.name}
          format="number"
          showTrend
        />
      );
    }

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

    case 'BaseLineChart': {
  let data = generateTimeSeriesData();
  
  if (chartData && chartData.data && chartData.data.length > 0) {
    const candidateFields = getIndicatorCandidateFields(indicator);
    const dataByDate: Record<string, number[]> = {};
    
    chartData.data.forEach((entry: any) => {
      const date = entry.date || 'Unknown';
      if (!dataByDate[date]) {
        dataByDate[date] = [];
      }
      
      // Try to extract a numeric value from candidate fields
      for (const field of candidateFields) {
        const val = toNumeric(entry[field]);
        if (val !== null) {
          dataByDate[date].push(val);
          break; // use first matching field
        }
      }
    });
    
    // Convert to chart format - average per date
    const converted = Object.entries(dataByDate)
      .filter(([_, values]) => values.length > 0)
      .map(([period, values]) => ({
        period: period.length > 5 ? period.substring(5) : period,
        value: Math.round(values.reduce((sum, v) => sum + v, 0) / values.length)
      }))
      .sort((a, b) => a.period.localeCompare(b.period))
      .slice(-12);
    
    if (converted.length > 0) {
      data = converted;
    }
  }
  
  console.log('[BaseLineChart data]', indicator.name, data);
  
  return (
    <BaseLineChart
      key={key}
      data={data}
      xKey="period"
      yKeys={['value']}
      showDots
    />
  );
}

    case 'BaseAreaChart': {
      let data = generateTimeSeriesData();
      
      if (chartData && chartData.data && chartData.data.length > 0) {
        data = chartData.data.map((entry: any, idx: number) => ({
          period: `P${idx + 1}`,
          value: Math.round(entry.presencia_actual || entry.exhibiciones_propias || Math.random() * 100)
        }));
      }
      
      return (
        <BaseAreaChart
          key={key}
          data={data}
          xKey="period"
          yKeys={['value']}
        />
      );
    }

    case 'BaseBarChart': {
  let data = generateCategoryData();
  
  if (chartData && chartData.data && chartData.data.length > 0) {
    const candidateFields = getIndicatorCandidateFields(indicator);
    
    data = chartData.data
      .map((entry: any, i: number) => {
        let value: number | null = null;
        
        for (const field of candidateFields) {
          const val = toNumeric(entry[field]);
          if (val !== null) {
            value = val;
            break;
          }
        }
        
        return {
          name: entry.pdv || `PDV ${i + 1}`,
          value: value !== null ? Math.round(value) : 0
        };
      })
      .filter(item => item.value > 0); // only show bars with data
    
    if (data.length === 0) {
      data = generateCategoryData();
    }
  }
  
  console.log('[BaseBarChart data]', indicator.name, data);
  
  return (
    <BaseBarChart
      key={key}
      data={data}
      xKey="name"
      yKeys={['value']}
    />
  );
}

    case 'BasePieChart': {
      let data = generatePieData();
      
      if (chartData && chartData.data && chartData.data.length > 0) {
        // Group by a category field or show distribution
        const distribution: Record<string, number> = {};
        chartData.data.forEach((entry: any) => {
          const category = entry.exhibiciones_tipo || 'Sin categoría';
          distribution[category] = (distribution[category] || 0) + 1;
        });
        
        data = Object.entries(distribution).map(([name, value]) => ({
          name,
          value
        }));
        
        if (data.length === 0) {
          data = generatePieData();
        }
      }
      
      return (
        <BasePieChart
          key={key}
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={50}
        />
      );
    }

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

  const dataEntries = formData.dataEntries || [];
  const totalRecords = dataEntries.length;
  const uniquePdvs = new Set(
    dataEntries
      .map((entry: any) => (entry.pdv ? String(entry.pdv).trim() : ''))
      .filter(Boolean)
  ).size;

  const indicatorsByVariable = indicators.reduce((acc: Record<string, any[]>, indicator: any) => {
    const variable = formatVariableLabel(indicator.variable);
    if (!acc[variable]) {
      acc[variable] = [];
    }
    acc[variable].push(indicator);
    return acc;
  }, {});

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

          <div className="flex flex-wrap items-center gap-3 text-[14px]">
            {formData.industry && (
              <span className="inline-flex items-center rounded-full border border-[#41c0f0] bg-[#e9f8ff] px-3 py-1 text-[#005fa0] font-medium capitalize">
                {formData.industry.replace(/_/g, ' ')}
              </span>
            )}
            <span className="text-[#979797]">{Object.keys(indicatorsByVariable).length} variables</span>
            <span className="text-[#979797]">{indicators.length} indicadores</span>
            <span className="text-[#979797]">{totalRecords} registros</span>
          </div>
        </div>

        {/* Compact summary bar */}
        <div className="mb-8 rounded-lg border border-[#bfe9ff] bg-[#f3fbff] px-4 py-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-lg border border-[#8fd9ff] bg-white px-3 py-2">
              <Database className="h-4 w-4 text-[#005fa0]" />
              <span className="text-[12px] text-[#5a6d8d]">Registros</span>
              <span className="text-[16px] font-semibold text-[#005fa0] ml-2">{totalRecords}</span>
            </div>

            <div className="inline-flex items-center gap-2 rounded-lg border border-[#8fd9ff] bg-white px-3 py-2">
              <Store className="h-4 w-4 text-[#005fa0]" />
              <span className="text-[12px] text-[#5a6d8d]">PDV</span>
              <span className="text-[16px] font-semibold text-[#005fa0] ml-2">{uniquePdvs}</span>
            </div>

            <div className="inline-flex items-center gap-2 rounded-lg border border-[#8fd9ff] bg-white px-3 py-2">
              <BarChart3 className="h-4 w-4 text-[#005fa0]" />
              <span className="text-[12px] text-[#5a6d8d]">Variables</span>
              <span className="text-[16px] font-semibold text-[#005fa0] ml-2">{Object.keys(indicatorsByVariable).length}</span>
            </div>

            <div className="inline-flex items-center gap-2 rounded-lg border border-[#8fd9ff] bg-white px-3 py-2">
              <TrendingUp className="h-4 w-4 text-[#005fa0]" />
              <span className="text-[12px] text-[#5a6d8d]">Indicadores</span>
              <span className="text-[16px] font-semibold text-[#005fa0] ml-2">{indicators.length}</span>
            </div>
          </div>
        </div>

        {/* Charts grouped by variable */}
        <div className="space-y-10 ">
          {Object.entries(indicatorsByVariable).map(([variable, variableIndicators]) => (
            <section key={variable} className="rounded-lg border border-[#d7e2f2] bg-white shadow-sm overflow-hidden p-4 flex-col mb-4">
              <div className="bg-blue px-6 py-5 mb-4">
                <h2 className="text-[30px] leading-tight text-black font-semibold capitalize">{variable}</h2>
                <p className="text-blue-100 text-[14px] mt-1">
                  {variableIndicators.length} indicador{variableIndicators.length !== 1 ? 'es' : ''}
                </p>
              </div>

              <div className="p-5 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 ">
                {variableIndicators.map((indicator: any, idx: number) => {
                  const formulaLabel = formatIndicatorFormula(indicator.formula);
                  const insights = buildIndicatorInsights(indicator, dataEntries, uniquePdvs);
                    console.log(indicator.name, indicator, formData.dataEntries)


                  return (
                    <div key={`${variable}-${idx}`} className="rounded-lg border border-[#d6dce8] bg-[#fdfefe] overflow-hidden p-4">
                      <div className="px-5 pt-4 pb-4 border-b border-[#e9edf5] bg-[#fbfcff]">
                        
                        <h3 className="text-[20px] text-[#253a66] font-semibold leading-tight">
                          {indicator.name}
                        </h3>
                    
                      </div>

                      <div className="px-3 py-2" style={{ width: '100%', minHeight: 320, height: '320px' }}>
                        {getChartComponent(indicator, idx, formData.dataEntries)}
                      </div>

                      {/*insights.length > 0 && (
                        <div className="px-4 pb-4">
                          <div className="grid grid-cols-3 gap-2 rounded-lg border border-[#9fddff] bg-[#f1faff] p-2 flex">
                            {insights.map((insight) => (
                              <div key={`${indicator.name}-${insight.label}`} style={{width: 'max-content'}}>
                                <p className="text-[11px] text-[#73849d] uppercase">{insight.label}</p>
                                <p className="text-[14px] text-[#1f4f77] font-semibold">{insight.value}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) */}
                    </div>
                  );
                })}
              </div>
            </section>
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
