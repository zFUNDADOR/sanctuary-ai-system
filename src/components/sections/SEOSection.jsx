// src/components/sections/SeoSection.jsx
import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

function SeoSection({ addDebugMessage }) {
  const { currentTheme } = useTheme();
  const [seoText, setSeoText] = useState('');
  const [seoResult, setSeoResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const analyzeSeo = async () => {
    if (!seoText.trim()) {
      addDebugMessage('Por favor, insira texto para análise de SEO.', 'warn');
      setSeoResult('Por favor, insira texto para análise de SEO.');
      return;
    }
    setIsLoading(true);
    setSeoResult('Analisando SEO...');
    addDebugMessage('Iniciando análise de SEO...', 'info');

    try {
      // Simulação de chamada de API para análise de SEO
      // Em um cenário real, você faria uma chamada fetch para um backend ou API externa
      const response = await new Promise(resolve => setTimeout(() => {
        const keywords = seoText.toLowerCase().split(/\s+/).filter(word => word.length > 3);
        const uniqueKeywords = [...new Set(keywords)];
        const keywordCount = uniqueKeywords.length;
        const readabilityScore = seoText.length > 100 ? 'Boa' : 'Média';
        const suggestions = [];
        if (keywordCount < 5) suggestions.push('Considere adicionar mais palavras-chave relevantes.');
        if (seoText.length < 200) suggestions.push('O conteúdo é um pouco curto para SEO, considere expandir.');

        resolve({
          status: 'success',
          data: {
            keywords: uniqueKeywords.slice(0, 5).join(', '),
            readability: readabilityScore,
            suggestions: suggestions.join(' ') || 'Nenhuma sugestão imediata.',
          }
        });
      }, 1500));

      if (response.status === 'success') {
        setSeoResult(`Análise SEO Concluída:\nPalavras-chave: ${response.data.keywords}\nLegibilidade: ${response.data.readability}\nSugestões: ${response.data.suggestions}`);
        addDebugMessage('Análise de SEO concluída com sucesso.', 'success');
      } else {
        setSeoResult('Erro ao analisar SEO. Tente novamente.');
        addDebugMessage('Erro na análise de SEO.', 'error');
      }
    } catch (error) {
      setSeoResult('Ocorreu um erro inesperado na análise de SEO.');
      addDebugMessage(`Erro inesperado na análise de SEO: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="p-6 rounded-lg shadow-md w-full max-w-4xl mx-auto" style={{ backgroundColor: currentTheme.internalBg }}>
      <h3 className="text-2xl font-bold text-white mb-4">Otimização de SEO</h3>
      <p className="text-gray-300 mb-4">Cole seu conteúdo para análise de palavras-chave e legibilidade.</p>
      <textarea
        className="w-full p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:ring-blue-500 focus:border-blue-500 mb-4 h-32"
        placeholder="Cole seu texto aqui para análise de SEO..."
        value={seoText}
        onChange={(e) => setSeoText(e.target.value)}
      ></textarea>
      <button
        onClick={analyzeSeo}
        className={`w-full py-3 rounded-md font-semibold transition duration-300 ${isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
        disabled={isLoading}
      >
        {isLoading ? 'Analisando...' : 'Analisar SEO'}
      </button>
      {seoResult && (
        <div className="mt-4 p-3 bg-gray-800 rounded-md text-gray-200 whitespace-pre-wrap">
          {seoResult}
        </div>
      )}
    </section>
  );
}

export default SeoSection;
