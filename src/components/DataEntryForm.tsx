import { useState } from 'react';
import { Zap, Plus, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';

export interface DataEntry {
  pdv: string;
  date: string;
  exhibiciones_propias: number;
  exhibiciones_competencia: number;
  exhibiciones_tipo: string;
  impulsadoras_propias: number;
  impulsadoras_competencia: number;
  productos_agotados: number;
  total_productos: number;
  presencia_actual: number;
  presencia_anterior: number;
  ventas_potenciales_perdidas: number;
  ventas_totales: number;
  precio: number;
  precio_competencia: number;
  metros_lineal_propios: number;
  transferencias_realizadas: number;
  [key: string]: string | number;
}

interface DataEntryFormProps {
  onDataSubmit: (data: DataEntry[]) => void;
}

const DEFAULT_ENTRY: DataEntry = {
  pdv: '',
  date: new Date().toISOString().split('T')[0],
  exhibiciones_propias: 0,
  exhibiciones_competencia: 0,
  exhibiciones_tipo: 'isla',
  impulsadoras_propias: 0,
  impulsadoras_competencia: 0,
  productos_agotados: 0,
  total_productos: 200,
  presencia_actual: 0,
  presencia_anterior: 0,
  ventas_potenciales_perdidas: 0,
  ventas_totales: 100000,
  precio: 25.0,
  precio_competencia: 24.0,
  metros_lineal_propios: 5.5,
  transferencias_realizadas: 150,
};

const FIELD_CONFIG = [
  { key: 'pdv', label: 'PDV', type: 'text', placeholder: 'ej: PDV001' },
  { key: 'date', label: 'Fecha', type: 'date' },
  { key: 'exhibiciones_propias', label: 'Exhibiciones Propias', type: 'number' },
  { key: 'exhibiciones_competencia', label: 'Exhibiciones Competencia', type: 'number' },
  { key: 'exhibiciones_tipo', label: 'Tipo de Exhibición', type: 'text', placeholder: 'ej: isla, góndola' },
  { key: 'impulsadoras_propias', label: 'Impulsadoras Propias', type: 'number' },
  { key: 'impulsadoras_competencia', label: 'Impulsadoras Competencia', type: 'number' },
  { key: 'productos_agotados', label: 'Productos Agotados', type: 'number' },
  { key: 'total_productos', label: 'Total Productos', type: 'number' },
  { key: 'presencia_actual', label: 'Presencia Actual (%)', type: 'number', step: 0.1 },
  { key: 'presencia_anterior', label: 'Presencia Anterior (%)', type: 'number', step: 0.1 },
  { key: 'ventas_potenciales_perdidas', label: 'Ventas Potenciales Perdidas', type: 'number' },
  { key: 'ventas_totales', label: 'Ventas Totales', type: 'number' },
  { key: 'precio', label: 'Precio Propio', type: 'number', step: 0.1 },
  { key: 'precio_competencia', label: 'Precio Competencia', type: 'number', step: 0.1 },
  { key: 'metros_lineal_propios', label: 'Metros Lineales Propios', type: 'number', step: 0.1 },
  { key: 'transferencias_realizadas', label: 'Transferencias Realizadas', type: 'number' },
];

const generateRandomNumber = (min: number, max: number, decimals: number = 0): number => {
  const random = Math.random() * (max - min) + min;
  return decimals > 0 ? parseFloat(random.toFixed(decimals)) : Math.floor(random);
};

const generateRandomData = (): DataEntry => {
  return {
    pdv: `PDV${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
    date: new Date().toISOString().split('T')[0],
    exhibiciones_propias: generateRandomNumber(1, 10),
    exhibiciones_competencia: generateRandomNumber(0, 8),
    exhibiciones_tipo: ['isla', 'góndola', 'mostrador', 'entrada'].sort(() => Math.random() - 0.5)[0],
    impulsadoras_propias: generateRandomNumber(0, 5),
    impulsadoras_competencia: generateRandomNumber(0, 3),
    productos_agotados: generateRandomNumber(5, 50),
    total_productos: 200,
    presencia_actual: generateRandomNumber(70, 100, 1),
    presencia_anterior: generateRandomNumber(60, 95, 1),
    ventas_potenciales_perdidas: generateRandomNumber(1000, 10000),
    ventas_totales: generateRandomNumber(50000, 200000),
    precio: generateRandomNumber(20, 35, 2),
    precio_competencia: generateRandomNumber(18, 32, 2),
    metros_lineal_propios: generateRandomNumber(2, 8, 1),
    transferencias_realizadas: generateRandomNumber(50, 300),
  };
};

export function DataEntryForm({ onDataSubmit }: DataEntryFormProps) {
  const [entries, setEntries] = useState<DataEntry[]>([DEFAULT_ENTRY]);
  const [expandedEntry, setExpandedEntry] = useState<number>(0);

  const handleFieldChange = (index: number, key: string, value: string | number) => {
    const newEntries = [...entries];
    newEntries[index] = {
      ...newEntries[index],
      [key]: key.includes('_') && typeof value === 'string' && !['pdv', 'exhibiciones_tipo', 'date'].includes(key)
        ? parseFloat(value) || 0
        : value,
    };
    setEntries(newEntries);
  };

  const handleAutofill = () => {
    const newEntries = entries.map(() => generateRandomData());
    setEntries(newEntries);
  };

  const handleAutofillSingle = (index: number) => {
    const newEntries = [...entries];
    newEntries[index] = generateRandomData();
    setEntries(newEntries);
  };

  const handleAddEntry = () => {
    setEntries([...entries, DEFAULT_ENTRY]);
    setExpandedEntry(entries.length);
  };

  const handleRemoveEntry = (index: number) => {
    if (entries.length > 1) {
      const newEntries = entries.filter((_, i) => i !== index);
      setEntries(newEntries);
      if (expandedEntry === index) {
        setExpandedEntry(0);
      }
    }
  };

  const handleSubmit = () => {
    onDataSubmit(entries);
  };

  const isValidEntries = entries.every(entry => entry.pdv && entry.date);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#005fa0] to-[#41c0f0] px-8 py-6">
        <h2 className="text-[28px] text-white mb-2">Ingresa Datos para los Gráficos</h2>
        <p className="text-blue-100">Completa la información de tus puntos de venta para generar visualizaciones</p>
      </div>

      {/* Action Buttons */}
      <div className="bg-[#f0f9ff] border-b border-[#41c0f0] px-8 py-4 flex gap-4 flex-wrap">
        <Button
          onClick={handleAutofill}
          className="bg-[#41c0f0] hover:bg-[#0099cc] text-white flex items-center gap-2"
        >
          <Zap className="w-4 h-4" />
          {entries.length > 1 ? 'Autocompletar Todos' : 'Autocompletar'}
        </Button>
        <Button
          onClick={handleAddEntry}
          variant="outline"
          className="border-[#41c0f0] text-[#005fa0] hover:bg-[#f0f9ff] flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Agregar Registro
        </Button>
      </div>

      {/* Entries */}
      <div className="p-8 space-y-4 max-h-[600px] overflow-y-auto">
        {entries.map((entry, index) => (
          <Card key={index} className="border-[#e5e5e5] overflow-hidden">
            {/* Entry Header */}
            <button
              onClick={() => setExpandedEntry(expandedEntry === index ? -1 : index)}
              className="w-full px-6 py-4 bg-[#f9f9f9] hover:bg-[#f0f9ff] border-b border-[#e5e5e5] flex items-center justify-between transition-colors"
            >
              <div className="text-left">
                <div className="text-[14px] text-[#979797]">Registro {index + 1}</div>
                <div className="text-[#253a66] font-medium">
                  {entry.pdv || 'Sin PDV'} - {entry.date}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAutofillSingle(index);
                  }}
                  className="p-2 hover:bg-white rounded transition-colors text-[#41c0f0]"
                  title="Autocompletar este registro"
                >
                  <Zap className="w-4 h-4" />
                </button>
                {entries.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveEntry(index);
                    }}
                    className="p-2 hover:bg-red-50 rounded transition-colors text-red-500"
                    title="Eliminar este registro"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </button>

            {/* Entry Form */}
            {expandedEntry === index && (
              <div className="p-6 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {FIELD_CONFIG.map(({ key, label, type, placeholder, step }) => (
                    <div key={key}>
                      <label className="block text-[14px] font-medium text-[#253a66] mb-2">
                        {label}
                      </label>
                      <Input
                        type={type}
                        placeholder={placeholder}
                        step={step}
                        value={entry[key]}
                        onChange={(e) => handleFieldChange(index, key, e.target.value)}
                        className="border-[#e5e5e5] focus:border-[#41c0f0] focus:ring-[#41c0f0]"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Submit Button */}
      <div className="bg-[#f9f9f9] border-t border-[#e5e5e5] px-8 py-6 flex justify-end gap-4">
        <Button
          onClick={handleSubmit}
          disabled={!isValidEntries}
          className={`px-8 py-3 text-white ${
            isValidEntries
              ? 'bg-[#41c0f0] hover:bg-[#0099cc]'
              : 'bg-[#ccc] cursor-not-allowed'
          }`}
        >
          Continuar con Datos
        </Button>
      </div>

      {/* Validation Message */}
      {!isValidEntries && (
        <div className="bg-red-50 border-t border-red-300 px-8 py-3 text-red-600 text-[14px]">
          ⚠️ Por favor completa PDV y Fecha en todos los registros
        </div>
      )}
    </div>
  );
}
