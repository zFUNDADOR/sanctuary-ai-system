import React, { useState } from 'react';
import './App.css'; 

// Importa os componentes de seção
import SanctuarySection from './components/sections/SanctuarySection';
import VirgoAIAssistant from './components/sections/VirgoAIAssistant'; 
import GeminiAIAssistant from './components/sections/GeminiAIAssistant';
import ControlZone from './components/sections/ControlZone'; 
import LeoContentCreator from './components/sections/LeoContentCreator';

// Importa os componentes comuns
import DebugPanel from './components/common/DebugPanel'; 
import ThemeToggle from './components/common/ThemeToggle'; 
import WallpaperSelector from './components/common/WallpaperSelector'; 
import ZodiacTheme from './components/common/ZodiacTheme';

// Importação do hook de debug
import { useDebugLogger } from './hooks/useDebugLogger'; 

// Importa o ThemeProvider e useTheme do seu contexto
import { ThemeProvider, useTheme } from './contexts/ThemeContext'; 

// Importações para ícones
import { MdBugReport, MdCode } from 'react-icons/md';


// O componente principal App.jsx do seu Sanctuary
function App() {
  // Obtém o tema, wallpaper, e a view atual do contexto
  const { currentTheme, currentWallpaper, setCurrentWallpaper, currentView, setCurrentView } = useTheme();
  
  // Estado para controlar a seção ativa (agora baseada no zodíaco ou "Sanctuary")
  // Inicializa com 'Sanctuary' ou 'zodiac-theme' se for a view inicial
  const [activeSection, setActiveSection] = useState(currentView === 'zodiac-theme' ? 'ZODIAC_THEME' : 'Sanctuary'); 
  // Estado para controlar a visibilidade do painel de debug
  const [isDebugPanelOpen, setIsDebugPanelOpen] = useState(false);
  
  // Hook de debug
  const { logs, log: addDebugMessage, clearLogs, exportLogs } = useDebugLogger();

  // Função para mudar a seção ativa
  const handleSelectSection = (sectionName) => {
    setActiveSection(sectionName);
    // Se a seção selecionada não for 'THEMES' nem 'WALLPAPERS', resetamos a view para 'main'
    if (sectionName !== 'THEMES' && sectionName !== 'WALLPAPERS' && sectionName !== 'ZODIAC_THEME') {
      setCurrentView('main');
    }
    addDebugMessage(`Navegando para a seção: ${sectionName}`, 'info');
  };

  // Função para mudar o wallpaper
  const handleSelectWallpaper = (wallpaperUrl) => {
    setCurrentWallpaper(wallpaperUrl);
    addDebugMessage(`Wallpaper alterado para: ${wallpaperUrl}`, 'info');
  };

  return (
    <div 
      className={`min-h-screen flex flex-col transition-all duration-500 ease-in-out`}
      style={{
        backgroundImage: `url(${currentWallpaper})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundColor: currentTheme.bgMain, // Fallback ou cor base do tema
      }}
    >
      {/* Cabeçalho Principal */}
      <header className="w-full p-4 bg-gray-900 bg-opacity-70 shadow-lg flex justify-between items-center z-10">
        <h1 className="text-4xl font-extrabold text-white tracking-wide">
          <span className={`${currentTheme.highlight} transition-colors duration-500`}>Sanctuary</span> AI
        </h1>
        <nav className="flex space-x-4">
          <button 
            onClick={() => handleSelectSection('Sanctuary')} 
            className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 
                        ${activeSection === 'Sanctuary' ? currentTheme.bubble : 'bg-gray-700 hover:bg-gray-600'} 
                        text-white shadow-md`}
          >
            Santuário
          </button>
          {/* Botão para Zona de Controle */}
          <button
            onClick={() => handleSelectSection('CONTROL_ZONE')}
            className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 
                        ${activeSection === 'CONTROL_ZONE' ? currentTheme.bubble : 'bg-gray-700 hover:bg-gray-600'} 
                        text-white shadow-md flex items-center space-x-2`}
          >
            <MdCode className="text-xl" />
            <span>Controle</span>
          </button>
          {/* Botão de Debug */}
          <button
            onClick={() => setIsDebugPanelOpen(!isDebugPanelOpen)}
            className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-white shadow-md transition-colors duration-300"
            aria-label="Abrir/Fechar Painel de Debug"
          >
            <MdBugReport className="text-2xl" />
          </button>
        </nav>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-grow p-8 flex flex-col items-center justify-center relative z-0">
        {/* Renderiza as seções com base no estado activeSection ou currentView */}
        {activeSection === 'Sanctuary' && currentView === 'main' && (
          <SanctuarySection 
            onSelectZodiac={handleSelectSection} // Agora usa handleSelectSection para mudar para módulos específicos
            addDebugMessage={addDebugMessage}
          />
        )}
        {activeSection === 'VIRGEM' && currentView === 'main' && (
          <VirgoAIAssistant 
            addDebugMessage={addDebugMessage}
          />
        )}
        {activeSection === 'LEÃO' && currentView === 'main' && (
          <LeoContentCreator 
            addDebugMessage={addDebugMessage}
          />
        )}
        {activeSection === 'AQUÁRIO' && currentView === 'main' && (
          <ControlZone 
            addDebugMessage={addDebugMessage}
          />
        )}
        {activeSection === 'GÊMEOS' && currentView === 'main' && ( 
          <GeminiAIAssistant 
            addDebugMessage={addDebugMessage}
          />
        )}
        {activeSection === 'CONTROL_ZONE' && currentView === 'main' && (
          <ControlZone 
            addDebugMessage={addDebugMessage}
          />
        )}
        {/* Seções de Configuração */}
        {activeSection === 'THEMES' && currentView === 'main' && (
          <ThemeToggle /> 
        )}
        {activeSection === 'WALLPAPERS' && currentView === 'main' && (
          <WallpaperSelector 
            onSelectWallpaper={handleSelectWallpaper} 
            currentWallpaper={currentWallpaper} 
          />
        )}
        {/* Renderiza o ZodiacTheme quando a view for 'zodiac-theme' */}
        {currentView === 'zodiac-theme' && (
          <ZodiacTheme 
            addDebugMessage={addDebugMessage}
            onBackToWallpapers={() => {
              setCurrentView('main');
              setActiveSection('WALLPAPERS'); // Volta para a seção de wallpapers
            }}
          />
        )}
      </main>

      {/* Renderiza o Painel de Debug se isDebugPanelOpen for true */}
      {isDebugPanelOpen && (
        <DebugPanel 
          logs={logs} 
          onClose={() => setIsDebugPanelOpen(false)} 
          onClear={clearLogs} 
          onExport={exportLogs} 
        />
      )}

      {/* Rodapé - Adicione botões para temas e wallpapers */}
      <footer className="w-full p-4 bg-gray-900 bg-opacity-70 shadow-lg flex justify-center space-x-4 z-10">
        <button 
          onClick={() => handleSelectSection('THEMES')} 
          className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 
                      ${activeSection === 'THEMES' ? currentTheme.bubble : 'bg-gray-700 hover:bg-gray-600'} 
                      text-white shadow-md`}
        >
          Temas
        </button>
        <button 
          onClick={() => handleSelectSection('WALLPAPERS')} 
          className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 
                      ${activeSection === 'WALLPAPERS' ? currentTheme.bubble : 'bg-gray-700 hover:bg-gray-600'} 
                      text-white shadow-md`}
        >
          Wallpapers
        </button>
      </footer>
    </div>
  );
}

// O componente App é envolvido pelo ThemeProvider para que todos os seus filhos tenham acesso ao contexto do tema.
export default function AppWithThemeProvider() {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}
