import React from 'react';
import { useTheme } from '../../contexts/ThemeContext'; // Importa o hook useTheme

function ThemeToggle() {
  const { setTheme, currentTheme } = useTheme(); // Obtém a função setTheme e o tema atual do contexto

  // Definição dos temas disponíveis
  const themes = [
    {
      name: 'Azul Cósmico',
      bubble: 'bg-blue-700',
      bgMain: 'bg-gradient-to-br from-blue-900 to-indigo-900',
      internalBg: 'rgba(255, 255, 255, 0.05)',
      text: 'text-gray-100',
      highlight: 'text-blue-400',
    },
    {
      name: 'Verde Esmeralda',
      bubble: 'bg-green-700',
      bgMain: 'bg-gradient-to-br from-green-900 to-teal-900',
      internalBg: 'rgba(255, 255, 255, 0.05)',
      text: 'text-gray-100',
      highlight: 'text-green-400',
    },
    {
      name: 'Roxo Místico',
      bubble: 'bg-purple-700',
      bgMain: 'bg-gradient-to-br from-purple-900 to-fuchsia-900',
      internalBg: 'rgba(255, 255, 255, 0.05)',
      text: 'text-gray-100',
      highlight: 'text-purple-400',
    },
    {
      name: 'Ouro Solar',
      bubble: 'bg-yellow-600',
      bgMain: 'bg-gradient-to-br from-yellow-800 to-orange-800',
      internalBg: 'rgba(255, 255, 255, 0.05)',
      text: 'text-gray-900', // Texto mais escuro para contraste com fundo claro
      highlight: 'text-yellow-200',
    },
  ];

  return (
    <section className="p-4 rounded-lg shadow-md w-full max-w-4xl" style={{ backgroundColor: currentTheme.internalBg }}>
      <h2 className="text-3xl font-bold text-white mb-6 text-center">Selecionar Tema</h2>
      <p className="text-gray-300 mb-8 text-center">
        Escolha um tema de cor para personalizar a aparência do seu Sanctuary.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        {themes.map((theme) => (
          <button
            key={theme.name}
            onClick={() => setTheme(theme)} // Chama setTheme do contexto
            className={`px-6 py-3 rounded-md font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg
                        ${theme.bubble} text-white`}
          >
            {theme.name}
          </button>
        ))}
      </div>
    </section>
  );
}

export default ThemeToggle;
