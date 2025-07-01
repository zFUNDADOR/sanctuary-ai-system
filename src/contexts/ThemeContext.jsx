import React, { createContext, useContext, useState, useMemo } from 'react';

// 1. Criação do Contexto
const ThemeContext = createContext(null);

// 2. Provedor do Contexto
export function ThemeProvider({ children }) {
  const [currentTheme, setCurrentTheme] = useState({
    name: 'Azul Cósmico',
    bubble: 'bg-blue-700',
    bgMain: 'bg-gradient-to-br from-blue-900 to-indigo-900',
    internalBg: 'rgba(255, 255, 255, 0.05)',
    text: 'text-gray-100',
    highlight: 'text-blue-400',
  });

  const [currentWallpaper, setCurrentWallpaper] = useState('https://images.unsplash.com/photo-1536514498073-50e69d39c6b7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'); // Wallpaper padrão
  
  // Novo estado para controlar a "view" atual da aplicação (ex: 'main', 'zodiac-theme')
  const [currentView, setCurrentView] = useState('main'); 

  // Função para atualizar o tema
  const setTheme = (newTheme) => {
    setCurrentTheme(newTheme);
  };

  // O valor que será fornecido para os consumidores do contexto
  const value = useMemo(() => ({
    currentTheme,
    setTheme,
    currentWallpaper,
    setCurrentWallpaper,
    currentView,        // Adiciona currentView ao contexto
    setCurrentView,     // Adiciona setCurrentView ao contexto
  }), [currentTheme, currentWallpaper, currentView]); // Adiciona currentView às dependências

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// 3. Hook Personalizado para Consumir o Contexto
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
