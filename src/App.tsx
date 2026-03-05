import { useState } from 'react';
import { GraphSelectionForm } from './components/GraphSelectionForm';
import { Dashboard, FormData } from './components/Dashboard';
import svgPaths from "./imports/svg-ofxr8hlvdr";

function Logo() {
  return (
    <div className="h-[40px] w-[120px]">
      <img alt="Eficacia" className="h-full w-full object-contain" src={"https://eficacia.com.co/wp-content/uploads/2020/05/logo.svg"} />
    </div>
  );
}

function Navigation() {
  return (
    <nav className="bg-white border-b border-[rgba(0,0,0,0.1)]">
      <div className="max-w-[1400px] mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-8">
            <button className="text-[#005fa0]">INICIO</button>
            <button className="text-[#333]">GRÁFICOS</button>
            <button className="text-[#333]">PLANTILLAS</button>
            <button className="text-[#333]">AYUDA</button>
          </div>
          <button className="bg-[#41c0f0] text-white px-8 py-3 rounded-[30px]">
            INGRESAR
          </button>
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  const [currentView, setCurrentView] = useState<'form' | 'dashboard'>('form');
  const [dashboardData, setDashboardData] = useState<FormData | null>(null);

  const handleFormSubmit = (formData: FormData) => {
    setDashboardData(formData);
    setCurrentView('dashboard');
  };

  const handleBackToForm = () => {
    setCurrentView('form');
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {currentView === 'form' && (
        <>
          <Navigation />
          <main className="max-w-[1200px] mx-auto px-6 py-12">
            <div className="mb-8">
              <h1 className="text-[32px] text-[#253a66] mb-2">
                Crea tu dashboard de indicadores
              </h1>
              <p className="text-[#979797]">
                Selecciona variables, indicadores y personaliza las visualizaciones
              </p>
            </div>
            <GraphSelectionForm onSubmit={handleFormSubmit} />
          </main>
        </>
      )}
      
      {currentView === 'dashboard' && dashboardData && (
        <Dashboard formData={dashboardData} onBack={handleBackToForm} />
      )}
    </div>
  );
}