// src/components/sections/LeoContentCreator.jsx
import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

function LeoContentCreator({ addDebugMessage }) {
  const { currentTheme } = useTheme();
  const [topic, setTopic] = useState('');
  const [contentType, setContentType] = useState('text'); // 'text', 'script', 'idea'
  const [generatedContent, setGeneratedContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generateContent = async () => {
    if (!topic.trim()) {
      setGeneratedContent('Por favor, insira um tópico para gerar conteúdo.');
      addDebugMessage('Tentativa de geração com tópico vazio.', 'warn');
      return;
    }

    setIsLoading(true);
    setGeneratedContent('Gerando conteúdo...');
    addDebugMessage(`Iniciando geração de conteúdo (${contentType}) para o tópico: ${topic}`, 'info');

    try {
      // Simulação de chamada à API Gemini para geração de conteúdo
      const prompt = `Gere um ${contentType === 'text' ? 'texto descritivo' : contentType === 'script' ? 'roteiro curto' : 'lista de ideias'} sobre "${topic}".`;
      let chatHistory = [];
      chatHistory.push({ role: "user", parts: [{ text: prompt }] });
      const payload = { contents: chatHistory };
      const apiKey = ""; // Deixe vazio para o ambiente Canvas
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        const text = result.candidates[0].content.parts[0].text;
        setGeneratedContent(text);
        addDebugMessage('Conteúdo gerado com sucesso pelo Gemini AI.', 'success');
      } else {
        setGeneratedContent('Não foi possível gerar conteúdo para este tópico.');
        addDebugMessage('Resposta inesperada da API Gemini.', 'error');
      }
    } catch (error) {
      setGeneratedContent(`Ocorreu um erro ao gerar conteúdo: ${error.message}`);
      addDebugMessage(`Erro ao chamar API Gemini para geração de conteúdo: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="p-8 rounded-xl shadow-2xl text-center max-w-5xl w-full mx-auto my-8 border border-gray-700" style={{ backgroundColor: currentTheme.internalBg }}>
      <h2 className="text-4xl font-extrabold text-white mb-4">Leão: O Criador de Conteúdo</h2>
      <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
        Explore a criatividade do módulo Leão para gerar textos, roteiros e ideias originais para seus projetos.
      </p>

      <div className="mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">Tópico para Geração:</h3>
        <input
          type="text"
          className="w-full p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:ring-blue-500 focus:border-blue-500 mb-4"
          placeholder="Ex: A importância da IA na educação"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
      </div>

      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={() => setContentType('text')}
          className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${contentType === 'text' ? currentTheme.bubble : 'bg-gray-700 hover:bg-gray-600'} text-white shadow-md`}
        >
          Texto
        </button>
        <button
          onClick={() => setContentType('script')}
          className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${contentType === 'script' ? currentTheme.bubble : 'bg-gray-700 hover:bg-gray-600'} text-white shadow-md`}
        >
          Roteiro
        </button>
        <button
          onClick={() => setContentType('idea')}
          className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${contentType === 'idea' ? currentTheme.bubble : 'bg-gray-700 hover:bg-gray-600'} text-white shadow-md`}
        >
          Ideias
        </button>
      </div>

      <button
        onClick={generateContent}
        className={`w-full py-3 rounded-md font-semibold transition duration-300 ${isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700'} text-white`}
        disabled={isLoading}
      >
        {isLoading ? 'Gerando...' : 'Gerar Conteúdo'}
      </button>

      {generatedContent && (
        <div className="mt-6 p-4 bg-gray-800 rounded-md text-gray-200 text-left whitespace-pre-wrap">
          <h3 className="text-xl font-bold text-white mb-2">Conteúdo Gerado:</h3>
          {generatedContent}
        </div>
      )}

      <div className="mt-8 p-6 text-center text-gray-300 border-t border-gray-700 pt-6">
        <p className="text-sm">
          "A criatividade é a inteligência se divertindo." - Leão AI
        </p>
      </div>
    </section>
  );
}

export default LeoContentCreator;
