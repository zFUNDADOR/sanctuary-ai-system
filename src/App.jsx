// src/App.jsx
import React, { useState, useEffect } from 'react';
import './App.css'; 

// Importa o ThemeProvider para o tema da sua aplicação
import { ThemeProvider } from './contexts/ThemeContext'; 

// Importa os novos "cômodos" e o "menu"
import Sidebar from './components/common/Sidebar'; // Seu novo menu lateral
import MarketSphereSection from './components/sections/MarketSphereSection'; // Sua nova seção da esfera
import ZonaDeControle from './components/sections/ZonaDeControle'; // Sua Zona de Controle que já existia

// O componente principal App.jsx do seu Santuário
function App() {
  // Usamos um "estado" para saber qual seção (cômodo) está ativa no momento
  const [activeSection, setActiveSection] = useState('market-sphere'); // Começa mostrando a Esfera do Mercado

  // Esta função é chamada quando você clica em um botão no menu lateral
  const handleNavigate = (sectionId) => {
    setActiveSection(sectionId); // Muda a seção ativa
    window.location.hash = sectionId; // Opcional: atualiza o endereço na barra do navegador
  };

  // Este "efeito" (useEffect) garante que, se a página for carregada com um #hash na URL,
  // a seção correta seja mostrada.
  useEffect(() => {
    const initialHash = window.location.hash.substring(1);
    if (initialHash) {
      setActiveSection(initialHash);
    }
  }, []); // Só roda uma vez quando o aplicativo inicia

  return (
    // Aqui definimos o layout geral da sua aplicação com Tailwind CSS
    <div className="min-h-screen flex bg-gray-900 text-white font-sans">
      {/* O Menu Lateral (Sidebar) */}
      <Sidebar activeSection={activeSection} onNavigate={handleNavigate} />

      {/* A Área Principal do Conteúdo */}
      <main className="flex-grow ml-64 p-4"> {/* 'ml-64' empurra o conteúdo para a direita, para não ficar embaixo do menu */}
        {/* Aqui, mostramos a seção (cômodo) que está ativa no momento */}
        {activeSection === 'dashboard' && (
          <section id="dashboard" className="p-4">
            <h2 className="text-3xl font-bold mb-4">Dashboard</h2>
            <p>Conteúdo do Dashboard (você pode preencher depois).</p>
          </section>
        )}
        {activeSection === 'agents' && (
          <section id="agents" className="p-4">
            <h2 className="text-3xl font-bold mb-4">Gerenciamento de Agentes</h2>
            <p>Conteúdo da seção de Agentes (você pode preencher depois).</p>
          </section>
        )}
        {activeSection === 'deep-research' && (
          <section id="deep-research" className="p-4">
            <h2 className="text-3xl font-bold mb-4">Pesquisa Profunda</h2>
            <p>Conteúdo da seção de Pesquisa Profunda (você pode preencher depois).</p>
          </section>
        )}
        {activeSection === 'mind-maps' && (
          <section id="mind-maps" className="p-4">
            <h2 className="text-3xl font-bold mb-4">Mapas Mentais</h2>
            <p>Conteúdo da seção de Mapas Mentais (você pode preencher depois).</p>
          </section>
        )}
        {activeSection === 'market-sphere' && <MarketSphereSection />} {/* Mostra a Esfera do Mercado */}
        {activeSection === 'settings' && (
          <section id="settings" className="p-4">
            <h2 className="text-3xl font-bold mb-4">Configurações</h2>
            <p>Conteúdo da seção de Configurações (você pode preencher depois).</p>
          </section>
        )}
        {activeSection === 'error-diagnostics' && (
          <section id="error-diagnostics" className="p-4">
            <h2 className="text-3xl font-bold mb-4">Diagnóstico de Erros</h2>
            <p>Conteúdo da seção de Diagnóstico de Erros (você pode preencher depois).</p>
          </section>
        )}
        {activeSection === 'zona-de-controle' && <ZonaDeControle />} {/* Sua Zona de Controle */}
      </main>
    </div>
  );
}

// O componente App é envolvido pelo ThemeProvider para que todos os seus filhos
// tenham acesso ao contexto do tema. Isso é importante se a ZonaDeControle
// ou futuros componentes dependerem do tema.
export default function AppWithThemeProvider() {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}
