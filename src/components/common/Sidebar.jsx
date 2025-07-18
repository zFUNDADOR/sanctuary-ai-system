// src/components/common/Sidebar.jsx
import React from 'react';
// Importamos ícones para os botões do menu
import { Home, Search, Globe, Settings, AlertTriangle, Cpu, Brain, Code, User } from 'lucide-react'; 

// Este é o componente do menu lateral
export default function Sidebar({ activeSection, onNavigate }) {
  // Lista dos itens do seu menu
  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: Home },
    { id: 'agents', name: 'Agentes', icon: Cpu },
    { id: 'deep-research', name: 'Pesquisa Profunda', icon: Search },
    { id: 'mind-maps', name: 'Mapas Mentais', icon: Brain },
    { id: 'market-sphere', name: 'Esfera do Mercado', icon: Globe }, // A nova seção da esfera
    { id: 'settings', name: 'Configurações', icon: Settings },
    { id: 'error-diagnostics', name: 'Diagnóstico de Erros', icon: AlertTriangle },
    { id: 'zona-de-controle', name: 'Zona de Controle', icon: Code }, // Sua Zona de Controle atual
  ];

  return (
    // Aqui definimos o estilo do menu lateral com Tailwind CSS
    <nav className="w-64 bg-gradient-to-br from-blue-600 to-green-500 text-white min-h-screen p-4 shadow-lg flex flex-col justify-between">
      {/* Parte de cima do menu: Logo do Santuário */}
      <div className="flex items-center mb-6 p-2 rounded-lg bg-white bg-opacity-10">
        <img src="https://images.websim.ai/avatar/multiagent-ai" alt="Santuário AI" className="w-10 h-10 rounded-full mr-3" />
        <span className="font-bold text-lg">Santuário AI</span>
      </div>

      {/* Seção do perfil do usuário */}
      <div className="flex items-center mb-8 p-2 rounded-lg bg-white bg-opacity-10">
        <img id="user-avatar" src="https://placehold.co/50x50/cccccc/ffffff?text=User" alt="Avatar do Usuário" className="w-12 h-12 rounded-full mr-4" />
        <div className="flex flex-col">
          <span id="username" className="font-semibold">Visitante</span>
          <small id="user-role" className="text-sm opacity-80">Convidado</small>
        </div>
      </div>

      {/* Lista dos botões de navegação */}
      <ul className="flex-grow space-y-2">
        {navItems.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => onNavigate(item.id)} // Quando clica, muda a seção
              className={`flex items-center w-full p-3 rounded-lg text-left transition-colors duration-200 ${
                activeSection === item.id ? 'bg-white bg-opacity-20 shadow-md' : 'hover:bg-white hover:bg-opacity-10'
              }`}
            >
              <item.icon size={20} className="mr-3" /> {/* O ícone do botão */}
              <span className="font-medium">{item.name}</span> {/* O nome do botão */}
            </button>
          </li>
        ))}
      </ul>

      {/* Rodapé do menu: Botão de Tema (Modo Escuro) */}
      <div className="mt-8 p-2">
        <button
          id="theme-toggle"
          className="flex items-center w-full p-3 rounded-lg text-left transition-colors duration-200 hover:bg-white hover:bg-opacity-10"
        >
          <Globe size={20} className="mr-3" /> {/* Ícone placeholder, será atualizado pelo ThemeManager */}
          <span className="font-medium">Modo Escuro</span> {/* Texto, será atualizado pelo ThemeManager */}
        </button>
      </div>
    </nav>
  );
}
