// src/components/sections/MindMapSection.jsx
import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

function MindMapSection({ addDebugMessage }) {
  const { currentTheme } = useTheme();
  const [mindMapTopic, setMindMapTopic] = useState('');
  const [mindMapStructure, setMindMapStructure] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generateMindMap = async () => {
    if (!mindMapTopic.trim()) {
      addDebugMessage('Por favor, insira um tópico para gerar o mapa mental.', 'warn');
      setMindMapStructure('Por favor, insira um tópico para gerar o mapa mental.');
      return;
    }
    setIsLoading(true);
    setMindMapStructure('Gerando estrutura do mapa mental...');
    addDebugMessage('Iniciando geração de mapa mental...', 'info');

    try {
      // Simulação de chamada de API para geração de mapa mental
      const response = await new Promise(resolve => setTimeout(() => {
        const structure = `Tópico Principal: ${mindMapTopic}\n\n` +
                          `  - Subtópico 1: Introdução e Definição\n` +
                          `    - Conceitos Chave\n` +
                          `    - História\n\n` +
                          `  - Subtópico 2: Aplicações\n` +
                          `    - Exemplos Práticos\n` +
                          `    - Casos de Uso\n\n` +
                          `  - Subtópico 3: Desafios e Soluções\n` +
                          `    - Problemas Comuns\n` +
                          `    - Estratégias de Resolução\n\n` +
                          `  - Subtópico 4: Futuro e Tendências\n` +
                          `    - Inovações\n` +
                          `    - Impacto\n`;
        resolve({
          status: 'success',
          data: structure
        });
      }, 2500));

      if (response.status === 'success') {
        setMindMapStructure(response.data);
        addDebugMessage('Mapa mental gerado com sucesso.', 'success');
      } else {
        setMindMapStructure('Erro ao gerar mapa mental. Tente novamente.');
        addDebugMessage('Erro na geração do mapa mental.', 'error');
      }
    } catch (error) {
      setMindMapStructure('Ocorreu um erro inesperado na geração do mapa mental.');
      addDebugMessage(`Erro inesperado na geração do mapa mental: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="p-6 rounded-lg shadow-md w-full max-w-4xl mx-auto mt-6" style={{ backgroundColor: currentTheme.internalBg }}>
      <h3 className="text-2xl font-bold text-white mb-4">Geração de Mapa Mental</h3>
      <p className="text-gray-300 mb-4">Insira um tópico para gerar uma estrutura de mapa mental detalhada.</p>
      <input
        type="text"
        className="w-full p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:ring-blue-500 focus:border-blue-500 mb-4"
        placeholder="Ex: Inteligência Artificial"
        value={mindMapTopic}
        onChange={(e) => setMindMapTopic(e.target.value)}
      />
      <button
        onClick={generateMindMap}
        className={`w-full py-3 rounded-md font-semibold transition duration-300 ${isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'} text-white`}
        disabled={isLoading}
      >
        {isLoading ? 'Gerando...' : 'Gerar Mapa Mental'}
      </button>
      {mindMapStructure && (
        <div className="mt-4 p-3 bg-gray-800 rounded-md text-gray-200 whitespace-pre-wrap">
          {mindMapStructure}
        </div>
      )}
    </section>
  );
}

export default MindMapSection;
