import { useState } from 'react';
import { ChevronRight, ChevronLeft, CheckCircle2, Edit2, Check, Info, Calendar, Clock, Zap, Building2, Store, ShoppingCart, Package } from 'lucide-react';

type VisualizationType = 'option1' | 'option2' | 'option3';
type Industry = 'consumo_masivo' | 'farmaceutica' | 'retail' | 'distribuidora';

interface IndicatorDescriptor {
  howToUse: string;
  historicalData: string;
  captureFrequency: string;
  actionables: string[];
}

interface VisualizationOption {
  id: VisualizationType;
  name: string;
  description: string;
  example: string;
}

interface IndicatorConfig {
  name: string;
  variable: string;
  visualizationType: VisualizationType | null;
  formula: string;
  defaultFormula: string;
  descriptor: IndicatorDescriptor;
  visualizationOptions: VisualizationOption[];
}

interface FormData {
  industry: Industry | null;
  selectedVariables: string[];
  indicatorConfigs: Record<string, IndicatorConfig>;
}

interface IndicatorData {
  name: string;
  formula: string;
  shortDescription: string;
  descriptor: IndicatorDescriptor;
  visualizationOptions: VisualizationOption[];
  industries: Industry[]; // Industries where this indicator is available
}

interface VariableInfo {
  description: string;
  indicators: IndicatorData[];
  industries: Industry[]; // Industries where this variable is available
}

const industries = [
  { 
    id: 'consumo_masivo' as Industry, 
    name: 'Consumo Masivo', 
    icon: ShoppingCart,
    description: 'Productos de alta rotación en supermercados, tiendas y canales tradicionales'
  },
  { 
    id: 'farmaceutica' as Industry, 
    name: 'Farmacéutica', 
    icon: Package,
    description: 'Medicamentos y productos de salud en farmacias y droguerías'
  },
  { 
    id: 'retail' as Industry, 
    name: 'Retail', 
    icon: Store,
    description: 'Tiendas especializadas, departamentales y grandes superficies'
  },
  { 
    id: 'distribuidora' as Industry, 
    name: 'Distribuidora', 
    icon: Building2,
    description: 'Mayoristas y distribuidores de múltiples categorías'
  },
];

const allIndustries: Industry[] = ['consumo_masivo', 'farmaceutica', 'retail', 'distribuidora'];

const variablesData: Record<string, VariableInfo> = {
  'Actividades': {
    description: 'Mide todas las actividades de trade marketing realizadas en el punto de venta, incluyendo exhibiciones, material POP y personal de impulso.',
    industries: allIndustries,
    indicators: [
      { 
        name: 'Cantidad de exhibiciones vs competencia',
        formula: 'COUNT(exhibiciones_propias) - COUNT(exhibiciones_competencia)',
        shortDescription: 'Compara la cantidad de exhibiciones propias contra la competencia para evaluar visibilidad',
        industries: allIndustries,
        descriptor: {
          howToUse: 'Mide la presencia de exhibiciones propias comparada con la competencia para evaluar la visibilidad en el punto de venta',
          historicalData: '3 meses',
          captureFrequency: 'Semanal',
          actionables: [
            'Incrementar inversión en exhibiciones donde la competencia domina',
            'Negociar espacios adicionales en PDVs estratégicos',
            'Replicar estrategias exitosas de PDVs con mejor desempeño'
          ]
        },
        visualizationOptions: [
          { id: 'option1', name: 'Comparativa de barras', description: 'Muestra barras lado a lado para comparar', example: 'Barras agrupadas con marca propia vs competencia' },
          { id: 'option2', name: 'Línea de tendencia', description: 'Evolución temporal de la diferencia', example: 'Gráfico de líneas mostrando gap en el tiempo' },
          { id: 'option3', name: 'Indicador numérico', description: 'Número destacado con variación', example: 'KPI card con diferencia y porcentaje de cambio' },
        ]
      },
      { 
        name: '% distribución de tipos de exhibiciones propias',
        formula: '(COUNT(exhibiciones_tipo) / COUNT(total_exhibiciones)) * 100',
        shortDescription: 'Muestra cómo se distribuyen los diferentes tipos de exhibiciones (islas, góndolas, etc.)',
        industries: allIndustries,
        descriptor: {
          howToUse: 'Analiza la distribución porcentual de diferentes tipos de exhibiciones para optimizar el mix',
          historicalData: '6 meses',
          captureFrequency: 'Mensual',
          actionables: [
            'Balancear el mix de exhibiciones según resultados',
            'Descontinuar tipos de exhibiciones con bajo ROI',
            'Invertir en formatos con mejor conversión'
          ]
        },
        visualizationOptions: [
          { id: 'option1', name: 'Gráfico circular', description: 'Distribución en porcentajes', example: 'Pie chart con cada tipo de exhibición' },
          { id: 'option2', name: 'Barras apiladas 100%', description: 'Composición comparativa', example: 'Barras horizontales mostrando proporción' },
          { id: 'option3', name: 'Treemap', description: 'Bloques proporcionales', example: 'Rectángulos de tamaño variable por tipo' },
        ]
      },
      { 
        name: 'Cantidad de impulsadoras propias vs competencia',
        formula: 'COUNT(impulsadoras_propias) - COUNT(impulsadoras_competencia)',
        shortDescription: 'Compara el número de personal de impulso en PDV contra la competencia',
        industries: ['consumo_masivo', 'retail'],
        descriptor: {
          howToUse: 'Compara el número de impulsadoras en el punto de venta para evaluar presencia de personal',
          historicalData: '3 meses',
          captureFrequency: 'Semanal',
          actionables: [
            'Asignar más personal a puntos de venta estratégicos',
            'Redistribuir impulsadoras según tráfico del PDV',
            'Mejorar capacitación del equipo de impulsación'
          ]
        },
        visualizationOptions: [
          { id: 'option1', name: 'Comparativa horizontal', description: 'Barras horizontales por PDV', example: 'Barras mostrando propias vs competencia' },
          { id: 'option2', name: 'Mapa de calor', description: 'Matriz por PDV y período', example: 'Heatmap de intensidad de personal' },
          { id: 'option3', name: 'Gauge comparativo', description: 'Medidor de diferencia', example: 'Velocímetro mostrando ventaja/desventaja' },
        ]
      },
    ]
  },
  'Agotados': {
    description: 'Analiza los quiebres de inventario en el punto de venta, identificando causas y oportunidades de mejora en la disponibilidad de productos.',
    industries: allIndustries,
    indicators: [
      { 
        name: '% Agotado promedio',
        formula: '(SUM(productos_agotados) / SUM(total_productos)) * 100',
        shortDescription: 'Porcentaje de productos sin stock en PDV, indicador clave de disponibilidad',
        industries: allIndustries,
        descriptor: {
          howToUse: 'Mide el porcentaje promedio de productos agotados para detectar problemas en la cadena de suministro',
          historicalData: '6 meses',
          captureFrequency: 'Diario',
          actionables: [
            'Ajustar políticas de reabastecimiento',
            'Revisar forecast de demanda por SKU',
            'Mejorar comunicación con logística',
            'Identificar SKUs críticos con agotados frecuentes'
          ]
        },
        visualizationOptions: [
          { id: 'option1', name: 'KPI con tendencia', description: 'Número principal con sparkline', example: 'Porcentaje grande con mini gráfico debajo' },
          { id: 'option2', name: 'Línea temporal', description: 'Evolución del porcentaje', example: 'Gráfico de líneas con zona de alerta' },
          { id: 'option3', name: 'Gauge de estado', description: 'Medidor de salud', example: 'Velocímetro con zonas verde/amarillo/rojo' },
        ]
      },
      { 
        name: '% variación agotados vs periodo anterior',
        formula: '((agotados_actual - agotados_anterior) / agotados_anterior) * 100',
        shortDescription: 'Cambio porcentual en agotados comparado con el período anterior',
        industries: allIndustries,
        descriptor: {
          howToUse: 'Compara el nivel de agotados con el período anterior para identificar mejoras o deterioros',
          historicalData: '12 meses',
          captureFrequency: 'Semanal',
          actionables: [
            'Investigar causas de incrementos significativos',
            'Replicar prácticas de períodos con mejoras',
            'Alertar a equipo comercial sobre tendencias negativas'
          ]
        },
        visualizationOptions: [
          { id: 'option1', name: 'Comparativa de períodos', description: 'Barras lado a lado', example: 'Actual vs anterior con variación %' },
          { id: 'option2', name: 'Indicador de cambio', description: 'Número con flecha', example: 'Porcentaje con icono arriba/abajo y color' },
          { id: 'option3', name: 'Cascada', description: 'Waterfall chart', example: 'Flujo de cambio desde período anterior' },
        ]
      },
      {
        name: '% Causales de agotados',
        formula: '(COUNT(agotados_por_causal) / COUNT(total_agotados)) * 100',
        shortDescription: 'Distribución de motivos que causan los agotados (logística, ventas, etc.)',
        industries: allIndustries,
        descriptor: {
          howToUse: 'Identifica las principales causas de los agotados para atacar el problema raíz',
          historicalData: '3 meses',
          captureFrequency: 'Semanal',
          actionables: [
            'Atacar la causa principal de agotados',
            'Implementar planes de acción por causal',
            'Medir efectividad de mejoras implementadas'
          ]
        },
        visualizationOptions: [
          { id: 'option1', name: 'Gráfico de pastel', description: 'Distribución por causal', example: 'Pie chart mostrando % por causa' },
          { id: 'option2', name: 'Pareto', description: 'Barras + línea acumulada', example: 'Causales ordenadas de mayor a menor impacto' },
          { id: 'option3', name: 'Tabla clasificada', description: 'Lista con porcentajes', example: 'Tabla con ranking de causales' },
        ]
      },
      { 
        name: '% Presencia',
        formula: '(COUNT(productos_presentes) / COUNT(total_productos)) * 100',
        shortDescription: 'Porcentaje del portafolio disponible en el punto de venta',
        industries: allIndustries,
        descriptor: {
          howToUse: 'Indica el porcentaje de productos del portafolio presentes en el PDV vs el objetivo',
          historicalData: '6 meses',
          captureFrequency: 'Semanal',
          actionables: [
            'Mejorar distribución en PDVs con baja presencia',
            'Revisar portafolio por tipo de canal',
            'Negociar listado de SKUs faltantes'
          ]
        },
        visualizationOptions: [
          { id: 'option1', name: 'Barra de progreso', description: 'Completitud visual', example: 'Barra horizontal con porcentaje alcanzado' },
          { id: 'option2', name: 'Comparativa vs objetivo', description: 'Actual vs meta', example: 'Barras con línea de objetivo' },
          { id: 'option3', name: 'Semáforo por categoría', description: 'Estado por segmento', example: 'Tabla con indicadores de color' },
        ]
      },
      {
        name: 'N° PDV con agotados',
        formula: 'COUNT(DISTINCT pdv WHERE agotados > 0)',
        shortDescription: 'Cantidad de puntos de venta que presentan al menos un producto agotado',
        industries: allIndustries,
        descriptor: {
          howToUse: 'Mide cuántos PDVs tienen problemas de agotados para priorizar acciones',
          historicalData: '3 meses',
          captureFrequency: 'Diario',
          actionables: [
            'Focalizar esfuerzos en PDVs críticos',
            'Revisar políticas de distribución',
            'Implementar alertas tempranas'
          ]
        },
        visualizationOptions: [
          { id: 'option1', name: 'KPI numérico', description: 'Número destacado', example: 'Contador grande con variación' },
          { id: 'option2', name: 'Mapa geográfico', description: 'Visualización por zona', example: 'Mapa con puntos de calor' },
          { id: 'option3', name: 'Evolución temporal', description: 'Línea de tendencia', example: 'Gráfico mostrando cambios en el tiempo' },
        ]
      },
      {
        name: '% PDV con agotados',
        formula: '(COUNT(pdv_con_agotados) / COUNT(total_pdv)) * 100',
        shortDescription: 'Porcentaje de PDVs afectados por agotados',
        industries: allIndustries,
        descriptor: {
          howToUse: 'Evalúa qué tan extendido está el problema de agotados en la red',
          historicalData: '6 meses',
          captureFrequency: 'Semanal',
          actionables: [
            'Identificar patrones geográficos',
            'Mejorar cobertura de distribución',
            'Revisar frecuencia de entregas'
          ]
        },
        visualizationOptions: [
          { id: 'option1', name: 'Gauge porcentual', description: 'Medidor circular', example: 'Velocímetro con % afectado' },
          { id: 'option2', name: 'Barras comparativas', description: 'Por región o canal', example: 'Barras mostrando % por segmento' },
          { id: 'option3', name: 'Tendencia histórica', description: 'Línea en el tiempo', example: 'Evolución del % de PDVs afectados' },
        ]
      },
      {
        name: 'Promedio SKUs agotados por PDV con agotados',
        formula: 'AVG(skus_agotados WHERE agotados > 0)',
        shortDescription: 'Promedio de productos agotados en los PDVs que tienen agotados',
        industries: allIndustries,
        descriptor: {
          howToUse: 'Mide la severidad del problema en PDVs afectados',
          historicalData: '3 meses',
          captureFrequency: 'Semanal',
          actionables: [
            'Atacar PDVs con múltiples agotados',
            'Revisar capacidad de almacenamiento',
            'Optimizar mix de productos'
          ]
        },
        visualizationOptions: [
          { id: 'option1', name: 'KPI con contexto', description: 'Número principal', example: 'Promedio con rango min-max' },
          { id: 'option2', name: 'Distribución', description: 'Histograma', example: 'Barras mostrando frecuencia de SKUs agotados' },
          { id: 'option3', name: 'Box plot', description: 'Gráfico de caja', example: 'Visualización de dispersión y cuartiles' },
        ]
      },
      {
        name: '% cumplimiento surtido objetivo',
        formula: '(COUNT(productos_surtidos) / COUNT(objetivo_surtido)) * 100',
        shortDescription: 'Porcentaje del surtido objetivo que está disponible en PDV',
        industries: allIndustries,
        descriptor: {
          howToUse: 'Mide qué tan cerca estamos del surtido ideal definido para cada canal',
          historicalData: '6 meses',
          captureFrequency: 'Semanal',
          actionables: [
            'Negociar SKUs faltantes',
            'Revisar estrategia de surtido por canal',
            'Priorizar distribución de productos clave'
          ]
        },
        visualizationOptions: [
          { id: 'option1', name: 'Barra de cumplimiento', description: 'Progreso visual', example: 'Barra con % y objetivo' },
          { id: 'option2', name: 'Comparativa por canal', description: 'Barras múltiples', example: 'Cumplimiento por tipo de PDV' },
          { id: 'option3', name: 'Matriz de productos', description: 'Heatmap', example: 'SKUs vs PDVs con disponibilidad' },
        ]
      },
      {
        name: '% variación presencia vs periodo anterior',
        formula: '((presencia_actual - presencia_anterior) / presencia_anterior) * 100',
        shortDescription: 'Cambio en la presencia de productos comparado con período anterior',
        industries: allIndustries,
        descriptor: {
          howToUse: 'Monitorea la evolución de la presencia de productos en el mercado',
          historicalData: '12 meses',
          captureFrequency: 'Mensual',
          actionables: [
            'Investigar caídas significativas',
            'Capitalizar incrementos exitosos',
            'Ajustar estrategia de distribución'
          ]
        },
        visualizationOptions: [
          { id: 'option1', name: 'Indicador de cambio', description: 'Delta con flecha', example: '% con icono y color según dirección' },
          { id: 'option2', name: 'Comparativa temporal', description: 'Barras lado a lado', example: 'Período actual vs anterior' },
          { id: 'option3', name: 'Línea de evolución', description: 'Tendencia histórica', example: 'Gráfico mostrando cambios mensuales' },
        ]
      },
      {
        name: '% PDV con agotados por causal',
        formula: '(COUNT(pdv_causal) / COUNT(total_pdv)) * 100',
        shortDescription: 'Porcentaje de PDVs afectados segmentado por causa del agotado',
        industries: allIndustries,
        descriptor: {
          howToUse: 'Identifica qué causales afectan a más PDVs para priorizar soluciones',
          historicalData: '3 meses',
          captureFrequency: 'Semanal',
          actionables: [
            'Atacar causal que afecta más PDVs',
            'Implementar planes correctivos específicos',
            'Medir impacto de acciones tomadas'
          ]
        },
        visualizationOptions: [
          { id: 'option1', name: 'Barras agrupadas', description: 'Por causal', example: 'Barras mostrando % de PDVs por causa' },
          { id: 'option2', name: 'Matriz de calor', description: 'Causales vs zonas', example: 'Heatmap de impacto por región' },
          { id: 'option3', name: 'Treemap', description: 'Bloques proporcionales', example: 'Tamaño por importancia de causal' },
        ]
      },
      {
        name: 'Índice de oportunidad por agotados',
        formula: 'SUM(ventas_potenciales_perdidas) / SUM(ventas_totales)',
        shortDescription: 'Mide el impacto económico de los agotados en ventas potenciales',
        industries: allIndustries,
        descriptor: {
          howToUse: 'Cuantifica la oportunidad de negocio que se pierde por agotados',
          historicalData: '6 meses',
          captureFrequency: 'Mensual',
          actionables: [
            'Priorizar SKUs con mayor impacto económico',
            'Justificar inversiones en mejoras de disponibilidad',
            'Establecer metas de reducción de agotados'
          ]
        },
        visualizationOptions: [
          { id: 'option1', name: 'KPI monetario', description: 'Valor en moneda', example: 'Monto de oportunidad perdida' },
          { id: 'option2', name: 'Waterfall', description: 'Flujo de impacto', example: 'Cascada mostrando pérdida por SKU' },
          { id: 'option3', name: 'Comparativa de productos', description: 'Ranking', example: 'Top SKUs con mayor oportunidad' },
        ]
      },
    ]
  },
  'Averías': {
    description: 'Registra y monitorea productos dañados o en mal estado en el punto de venta que deben ser retirados.',
    industries: allIndustries,
    indicators: [
      { 
        name: 'Cantidad de averías',
        formula: 'COUNT(productos_averiados)',
        shortDescription: 'Total de productos reportados como averiados en PDV',
        industries: allIndustries,
        descriptor: {
          howToUse: 'Monitorea la cantidad de productos dañados para identificar problemas en la cadena',
          historicalData: '6 meses',
          captureFrequency: 'Diario',
          actionables: [
            'Mejorar procesos de manejo de producto',
            'Capacitar personal de PDV',
            'Revisar calidad de empaque',
            'Identificar productos más propensos a averías'
          ]
        },
        visualizationOptions: [
          { id: 'option1', name: 'Contador simple', description: 'Número destacado', example: 'Total de averías del período' },
          { id: 'option2', name: 'Tendencia temporal', description: 'Línea evolutiva', example: 'Gráfico de averías en el tiempo' },
          { id: 'option3', name: 'Por categoría', description: 'Barras clasificadas', example: 'Averías por tipo de producto' },
        ]
      },
    ]
  },
  'DEVOLUCIONES': {
    description: 'Controla productos que salen del punto de venta por diferentes motivos (vencimiento, daño, etc.).',
    industries: allIndustries,
    indicators: [
      {
        name: 'Producto que sale del punto de venta por avería o fecha de vencimiento',
        formula: 'COUNT(productos_devueltos WHERE motivo IN ("averia", "vencimiento"))',
        shortDescription: 'Cantidad de productos devueltos por estar dañados o vencidos',
        industries: allIndustries,
        descriptor: {
          howToUse: 'Mide el nivel de devoluciones para detectar problemas de rotación o manejo',
          historicalData: '6 meses',
          captureFrequency: 'Semanal',
          actionables: [
            'Mejorar rotación de inventario',
            'Ajustar políticas de FEFO/FIFO',
            'Revisar forecast de demanda',
            'Reducir merma por vencimientos'
          ]
        },
        visualizationOptions: [
          { id: 'option1', name: 'KPI con desglose', description: 'Total y breakdown', example: 'Número principal con división por motivo' },
          { id: 'option2', name: 'Tendencia comparativa', description: 'Líneas múltiples', example: 'Averías vs vencimientos en el tiempo' },
          { id: 'option3', name: 'Pareto de productos', description: 'Barras + acumulado', example: 'SKUs con más devoluciones' },
        ]
      },
    ]
  },
  'Encuestas': {
    description: 'Evalúa el nivel de implementación de estrategias comerciales mediante encuestas en PDV.',
    industries: allIndustries,
    indicators: [
      {
        name: '% estrategia implementada',
        formula: '(COUNT(estrategias_implementadas) / COUNT(total_estrategias)) * 100',
        shortDescription: 'Porcentaje de cumplimiento de la estrategia comercial planificada',
        industries: allIndustries,
        descriptor: {
          howToUse: 'Mide qué tan bien se está ejecutando el plan comercial en el PDV',
          historicalData: '3 meses',
          captureFrequency: 'Mensual',
          actionables: [
            'Reforzar ejecución en PDVs con bajo cumplimiento',
            'Identificar barreras de implementación',
            'Reconocer equipos con alta ejecución',
            'Ajustar estrategias no viables'
          ]
        },
        visualizationOptions: [
          { id: 'option1', name: 'Gauge de cumplimiento', description: 'Medidor circular', example: 'Velocímetro con % implementado' },
          { id: 'option2', name: 'Barras por iniciativa', description: 'Desglose de estrategias', example: 'Barras con % de cada iniciativa' },
          { id: 'option3', name: 'Mapa de calor', description: 'Por zona y estrategia', example: 'Matriz de implementación regional' },
        ]
      },
    ]
  },
  'Participación': {
    description: 'Mide la participación de la marca en el espacio del punto de venta y su desempeño vs benchmarks.',
    industries: allIndustries,
    indicators: [
      {
        name: '% participación en lineal',
        formula: '(metros_lineal_propios / total_metros_lineal) * 100',
        shortDescription: 'Porcentaje del espacio en góndola que ocupa la marca',
        industries: ['consumo_masivo', 'retail', 'farmaceutica'],
        descriptor: {
          howToUse: 'Evalúa la visibilidad y espacio de la marca en el PDV comparado con competencia',
          historicalData: '6 meses',
          captureFrequency: 'Mensual',
          actionables: [
            'Negociar mayor espacio en PDVs estratégicos',
            'Optimizar uso del lineal asignado',
            'Identificar oportunidades de crecimiento',
            'Defender espacio ante competencia'
          ]
        },
        visualizationOptions: [
          { id: 'option1', name: 'Gráfico de pastel', description: 'Share visual', example: 'Pie chart con participación por marca' },
          { id: 'option2', name: 'Barras apiladas', description: 'Composición del lineal', example: 'Barras mostrando distribución por marca' },
          { id: 'option3', name: 'Evolución temporal', description: 'Línea de tendencia', example: 'Cambios en participación mes a mes' },
        ]
      },
      {
        name: '% cumplimiento de estrategia vs Nielsen',
        formula: '(estrategia_actual / estrategia_nielsen) * 100',
        shortDescription: 'Compara la ejecución actual contra el estándar de mercado Nielsen',
        industries: ['consumo_masivo', 'farmaceutica'],
        descriptor: {
          howToUse: 'Benchmarkea la estrategia de ejecución contra datos de mercado de Nielsen',
          historicalData: '12 meses',
          captureFrequency: 'Mensual',
          actionables: [
            'Cerrar brechas vs benchmark de mercado',
            'Identificar mejores prácticas de la industria',
            'Justificar inversiones con datos de mercado',
            'Ajustar estrategia según tendencias Nielsen'
          ]
        },
        visualizationOptions: [
          { id: 'option1', name: 'Gauge comparativo', description: 'Medidor vs target', example: 'Velocímetro centrado en 100%' },
          { id: 'option2', name: 'Barras duales', description: 'Actual vs Nielsen', example: 'Comparación lado a lado por categoría' },
          { id: 'option3', name: 'Scatter plot', description: 'Matriz de posicionamiento', example: 'Puntos mostrando posición vs mercado' },
        ]
      },
    ]
  },
  'Pedidos / Sugeridos': {
    description: 'Gestiona los pedidos generados en PDV y su cumplimiento contra las cuotas establecidas.',
    industries: allIndustries,
    indicators: [
      {
        name: 'Cumplimiento de transferencias vs cuota',
        formula: '(SUM(transferencias_realizadas) / SUM(cuota_transferencias)) * 100',
        shortDescription: 'Porcentaje de cumplimiento de pedidos/transferencias vs meta',
        industries: allIndustries,
        descriptor: {
          howToUse: 'Mide la efectividad del equipo comercial en generar pedidos vs objetivos',
          historicalData: '6 meses',
          captureFrequency: 'Diario',
          actionables: [
            'Identificar vendedores con bajo cumplimiento',
            'Ajustar cuotas según realidad del mercado',
            'Implementar incentivos para mejorar conversión',
            'Capacitar en técnicas de venta'
          ]
        },
        visualizationOptions: [
          { id: 'option1', name: 'Barra de progreso', description: 'Avance vs meta', example: 'Barra con % de cumplimiento' },
          { id: 'option2', name: 'Ranking de vendedores', description: 'Barras ordenadas', example: 'Top performers vs cuota' },
          { id: 'option3', name: 'Evolución mensual', description: 'Línea de tendencia', example: 'Cumplimiento mes a mes' },
        ]
      },
      {
        name: 'Valor total de los pedidos generados',
        formula: 'SUM(valor_pedidos)',
        shortDescription: 'Monto total en ventas de los pedidos generados en PDV',
        industries: allIndustries,
        descriptor: {
          howToUse: 'Cuantifica el valor económico de los pedidos generados por el equipo',
          historicalData: '12 meses',
          captureFrequency: 'Diario',
          actionables: [
            'Focalizar en PDVs de alto valor',
            'Incrementar ticket promedio',
            'Identificar oportunidades de upselling',
            'Proyectar ventas futuras'
          ]
        },
        visualizationOptions: [
          { id: 'option1', name: 'KPI monetario', description: 'Valor destacado', example: 'Monto total con tendencia' },
          { id: 'option2', name: 'Barras por período', description: 'Evolución temporal', example: 'Valor de pedidos por mes' },
          { id: 'option3', name: 'Embudo de conversión', description: 'Funnel de ventas', example: 'Desde visitas hasta pedidos cerrados' },
        ]
      },
    ]
  },
  'Planes comerciales': {
    description: 'Monitorea la ejecución de planes y actividades comerciales programadas en el punto de venta.',
    industries: allIndustries,
    indicators: [
      {
        name: '% Cantidad de exhibiciones ejecutadas vs programadas',
        formula: '(COUNT(exhibiciones_ejecutadas) / COUNT(exhibiciones_programadas)) * 100',
        shortDescription: 'Porcentaje de exhibiciones planificadas que se ejecutaron efectivamente',
        industries: allIndustries,
        descriptor: {
          howToUse: 'Mide la efectividad en la ejecución del plan de exhibiciones',
          historicalData: '3 meses',
          captureFrequency: 'Semanal',
          actionables: [
            'Identificar causas de incumplimiento',
            'Ajustar planning a capacidad real',
            'Mejorar coordinación con PDV',
            'Reconocer equipos con alta ejecución'
          ]
        },
        visualizationOptions: [
          { id: 'option1', name: 'Gauge de ejecución', description: 'Medidor de cumplimiento', example: 'Velocímetro con % ejecutado' },
          { id: 'option2', name: 'Comparativa temporal', description: 'Barras por período', example: 'Cumplimiento semana a semana' },
          { id: 'option3', name: 'Heatmap regional', description: 'Matriz por zona', example: 'Mapa de calor de ejecución por región' },
        ]
      },
    ]
  },
  'POP': {
    description: 'Controla la implementación de material publicitario en el punto de venta (afiches, displays, etc.).',
    industries: allIndustries,
    indicators: [
      {
        name: '% de POP implementado',
        formula: '(COUNT(pop_implementado) / COUNT(total_pop)) * 100',
        shortDescription: 'Porcentaje del material POP planificado que está colocado en PDV',
        industries: allIndustries,
        descriptor: {
          howToUse: 'Mide la cobertura de material POP en los puntos de venta',
          historicalData: '3 meses',
          captureFrequency: 'Semanal',
          actionables: [
            'Distribuir material a PDVs faltantes',
            'Reemplazar POP dañado o desactualizado',
            'Negociar espacios para POP',
            'Medir impacto del POP en ventas'
          ]
        },
        visualizationOptions: [
          { id: 'option1', name: 'Barra de cobertura', description: 'Progreso visual', example: 'Barra mostrando % de PDVs con POP' },
          { id: 'option2', name: 'Mapa geográfico', description: 'Distribución espacial', example: 'Mapa con cobertura por zona' },
          { id: 'option3', name: 'Matriz de materiales', description: 'POP vs PDV', example: 'Heatmap de tipos de POP por local' },
        ]
      },
      {
        name: 'Cantidad de POP implementado',
        formula: 'COUNT(pop_implementado)',
        shortDescription: 'Número total de piezas de material POP colocadas en PDV',
        industries: allIndustries,
        descriptor: {
          howToUse: 'Cuenta cuántas piezas de POP están activas en el mercado',
          historicalData: '6 meses',
          captureFrequency: 'Mensual',
          actionables: [
            'Planificar reposición de material',
            'Optimizar inversión en POP',
            'Identificar tipos de POP más efectivos',
            'Controlar inventario de materiales'
          ]
        },
        visualizationOptions: [
          { id: 'option1', name: 'Contador KPI', description: 'Número destacado', example: 'Total de piezas implementadas' },
          { id: 'option2', name: 'Barras por tipo', description: 'Clasificación de POP', example: 'Cantidad por tipo de material' },
          { id: 'option3', name: 'Tendencia acumulada', description: 'Crecimiento en el tiempo', example: 'Línea mostrando incremento de POP' },
        ]
      },
    ]
  },
  'Precio': {
    description: 'Monitorea la estrategia de precios en el mercado, comparando contra competencia, precio de lista y objetivos comerciales.',
    industries: allIndustries,
    indicators: [
      { 
        name: 'Precio promedio',
        formula: 'AVG(precio)',
        shortDescription: 'Precio de venta promedio en el punto de venta',
        industries: allIndustries,
        descriptor: {
          howToUse: 'Calcula el precio promedio de venta para monitorear posicionamiento de precio',
          historicalData: '12 meses',
          captureFrequency: 'Diario',
          actionables: [
            'Ajustar estrategia de precios por canal',
            'Identificar oportunidades de precio premium',
            'Detectar erosión de precio vs competencia'
          ]
        },
        visualizationOptions: [
          { id: 'option1', name: 'Evolución temporal', description: 'Línea de tendencia', example: 'Gráfico de líneas con bandas de precio' },
          { id: 'option2', name: 'Comparativa de canales', description: 'Barras por segmento', example: 'Barras agrupadas por tipo de canal' },
          { id: 'option3', name: 'KPI con histórico', description: 'Número destacado', example: 'Precio actual con variación y mini gráfico' },
        ]
      },
      {
        name: 'Precio moda',
        formula: 'MODE(precio)',
        shortDescription: 'Precio que aparece con mayor frecuencia en el mercado',
        industries: allIndustries,
        descriptor: {
          howToUse: 'Identifica el precio más común para entender el posicionamiento de mercado',
          historicalData: '6 meses',
          captureFrequency: 'Semanal',
          actionables: [
            'Alinear precio a moda si es estratégico',
            'Diferenciarse si se busca premium/económico',
            'Detectar concentraciones de precio'
          ]
        },
        visualizationOptions: [
          { id: 'option1', name: 'KPI destacado', description: 'Número principal', example: 'Precio moda con frecuencia' },
          { id: 'option2', name: 'Histograma', description: 'Distribución de precios', example: 'Barras mostrando frecuencia por rango' },
          { id: 'option3', name: 'Comparativa', description: 'Moda vs promedio', example: 'Barras comparando diferentes estadísticas' },
        ]
      },
      {
        name: 'Precio máximo',
        formula: 'MAX(precio)',
        shortDescription: 'Precio más alto encontrado en el mercado',
        industries: allIndustries,
        descriptor: {
          howToUse: 'Identifica el techo de precio para detectar outliers o premium',
          historicalData: '6 meses',
          captureFrequency: 'Semanal',
          actionables: [
            'Investigar PDVs con precios excesivos',
            'Controlar cumplimiento de política de precios',
            'Identificar canales premium'
          ]
        },
        visualizationOptions: [
          { id: 'option1', name: 'KPI con contexto', description: 'Valor destacado', example: 'Precio máximo con ubicación' },
          { id: 'option2', name: 'Box plot', description: 'Gráfico de caja', example: 'Visualización de dispersión de precios' },
          { id: 'option3', name: 'Ranking de PDVs', description: 'Top precios altos', example: 'Lista de PDVs con precios máximos' },
        ]
      },
      {
        name: 'Precio mínimo',
        formula: 'MIN(precio)',
        shortDescription: 'Precio más bajo encontrado en el mercado',
        industries: allIndustries,
        descriptor: {
          howToUse: 'Identifica el piso de precio para detectar promociones o precio agresivo',
          historicalData: '6 meses',
          captureFrequency: 'Semanal',
          actionables: [
            'Verificar precios sospechosamente bajos',
            'Proteger márgenes mínimos',
            'Identificar canales discount'
          ]
        },
        visualizationOptions: [
          { id: 'option1', name: 'KPI con alerta', description: 'Valor destacado', example: 'Precio mínimo con indicador de riesgo' },
          { id: 'option2', name: 'Comparativa histórica', description: 'Línea de evolución', example: 'Cambios del precio mínimo en el tiempo' },
          { id: 'option3', name: 'Mapa de canales', description: 'Distribución por tipo', example: 'Precios mínimos por canal' },
        ]
      },
      { 
        name: 'Precio index (vs competencia y vs precio de lista)',
        formula: '(precio_propio / precio_competencia) * 100',
        shortDescription: 'Índice de competitividad de precio (100 = paridad, >100 = más caro)',
        industries: allIndustries,
        descriptor: {
          howToUse: 'Compara el precio propio vs competencia y precio de lista para evaluar competitividad',
          historicalData: '6 meses',
          captureFrequency: 'Semanal',
          actionables: [
            'Ajustar precios en PDVs donde estamos por encima de mercado',
            'Aprovechar ventaja de precio en canales específicos',
            'Revisar márgenes si el index se desvía mucho del objetivo'
          ]
        },
        visualizationOptions: [
          { id: 'option1', name: 'Índice comparativo', description: 'Gauge centrado en 100', example: 'Medidor mostrando si está arriba/abajo de 100%' },
          { id: 'option2', name: 'Scatter plot', description: 'Dispersión vs competencia', example: 'Puntos por PDV mostrando relación de precios' },
          { id: 'option3', name: 'Barras de desviación', description: 'Diferencia por SKU', example: 'Barras horizontales con línea en 100%' },
        ]
      },
      {
        name: 'Precio index (Precio de venta publico vs Estrategia de precios clientes)',
        formula: '(pvp / precio_estrategia) * 100',
        shortDescription: 'Índice de cumplimiento de precio vs estrategia definida',
        industries: allIndustries,
        descriptor: {
          howToUse: 'Mide qué tan bien se está cumpliendo la estrategia de precios por cliente',
          historicalData: '6 meses',
          captureFrequency: 'Semanal',
          actionables: [
            'Corregir desviaciones de precio vs estrategia',
            'Negociar con clientes fuera de política',
            'Ajustar estrategia si no es realista'
          ]
        },
        visualizationOptions: [
          { id: 'option1', name: 'Gauge de cumplimiento', description: 'Medidor vs target', example: 'Velocímetro centrado en estrategia' },
          { id: 'option2', name: 'Heatmap de clientes', description: 'Matriz de cumplimiento', example: 'Mapa de calor por cliente y producto' },
          { id: 'option3', name: 'Barras de desviación', description: 'Gap vs estrategia', example: 'Desviación positiva/negativa por SKU' },
        ]
      },
      {
        name: 'Variación de precio promedio',
        formula: '((precio_actual - precio_anterior) / precio_anterior) * 100',
        shortDescription: 'Cambio porcentual del precio promedio vs período anterior',
        industries: allIndustries,
        descriptor: {
          howToUse: 'Monitorea la evolución del precio para detectar tendencias inflacionarias o deflacionarias',
          historicalData: '12 meses',
          captureFrequency: 'Mensual',
          actionables: [
            'Comunicar aumentos de precio al equipo',
            'Justificar cambios con datos de mercado',
            'Ajustar forecast de ventas por precio'
          ]
        },
        visualizationOptions: [
          { id: 'option1', name: 'Indicador de cambio', description: 'Delta con flecha', example: '% con color según dirección' },
          { id: 'option2', name: 'Línea de evolución', description: 'Tendencia histórica', example: 'Gráfico de cambios mensuales' },
          { id: 'option3', name: 'Cascada', description: 'Waterfall chart', example: 'Flujo de cambios de precio' },
        ]
      },
      {
        name: 'Precio mediano',
        formula: 'MEDIAN(precio)',
        shortDescription: 'Valor medio de la distribución de precios (menos afectado por outliers)',
        industries: allIndustries,
        descriptor: {
          howToUse: 'Ofrece una medida de tendencia central más robusta que el promedio',
          historicalData: '6 meses',
          captureFrequency: 'Semanal',
          actionables: [
            'Usar como referencia de precio "típico"',
            'Comparar con promedio para detectar sesgo',
            'Base para estrategia de pricing'
          ]
        },
        visualizationOptions: [
          { id: 'option1', name: 'KPI comparativo', description: 'Mediana vs promedio', example: 'Dos números lado a lado' },
          { id: 'option2', name: 'Box plot', description: 'Gráfico de caja', example: 'Visualización de cuartiles y mediana' },
          { id: 'option3', name: 'Distribución', description: 'Histograma con mediana', example: 'Frecuencias con línea de mediana' },
        ]
      },
      {
        name: 'Rango de precios',
        formula: 'MAX(precio) - MIN(precio)',
        shortDescription: 'Diferencia entre el precio máximo y mínimo',
        industries: allIndustries,
        descriptor: {
          howToUse: 'Mide la dispersión de precios en el mercado',
          historicalData: '6 meses',
          captureFrequency: 'Semanal',
          actionables: [
            'Reducir rango si hay mucha dispersión',
            'Investigar causas de precios extremos',
            'Estandarizar política de precios'
          ]
        },
        visualizationOptions: [
          { id: 'option1', name: 'KPI con min-max', description: 'Rango destacado', example: 'Diferencia con valores extremos' },
          { id: 'option2', name: 'Barras de rango', description: 'Visualización de spread', example: 'Barras mostrando min, promedio, max' },
          { id: 'option3', name: 'Evolución temporal', description: 'Línea de rango', example: 'Cómo varía el rango en el tiempo' },
        ]
      },
      {
        name: 'Desviación estándar del precio',
        formula: 'STDDEV(precio)',
        shortDescription: 'Medida de dispersión de los precios respecto al promedio',
        industries: allIndustries,
        descriptor: {
          howToUse: 'Evalúa la variabilidad de precios; alta desviación indica inconsistencia',
          historicalData: '6 meses',
          captureFrequency: 'Semanal',
          actionables: [
            'Reducir variabilidad de precios',
            'Identificar PDVs fuera de estándar',
            'Mejorar control de precios'
          ]
        },
        visualizationOptions: [
          { id: 'option1', name: 'KPI estadístico', description: 'Número con interpretación', example: 'Desviación con semáforo de control' },
          { id: 'option2', name: 'Banda de confianza', description: 'Área en gráfico', example: 'Precio promedio con bandas ±1 std' },
          { id: 'option3', name: 'Control chart', description: 'Gráfico de control', example: 'Puntos con límites de control' },
        ]
      },
      {
        name: 'Coeficiente de variación del precio',
        formula: '(STDDEV(precio) / AVG(precio)) * 100',
        shortDescription: 'Desviación relativa que permite comparar variabilidad entre productos',
        industries: allIndustries,
        descriptor: {
          howToUse: 'Mide la variabilidad relativa del precio, útil para comparar productos de diferentes rangos',
          historicalData: '6 meses',
          captureFrequency: 'Mensual',
          actionables: [
            'Comparar consistencia entre SKUs',
            'Priorizar control en productos con alto CV',
            'Benchmark de variabilidad aceptable'
          ]
        },
        visualizationOptions: [
          { id: 'option1', name: 'KPI porcentual', description: 'CV como %', example: 'Porcentaje con interpretación' },
          { id: 'option2', name: 'Ranking de productos', description: 'Barras ordenadas', example: 'SKUs con mayor variabilidad' },
          { id: 'option3', name: 'Scatter plot', description: 'Precio vs CV', example: 'Relación entre precio y variabilidad' },
        ]
      },
      {
        name: 'Precio promedio ponderado por unidades vendidas',
        formula: 'SUM(precio * unidades) / SUM(unidades)',
        shortDescription: 'Precio promedio considerando el volumen de unidades vendidas',
        industries: allIndustries,
        descriptor: {
          howToUse: 'Calcula precio promedio real considerando qué precios generan más volumen',
          historicalData: '12 meses',
          captureFrequency: 'Mensual',
          actionables: [
            'Entender precio efectivo de mercado',
            'Optimizar mix de precios por volumen',
            'Calcular revenue por unidad real'
          ]
        },
        visualizationOptions: [
          { id: 'option1', name: 'KPI comparativo', description: 'Ponderado vs simple', example: 'Dos precios lado a lado' },
          { id: 'option2', name: 'Evolución dual', description: 'Líneas comparativas', example: 'Precio simple vs ponderado en el tiempo' },
          { id: 'option3', name: 'Scatter', description: 'Precio vs volumen', example: 'Puntos mostrando relación precio-unidades' },
        ]
      },
      {
        name: 'Precio promedio ponderado por valor de venta',
        formula: 'SUM(precio * valor_venta) / SUM(valor_venta)',
        shortDescription: 'Precio promedio considerando el valor monetario de las ventas',
        industries: allIndustries,
        descriptor: {
          howToUse: 'Calcula precio promedio real considerando qué precios generan más revenue',
          historicalData: '12 meses',
          captureFrequency: 'Mensual',
          actionables: [
            'Entender precio efectivo por revenue',
            'Optimizar mix de precios por valor',
            'Analizar impacto en ingresos'
          ]
        },
        visualizationOptions: [
          { id: 'option1', name: 'KPI de revenue', description: 'Precio ponderado', example: 'Número con impacto en ventas' },
          { id: 'option2', name: 'Cascada de valor', description: 'Waterfall', example: 'Contribución al revenue por rango de precio' },
          { id: 'option3', name: 'Matriz precio-valor', description: 'Heatmap', example: 'Precio vs valor de venta' },
        ]
      },
      {
        name: 'Gap promedio vs precio de lista',
        formula: 'AVG(precio_lista - precio_venta)',
        shortDescription: 'Diferencia monetaria promedio entre precio de lista y precio real',
        industries: allIndustries,
        descriptor: {
          howToUse: 'Mide el descuento promedio que se está aplicando en el mercado',
          historicalData: '6 meses',
          captureFrequency: 'Semanal',
          actionables: [
            'Controlar nivel de descuentos',
            'Proteger margen vs precio lista',
            'Identificar canales con mayor gap',
            'Ajustar precio de lista si gap es muy alto'
          ]
        },
        visualizationOptions: [
          { id: 'option1', name: 'KPI monetario', description: 'Valor del gap', example: 'Monto de descuento promedio' },
          { id: 'option2', name: 'Barras por canal', description: 'Gap por segmento', example: 'Descuento promedio por tipo de PDV' },
          { id: 'option3', name: 'Evolución temporal', description: 'Línea de tendencia', example: 'Cambios en el gap mes a mes' },
        ]
      },
      {
        name: 'Gap promedio % vs precio de lista',
        formula: 'AVG((precio_lista - precio_venta) / precio_lista) * 100',
        shortDescription: 'Descuento porcentual promedio respecto al precio de lista',
        industries: allIndustries,
        descriptor: {
          howToUse: 'Mide el descuento relativo promedio que se está aplicando',
          historicalData: '6 meses',
          captureFrequency: 'Semanal',
          actionables: [
            'Controlar % de descuento aplicado',
            'Comparar con política comercial',
            'Identificar productos con alto descuento',
            'Optimizar estructura de precios'
          ]
        },
        visualizationOptions: [
          { id: 'option1', name: 'KPI porcentual', description: 'Gap como %', example: 'Porcentaje de descuento promedio' },
          { id: 'option2', name: 'Heatmap de productos', description: 'Matriz SKU vs canal', example: 'Mapa de calor de descuentos' },
          { id: 'option3', name: 'Distribución', description: 'Histograma', example: 'Frecuencia de rangos de descuento' },
        ]
      },
      {
        name: '% PDV con precio fuera de rango objetivo',
        formula: '(COUNT(pdv WHERE precio NOT BETWEEN min_objetivo AND max_objetivo) / COUNT(total_pdv)) * 100',
        shortDescription: 'Porcentaje de puntos de venta que no cumplen con el rango de precio definido',
        industries: allIndustries,
        descriptor: {
          howToUse: 'Identifica qué porcentaje de PDVs tiene precios fuera de la política establecida',
          historicalData: '3 meses',
          captureFrequency: 'Semanal',
          actionables: [
            'Corregir precios en PDVs fuera de rango',
            'Investigar causas de incumplimiento',
            'Reforzar política de precios',
            'Sancionar o renegociar con PDVs recurrentes'
          ]
        },
        visualizationOptions: [
          { id: 'option1', name: 'Gauge de cumplimiento', description: 'Medidor inverso', example: 'Velocímetro mostrando % fuera de rango' },
          { id: 'option2', name: 'Mapa geográfico', description: 'Distribución espacial', example: 'Mapa con PDVs fuera de política' },
          { id: 'option3', name: 'Lista de PDVs', description: 'Tabla clasificada', example: 'Ranking de PDVs con mayor desviación' },
        ]
      },
      {
        name: '% PDV con precio dentro del rango objetivo',
        formula: '(COUNT(pdv WHERE precio BETWEEN min_objetivo AND max_objetivo) / COUNT(total_pdv)) * 100',
        shortDescription: 'Porcentaje de puntos de venta que cumplen con el rango de precio definido',
        industries: allIndustries,
        descriptor: {
          howToUse: 'Mide el nivel de cumplimiento de la política de precios en el mercado',
          historicalData: '3 meses',
          captureFrequency: 'Semanal',
          actionables: [
            'Mantener y reforzar cumplimiento actual',
            'Reconocer PDVs con buen cumplimiento',
            'Establecer metas de mejora',
            'Monitorear tendencia de cumplimiento'
          ]
        },
        visualizationOptions: [
          { id: 'option1', name: 'Gauge de cumplimiento', description: 'Medidor positivo', example: 'Velocímetro mostrando % en rango' },
          { id: 'option2', name: 'Evolución temporal', description: 'Línea de tendencia', example: 'Mejora de cumplimiento en el tiempo' },
          { id: 'option3', name: 'Barras comparativas', description: 'Por región o canal', example: 'Cumplimiento por segmento' },
        ]
      },
    ]
  },
  'Visitas': {
    description: 'Gestiona la ejecución del plan de visitas del equipo comercial, midiendo cobertura, cumplimiento y efectividad.',
    industries: allIndustries,
    indicators: [
      { 
        name: 'Cantidad de Visitas',
        formula: 'COUNT(visitas)',
        shortDescription: 'Total de visitas realizadas a puntos de venta',
        industries: allIndustries,
        descriptor: {
          howToUse: 'Cuenta el total de visitas realizadas a puntos de venta para medir cobertura',
          historicalData: '3 meses',
          captureFrequency: 'Diario',
          actionables: [
            'Incrementar frecuencia en PDVs estratégicos',
            'Redistribuir rutas del equipo comercial',
            'Evaluar productividad del equipo de ventas'
          ]
        },
        visualizationOptions: [
          { id: 'option1', name: 'Contador con meta', description: 'Número grande con objetivo', example: 'KPI card mostrando visitas vs cuota' },
          { id: 'option2', name: 'Calendario de calor', description: 'Heatmap por día', example: 'Calendario con intensidad de visitas' },
          { id: 'option3', name: 'Barras por vendedor', description: 'Ranking de equipo', example: 'Barras horizontales por persona' },
        ]
      },
      { 
        name: '% Cumplimiento de rutero (vs cuota ó vs total rutero)',
        formula: '(COUNT(visitas_realizadas) / COUNT(visitas_programadas)) * 100',
        shortDescription: 'Porcentaje de visitas realizadas vs programadas en el plan',
        industries: allIndustries,
        descriptor: {
          howToUse: 'Mide el porcentaje de cumplimiento del plan de visitas programadas',
          historicalData: '6 meses',
          captureFrequency: 'Diario',
          actionables: [
            'Identificar vendedores con bajo cumplimiento',
            'Optimizar rutas para mejorar eficiencia',
            'Ajustar metas de visitas según capacidad real'
          ]
        },
        visualizationOptions: [
          { id: 'option1', name: 'Progreso circular', description: 'Donut con porcentaje', example: 'Gráfico circular mostrando completitud' },
          { id: 'option2', name: 'Barras por período', description: 'Comparativa semanal/mensual', example: 'Barras de cumplimiento por semana' },
          { id: 'option3', name: 'Tabla con semáforo', description: 'Lista de vendedores', example: 'Tabla con estado verde/amarillo/rojo' },
        ]
      },
      { 
        name: '% Efectividad de visitas',
        formula: '(COUNT(visitas_efectivas) / COUNT(total_visitas)) * 100',
        shortDescription: 'Porcentaje de visitas que resultan en acciones efectivas (pedidos, acuerdos)',
        industries: allIndustries,
        descriptor: {
          howToUse: 'Calcula qué porcentaje de visitas resulta en acciones efectivas (pedidos, acuerdos, etc.)',
          historicalData: '6 meses',
          captureFrequency: 'Semanal',
          actionables: [
            'Mejorar capacitación del equipo de ventas',
            'Revisar calidad de la base de clientes visitados',
            'Implementar mejores prácticas de vendedores top'
          ]
        },
        visualizationOptions: [
          { id: 'option1', name: 'Embudo de conversión', description: 'Funnel chart', example: 'Embudo de visitas a ventas efectivas' },
          { id: 'option2', name: 'Evolución mensual', description: 'Línea de tendencia', example: 'Gráfico mostrando mejora en el tiempo' },
          { id: 'option3', name: 'Comparativa de equipo', description: 'Ranking por vendedor', example: 'Barras ordenadas de mayor a menor efectividad' },
        ]
      },
    ]
  },
};

export function GraphSelectionForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    industry: null,
    selectedVariables: [],
    indicatorConfigs: {},
  });
  const [editingFormula, setEditingFormula] = useState<string | null>(null);

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    try {
      console.log('Sending form data:', formData);
      
      const response = await fetch('https://simpleservertest.vercel.app/formpost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Server response:', result);
        alert('¡Dashboard creado exitosamente! Los datos se enviaron correctamente.');
      } else {
        console.error('Error response:', response.status, response.statusText);
        alert(`Error al enviar los datos: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error al conectar con el servidor. Verifica que el endpoint esté disponible.');
    }
  };

  const toggleVariable = (variable: string) => {
    setFormData(prev => {
      const isSelected = prev.selectedVariables.includes(variable);
      if (isSelected) {
        // Remove variable and its indicators
        const newConfigs = { ...prev.indicatorConfigs };
        Object.keys(newConfigs).forEach(key => {
          if (newConfigs[key].variable === variable) {
            delete newConfigs[key];
          }
        });
        return {
          ...prev,
          selectedVariables: prev.selectedVariables.filter(v => v !== variable),
          indicatorConfigs: newConfigs,
        };
      } else {
        return {
          ...prev,
          selectedVariables: [...prev.selectedVariables, variable],
        };
      }
    });
  };

  const toggleIndicator = (
    variable: string,
    indicatorName: string,
    defaultFormula: string,
    descriptor: IndicatorDescriptor,
    visualizationOptions: VisualizationOption[]
  ) => {
    const key = `${variable}__${indicatorName}`;
    setFormData(prev => {
      const newConfigs = { ...prev.indicatorConfigs };
      if (newConfigs[key]) {
        delete newConfigs[key];
      } else {
        newConfigs[key] = {
          name: indicatorName,
          variable,
          visualizationType: null,
          formula: defaultFormula,
          defaultFormula,
          descriptor,
          visualizationOptions,
        };
      }
      return {
        ...prev,
        indicatorConfigs: newConfigs,
      };
    });
  };

  const updateIndicatorGraph = (key: string, graphType: VisualizationType) => {
    setFormData(prev => ({
      ...prev,
      indicatorConfigs: {
        ...prev.indicatorConfigs,
        [key]: {
          ...prev.indicatorConfigs[key],
          visualizationType: graphType,
        },
      },
    }));
  };

  const updateIndicatorFormula = (key: string, formula: string) => {
    setFormData(prev => ({
      ...prev,
      indicatorConfigs: {
        ...prev.indicatorConfigs,
        [key]: {
          ...prev.indicatorConfigs[key],
          formula,
        },
      },
    }));
  };

  const resetFormula = (key: string) => {
    setFormData(prev => ({
      ...prev,
      indicatorConfigs: {
        ...prev.indicatorConfigs,
        [key]: {
          ...prev.indicatorConfigs[key],
          formula: prev.indicatorConfigs[key].defaultFormula,
        },
      },
    }));
    setEditingFormula(null);
  };

  const getAvailableVariables = () => {
    if (!formData.industry) return [];
    return Object.entries(variablesData).filter(([_, varInfo]) =>
      varInfo.industries.includes(formData.industry!)
    );
  };

  const getAvailableIndicators = (variable: string) => {
    if (!formData.industry) return [];
    return variablesData[variable].indicators.filter(ind =>
      ind.industries.includes(formData.industry!)
    );
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.industry !== null;
      case 2:
        return formData.selectedVariables.length > 0 && Object.keys(formData.indicatorConfigs).length > 0;
      case 3:
        return Object.values(formData.indicatorConfigs).every(config => config.visualizationType !== null);
      case 4:
        return true;
      default:
        return false;
    }
  };

  const selectedIndustry = industries.find(i => i.id === formData.industry);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Industry Badge (visible after selection) */}
      {formData.industry && step > 1 && (
        <div className="bg-[#f0f9ff] border-b border-[#41c0f0] px-8 py-3">
          <div className="flex items-center gap-2 text-[14px]">
            <span className="text-[#979797]">Industria seleccionada:</span>
            <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-[#41c0f0]">
              {selectedIndustry && <selectedIndustry.icon className="w-4 h-4 text-[#005fa0]" />}
              <span className="text-[#005fa0]">{selectedIndustry?.name}</span>
            </div>
          </div>
        </div>
      )}

      {/* Progress Steps */}
      <div className="border-b border-[rgba(0,0,0,0.1)]">
        <div className="flex">
          {[1, 2, 3, 4].map((stepNum) => (
            <div
              key={stepNum}
              className={`flex-1 py-4 px-6 text-center border-b-2 transition-colors ${
                stepNum === step
                  ? 'border-[#41c0f0] text-[#005fa0]'
                  : stepNum < step
                  ? 'border-[#41c0f0] text-[#253a66]'
                  : 'border-transparent text-[#979797]'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  stepNum <= step ? 'bg-[#41c0f0] text-white' : 'bg-[#f5f5f5] text-[#979797]'
                }`}>
                  {stepNum}
                </span>
                <span className="hidden md:inline text-[14px]">
                  {stepNum === 1 && 'Industria'}
                  {stepNum === 2 && 'Selección de Indicadores'}
                  {stepNum === 3 && 'Configuración de Visualización'}
                  {stepNum === 4 && 'Revisión Final'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="p-8 min-h-[500px]">
        {/* Step 1: Industry Selection */}
        {step === 1 && (
          <div>
            <h2 className="text-[24px] text-[#253a66] mb-2">
              Selecciona tu industria
            </h2>
            <p className="text-[#979797] mb-6">
              La industria determina qué indicadores estarán disponibles para tu dashboard
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {industries.map((industry) => {
                const Icon = industry.icon;
                return (
                  <button
                    key={industry.id}
                    onClick={() => setFormData({ ...formData, industry: industry.id, selectedVariables: [], indicatorConfigs: {} })}
                    className={`p-8 border-2 rounded-lg text-left transition-all hover:border-[#41c0f0] hover:shadow-md ${
                      formData.industry === industry.id
                        ? 'border-[#41c0f0] bg-[#f0f9ff] shadow-md'
                        : 'border-[#e5e5e5]'
                    }`}
                  >
                    <Icon className={`w-16 h-16 mb-4 ${
                      formData.industry === industry.id ? 'text-[#005fa0]' : 'text-[#979797]'
                    }`} />
                    <h3 className="text-[#253a66] mb-2">{industry.name}</h3>
                    <p className="text-[14px] text-[#979797]">{industry.description}</p>
                    {formData.industry === industry.id && (
                      <div className="mt-4 flex items-center gap-2 text-[#41c0f0]">
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="text-[14px]">Seleccionada</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Variable and Indicator Selection */}
        {step === 2 && (
          <div>
            <h2 className="text-[24px] text-[#253a66] mb-2">
              Selecciona variables e indicadores
            </h2>
            <p className="text-[#979797] mb-6">
              Selecciona una o más variables, luego elige los indicadores que deseas visualizar
            </p>
            
            {/* Variables Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {getAvailableVariables().map(([variable, _]) => {
                const selectedCount = Object.values(formData.indicatorConfigs).filter(c => c.variable === variable).length;
                return (
                  <button
                    key={variable}
                    onClick={() => toggleVariable(variable)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      formData.selectedVariables.includes(variable)
                        ? 'border-[#41c0f0] bg-[#f0f9ff] text-[#005fa0]'
                        : 'border-[#e5e5e5] text-[#253a66] hover:border-[#41c0f0]'
                    }`}
                  >
                    {variable}
                    {selectedCount > 0 && (
                      <span className="ml-2 bg-[#41c0f0] text-white px-2 py-0.5 rounded-full text-[12px]">
                        {selectedCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Indicators for Selected Variables */}
            <div className="space-y-6">
              {formData.selectedVariables.map((variable) => {
                const availableIndicators = getAvailableIndicators(variable);
                return (
                  <div key={variable} className="border-2 border-[#41c0f0] rounded-lg p-6 bg-[#f0f9ff]">
                    {/* Variable Header with Description */}
                    <div className="mb-4">
                      <h3 className="text-[#253a66] mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#41c0f0]" />
                        {variable}
                      </h3>
                      <p className="text-[14px] text-[#005fa0] ml-7">
                        {variablesData[variable].description}
                      </p>
                    </div>
                    
                    {/* Indicators Grid */}
                    <div className="grid grid-cols-1 gap-3">
                      {availableIndicators.map((indicator) => {
                        const key = `${variable}__${indicator.name}`;
                        const isSelected = !!formData.indicatorConfigs[key];
                        return (
                          <button
                            key={indicator.name}
                            onClick={() => toggleIndicator(variable, indicator.name, indicator.formula, indicator.descriptor, indicator.visualizationOptions)}
                            className={`p-4 border-2 rounded-lg text-left transition-all ${
                              isSelected
                                ? 'border-[#41c0f0] bg-white shadow-md'
                                : 'border-[#e5e5e5] bg-white hover:border-[#41c0f0] hover:shadow'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <CheckCircle2 className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                                isSelected ? 'text-[#41c0f0]' : 'text-[#e5e5e5]'
                              }`} />
                              <div className="flex-1">
                                <span className="text-[#253a66] block mb-2">{indicator.name}</span>
                                <p className="text-[13px] text-[#979797] mb-2">
                                  {indicator.shortDescription}
                                </p>
                                <p className="text-[12px] text-[#005fa0] font-mono bg-[#f5f5f5] px-2 py-1 rounded inline-block">
                                  {indicator.formula}
                                </p>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {Object.keys(formData.indicatorConfigs).length > 0 && (
              <div className="mt-6 p-4 bg-[#f0f9ff] rounded-lg">
                <p className="text-[14px] text-[#005fa0]">
                  {Object.keys(formData.indicatorConfigs).length} indicador{Object.keys(formData.indicatorConfigs).length > 1 ? 'es' : ''} seleccionado{Object.keys(formData.indicatorConfigs).length > 1 ? 's' : ''} de {formData.selectedVariables.length} variable{formData.selectedVariables.length > 1 ? 's' : ''}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Visualization Configuration */}
        {step === 3 && (
          <div>
            <h2 className="text-[24px] text-[#253a66] mb-2">
              Configura la visualización y fórmulas
            </h2>
            <p className="text-[#979797] mb-6">
              Para cada indicador, revisa su información, selecciona cómo visualizarlo y edita la fórmula si lo deseas
            </p>

            <div className="space-y-8">
              {formData.selectedVariables.map((variable) => {
                const indicators = Object.entries(formData.indicatorConfigs).filter(
                  ([key, config]) => config.variable === variable
                );
                
                if (indicators.length === 0) return null;

                return (
                  <div key={variable} className="border-2 border-[#e5e5e5] rounded-lg p-6">
                    <h3 className="text-[#253a66] mb-6">{variable}</h3>
                    <div className="space-y-8">
                      {indicators.map(([key, config]) => (
                        <div key={key} className="border-2 border-[#41c0f0] rounded-lg p-6 bg-[#f0f9ff]">
                          <h4 className="text-[#253a66] mb-4">{config.name}</h4>
                          
                          {/* Descriptor Information */}
                          <div className="bg-white rounded-lg p-4 mb-6 border border-[#e5e5e5]">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div className="flex gap-3">
                                <Info className="w-5 h-5 text-[#41c0f0] flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                  <p className="text-[12px] text-[#979797] mb-1">Cómo usar</p>
                                  <p className="text-[14px] text-[#253a66]">{config.descriptor.howToUse}</p>
                                </div>
                              </div>

                              <div className="space-y-3">
                                <div className="flex gap-3">
                                  <Calendar className="w-4 h-4 text-[#41c0f0] flex-shrink-0 mt-1" />
                                  <div className="flex-1">
                                    <p className="text-[12px] text-[#979797]">Histórico recomendado</p>
                                    <p className="text-[14px] text-[#253a66]">{config.descriptor.historicalData}</p>
                                  </div>
                                </div>

                                <div className="flex gap-3">
                                  <Clock className="w-4 h-4 text-[#41c0f0] flex-shrink-0 mt-1" />
                                  <div className="flex-1">
                                    <p className="text-[12px] text-[#979797]">Frecuencia de captura</p>
                                    <p className="text-[14px] text-[#253a66]">{config.descriptor.captureFrequency}</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex gap-3 pt-3 border-t border-[#e5e5e5]">
                              <Zap className="w-5 h-5 text-[#41c0f0] flex-shrink-0 mt-0.5" />
                              <div className="flex-1">
                                <p className="text-[12px] text-[#979797] mb-2">Accionables</p>
                                <ul className="space-y-1">
                                  {config.descriptor.actionables.map((actionable, idx) => (
                                    <li key={idx} className="text-[13px] text-[#253a66] flex gap-2">
                                      <span className="text-[#41c0f0]">•</span>
                                      <span>{actionable}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>

                          {/* Visualization Options */}
                          <div className="mb-6">
                            <label className="block text-[#253a66] mb-3">
                              Selecciona la forma de visualización
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {config.visualizationOptions.map((option) => (
                                <button
                                  key={option.id}
                                  onClick={() => updateIndicatorGraph(key, option.id)}
                                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                                    config.visualizationType === option.id
                                      ? 'border-[#41c0f0] bg-white shadow-md'
                                      : 'border-[#e5e5e5] bg-white hover:border-[#41c0f0] hover:shadow'
                                  }`}
                                >
                                  {/* Visual Example Placeholder */}
                                  <div className={`w-full h-24 mb-3 rounded flex items-center justify-center ${
                                    config.visualizationType === option.id 
                                      ? 'bg-gradient-to-br from-[#41c0f0] to-[#005fa0]' 
                                      : 'bg-[#f5f5f5]'
                                  }`}>
                                    <span className={`text-[11px] text-center px-2 ${
                                      config.visualizationType === option.id ? 'text-white' : 'text-[#979797]'
                                    }`}>
                                      {option.example}
                                    </span>
                                  </div>
                                  <h5 className="text-[#253a66] mb-1">{option.name}</h5>
                                  <p className="text-[12px] text-[#979797]">{option.description}</p>
                                  {config.visualizationType === option.id && (
                                    <div className="mt-2 flex items-center gap-1 text-[#41c0f0]">
                                      <CheckCircle2 className="w-4 h-4" />
                                      <span className="text-[11px]">Seleccionado</span>
                                    </div>
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Formula Editor */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <label className="text-[#253a66]">
                                Fórmula de cálculo
                              </label>
                              <div className="flex gap-2">
                                {config.formula !== config.defaultFormula && (
                                  <button
                                    onClick={() => resetFormula(key)}
                                    className="text-[12px] text-[#41c0f0] hover:underline"
                                  >
                                    Restaurar original
                                  </button>
                                )}
                                {editingFormula === key ? (
                                  <button
                                    onClick={() => setEditingFormula(null)}
                                    className="flex items-center gap-1 text-[12px] text-[#41c0f0]"
                                  >
                                    <Check className="w-3 h-3" />
                                    Guardar
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => setEditingFormula(key)}
                                    className="flex items-center gap-1 text-[12px] text-[#41c0f0]"
                                  >
                                    <Edit2 className="w-3 h-3" />
                                    Editar
                                  </button>
                                )}
                              </div>
                            </div>
                            {editingFormula === key ? (
                              <textarea
                                value={config.formula}
                                onChange={(e) => updateIndicatorFormula(key, e.target.value)}
                                className="w-full px-3 py-2 bg-white border-2 border-[#41c0f0] rounded font-mono text-[14px] focus:outline-none focus:border-[#005fa0]"
                                rows={3}
                              />
                            ) : (
                              <div className="w-full px-3 py-2 bg-white rounded font-mono text-[14px] text-[#253a66] border-2 border-[#e5e5e5]">
                                {config.formula}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 4: Final Review */}
        {step === 4 && (
          <div>
            <h2 className="text-[24px] text-[#253a66] mb-2">
              Revisión final
            </h2>
            <p className="text-[#979797] mb-6">
              Revisa tu configuración antes de crear el dashboard
            </p>

            <div className="space-y-6">
              {formData.selectedVariables.map((variable) => {
                const indicators = Object.entries(formData.indicatorConfigs).filter(
                  ([key, config]) => config.variable === variable
                );
                
                if (indicators.length === 0) return null;

                return (
                  <div key={variable} className="border-2 border-[#41c0f0] rounded-lg p-6 bg-[#f0f9ff]">
                    <h3 className="text-[#253a66] mb-4">{variable}</h3>
                    <div className="space-y-3">
                      {indicators.map(([key, config]) => {
                        const graphOption = config.visualizationOptions.find(g => g.id === config.visualizationType);
                        return (
                          <div key={key} className="bg-white border border-[#e5e5e5] rounded-lg p-4">
                            <div className="flex items-start gap-3 mb-2">
                              <div className="flex-1">
                                <h4 className="text-[#253a66]">{config.name}</h4>
                                <p className="text-[12px] text-[#979797] mt-1">
                                  Visualización: <span className="text-[#005fa0]">{graphOption?.name}</span>
                                </p>
                              </div>
                            </div>
                            <div className="mt-2">
                              <p className="text-[12px] text-[#979797] mb-1">Fórmula:</p>
                              <p className="text-[12px] font-mono text-[#253a66] bg-[#f5f5f5] p-2 rounded">
                                {config.formula}
                              </p>
                              {config.formula !== config.defaultFormula && (
                                <p className="text-[10px] text-[#41c0f0] mt-1">
                                  ✓ Fórmula personalizada
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              <div className="mt-6 p-6 bg-[#f0f9ff] border border-[#41c0f0] rounded-lg">
                <h3 className="text-[#253a66] mb-4">Resumen</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-[24px] text-[#005fa0]">{formData.selectedVariables.length}</p>
                    <p className="text-[12px] text-[#979797]">Variables</p>
                  </div>
                  <div>
                    <p className="text-[24px] text-[#005fa0]">{Object.keys(formData.indicatorConfigs).length}</p>
                    <p className="text-[12px] text-[#979797]">Indicadores</p>
                  </div>
                  <div>
                    <p className="text-[24px] text-[#005fa0]">
                      {Object.values(formData.indicatorConfigs).filter(c => c.formula !== c.defaultFormula).length}
                    </p>
                    <p className="text-[12px] text-[#979797]">Fórmulas personalizadas</p>
                  </div>
                  <div>
                    <p className="text-[24px] text-[#005fa0]">
                      {new Set(Object.values(formData.indicatorConfigs).map(c => c.visualizationType)).size}
                    </p>
                    <p className="text-[12px] text-[#979797]">Tipos de visualización</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="border-t border-[rgba(0,0,0,0.1)] px-8 py-6 flex items-center justify-between bg-[#f5f5f5]">
        <button
          onClick={handlePrevious}
          disabled={step === 1}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
            step === 1
              ? 'text-[#979797] cursor-not-allowed'
              : 'text-[#005fa0] hover:bg-white'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
          Anterior
        </button>

        <div className="text-[#979797]">
          Paso {step} de 4
        </div>

        {step < 4 ? (
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
              canProceed()
                ? 'bg-[#41c0f0] text-white hover:bg-[#005fa0]'
                : 'bg-[#e5e5e5] text-[#979797] cursor-not-allowed'
            }`}
          >
            Siguiente
            <ChevronRight className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!canProceed()}
            className={`px-8 py-3 rounded-lg transition-all ${
              canProceed()
                ? 'bg-[#41c0f0] text-white hover:bg-[#005fa0]'
                : 'bg-[#e5e5e5] text-[#979797] cursor-not-allowed'
            }`}
          >
            Crear Dashboard
          </button>
        )}
      </div>
    </div>
  );
}
