import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

function GeminiAIAssistant({ addDebugMessage }) {
  const { currentTheme } = useTheme();
  const [userObjective, setUserObjective] = useState('');
  const [workflowSuggestions, setWorkflowSuggestions] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [geminiError, setGeminiError] = useState('');

  // Simulação de "núcleos" locais para prompts
  const localNuclei = {
    geminiWorkflowPrompt: `Você é um assistente de IA focado em planejamento e workflow, inspirado na adaptabilidade e comunicação do signo de Gêmeos.
    Sua tarefa é analisar um objetivo fornecido pelo usuário e sugerir uma sequência lógica de passos, indicando qual "Módulo do Santuário AI" (Virgem para análise de dados, Leão para criação de conteúdo, Aquário para engenharia de sistemas, ou Gêmeos para interação/planejamento) seria mais adequado para cada passo.
    Seja conciso, use marcadores e foque em um plano de ação claro.
    
    Exemplo de resposta:
    - Passo 1: Definir nicho (Módulo Virgem)
    - Passo 2: Gerar ideias de conteúdo (Módulo Leão)
    - Passo 3: Criar página de vendas (Módulo Leão)
    - Passo 4: Otimizar sistema de vendas (Módulo Aquário)
    
    Agora, por favor, me ajude a planejar o seguinte objetivo:`,
  };

  const handleGenerateWorkflow = async () => {
    if (!userObjective.trim()) {
      setGeminiError('Por favor, insira seu objetivo para que Gêmeos possa planejar o workflow.');
      addDebugMessage('Gêmeos: Objetivo vazio para planejamento de workflow.', 'error');
      return;
    }

    setIsGenerating(true);
    setWorkflowSuggestions('');
    setGeminiError('');
    addDebugMessage(`Gêmeos: Iniciando planejamento de workflow para objetivo: "${userObjective.substring(0, 50)}..."`, 'info');

    try {
      const prompt = `${localNuclei.geminiWorkflowPrompt}\n\nObjetivo: ${userObjective}`;
      let chatHistory = [];
      chatHistory.push({ role: "user", parts: [{ text: prompt }] });
      const payload = { contents: chatHistory };
      const apiKey = ""; // A API Key será fornecida pelo ambiente Canvas em tempo de execução
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Erro na API Gemini: ${errorData.error.message || response.statusText}`);
      }

      const result = await response.json();

      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        const text = result.candidates[0].content.parts[0].text;
        setWorkflowSuggestions(text);
        addDebugMessage('Gêmeos: Workflow gerado com sucesso pela Gemini API.', 'success');
      } else {
        setGeminiError('Resposta inesperada da API Gemini. Tente novamente.');
        addDebugMessage('Gêmeos: Resposta inesperada da Gemini API.', 'error');
      }
    } catch (error) {
      setGeminiError(`Falha no planejamento: ${error.message}`);
      addDebugMessage(`Gêmeos: Erro no planejamento de workflow: ${error.message}`, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section className="p-8 rounded-xl shadow-2xl text-center max-w-5xl w-full mx-auto my-8 border border-gray-700" style={{ backgroundColor: currentTheme.internalBg }}>
      <h2 className="text-4xl font-extrabold text-white mb-4">Gêmeos: Guia de Workflow & Interação</h2>
      <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
        Descreva seu objetivo e Gêmeos irá sugerir um fluxo de trabalho, indicando quais módulos do Santuário AI usar para alcançá-lo.
      </p>

      <div className="mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">Seu Objetivo:</h3>
        <textarea
          id="user-objective-input"
          value={userObjective}
          onChange={(e) => setUserObjective(e.target.value)}
          placeholder="Ex: 'Preciso criar um blog de culinária e monetizá-lo.' ou 'Quero otimizar meu processo de estudo para exames.'"
          rows="6"
          className="w-full p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:ring-green-500 focus:border-green-500"
        ></textarea>
      </div>

      <button
        id="generate-workflow-button"
        onClick={handleGenerateWorkflow}
        disabled={isGenerating}
        className={`w-full py-3 rounded-md font-semibold transition-colors duration-300 
                    ${isGenerating ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} text-white`}
      >
        {isGenerating ? 'Planejando...' : 'Gerar Workflow ✨'}
      </button>

      {geminiError && (
        <div className="mt-4 p-3 bg-red-800 rounded-md text-red-100 text-sm">
          Erro: {geminiError}
        </div>
      )}

      {workflowSuggestions && (
        <div className="mt-6 p-4 bg-gray-900 rounded-lg border border-gray-600 max-h-60 overflow-y-auto">
          <h4 className="text-lg font-semibold text-blue-300 mb-2">Sugestão de Workflow:</h4>
          <pre className="whitespace-pre-wrap break-words text-sm text-gray-200">{workflowSuggestions}</pre>
        </div>
      )}

      <div className="mt-8 p-6 text-center text-gray-300 border-t border-gray-700 pt-6">
        <p className="text-sm">
          "A comunicação eficaz é a chave para o sucesso." - Gêmeos AI
        </p>
      </div>
    </section>
  );
}

export default GeminiAIAssistant;
