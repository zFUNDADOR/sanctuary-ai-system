import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import SeoSection from './SeoSection'; // Importa a nova seção de SEO
import VideosSection from './VideosSection'; // Importa a nova seção de Vídeos
import MindMapSection from './MindMapSection'; // Importa a nova seção de Mapa Mental

function VirgoAIAssistant({ addDebugMessage }) {
  const { currentTheme } = useTheme();
  const [dataType, setDataType] = useState('text'); // 'text' ou 'json'
  const [inputData, setInputData] = useState('');
  const [analysisResult, setAnalysisResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeSubSection, setActiveSubSection] = useState('data-analysis'); // Nova estado para sub-seções

  const handleAnalyzeData = async () => {
    if (!inputData.trim()) {
      setAnalysisResult('Por favor, insira dados para análise.');
      addDebugMessage('Tentativa de análise com dados vazios.', 'warn');
      return;
    }

    setIsLoading(true);
    setAnalysisResult('Analisando dados...');
    addDebugMessage(`Iniciando análise de dados (${dataType})...`, 'info');

    try {
      // Simulação de análise de dados
      const response = await new Promise(resolve => setTimeout(() => {
        let result = '';
        if (dataType === 'text') {
          const words = inputData.split(/\s+/).filter(Boolean);
          const wordCount = words.length;
          const uniqueWords = new Set(words).size;
          result = `Análise de Texto:\nPalavras: ${wordCount}\nPalavras Únicas: ${uniqueWords}`;
        } else if (dataType === 'json') {
          try {
            const parsedData = JSON.parse(inputData);
            result = `Análise JSON:\nTipo: ${typeof parsedData}\nChaves Principais: ${Object.keys(parsedData).join(', ')}`;
          } catch (e) {
            result = `Erro: JSON inválido. ${e.message}`;
            addDebugMessage(`JSON inválido: ${e.message}`, 'error');
          }
        }
        resolve(result);
      }, 2000));

      setAnalysisResult(response);
      addDebugMessage('Análise de dados concluída com sucesso.', 'success');
    } catch (error) {
      setAnalysisResult('Ocorreu um erro na análise.');
      addDebugMessage(`Erro na análise de dados: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrepareForLLM = async () => {
    if (!inputData.trim()) {
      setAnalysisResult('Por favor, insira dados para preparar para o LLM.');
      addDebugMessage('Tentativa de preparação LLM com dados vazios.', 'warn');
      return;
    }

    setIsLoading(true);
    setAnalysisResult('Preparando dados para LLM...');
    addDebugMessage('Iniciando preparação de dados para LLM...', 'info');

    try {
      // Simulação de preparação para LLM
      const processedData = `[PROCESSADO PARA LLM]: ${inputData.substring(0, 100)}...`; // Exemplo simples
      setAnalysisResult(`Dados preparados para LLM:\n${processedData}`);
      addDebugMessage('Dados preparados para LLM com sucesso.', 'success');
    } catch (error) {
      setAnalysisResult('Ocorreu um erro na preparação.');
      addDebugMessage(`Erro na preparação para LLM: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="p-8 rounded-xl shadow-2xl text-center max-w-5xl w-full mx-auto my-8 border border-gray-700" style={{ backgroundColor: currentTheme.internalBg }}>
      <h2 className="text-4xl font-extrabold text-white mb-4">Virgem: O Analista e Otimizador de Precisão</h2>
      <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
        A IA Virgem é especialista em análise meticulosa de dados, reconhecimento de padrões e otimização de processos. Ela atua localmente para refinar sua compreensão e sugerir melhorias.
      </p>

      {/* Navegação entre sub-seções */}
      <div className="flex justify-center space-x-4 mb-8">
        <button
          onClick={() => setActiveSubSection('data-analysis')}
          className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${activeSubSection === 'data-analysis' ? currentTheme.bubble : 'bg-gray-700 hover:bg-gray-600'} text-white shadow-md`}
        >
          Análise de Dados
        </button>
        <button
          onClick={() => setActiveSubSection('seo-optimization')}
          className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${activeSubSection === 'seo-optimization' ? currentTheme.bubble : 'bg-gray-700 hover:bg-gray-600'} text-white shadow-md`}
        >
          Otimização SEO
        </button>
        <button
          onClick={() => setActiveSubSection('video-ideas')}
          className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${activeSubSection === 'video-ideas' ? currentTheme.bubble : 'bg-gray-700 hover:bg-gray-600'} text-white shadow-md`}
        >
          Ideias de Vídeos
        </button>
        <button
          onClick={() => setActiveSubSection('mind-map')}
          className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${activeSubSection === 'mind-map' ? currentTheme.bubble : 'bg-gray-700 hover:bg-gray-600'} text-white shadow-md`}
        >
          Mapa Mental
        </button>
      </div>

      {/* Conteúdo das sub-seções */}
      {activeSubSection === 'data-analysis' && (
        <>
          <section className="p-6 rounded-lg shadow-md mb-6" style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}>
            <h3 className="text-2xl font-bold text-white mb-4">Análise e Otimização de Dados Locais</h3>
            <p className="text-gray-300 mb-4">
              Cole ou digite seus dados textuais (relatórios, observações, logs) para que a Virgem os analise localmente.
            </p>
            <div className="flex justify-center mb-4">
              <button
                onClick={() => setDataType('text')}
                className={`px-4 py-2 rounded-l-md font-semibold ${dataType === 'text' ? currentTheme.bubble : 'bg-gray-600 hover:bg-gray-500'} text-white transition duration-300`}
              >
                Texto
              </button>
              <button
                onClick={() => setDataType('json')}
                className={`px-4 py-2 rounded-r-md font-semibold ${dataType === 'json' ? currentTheme.bubble : 'bg-gray-600 hover:bg-gray-500'} text-white transition duration-300`}
              >
                JSON
              </button>
            </div>
            <textarea
              className="w-full p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:ring-blue-500 focus:border-blue-500 mb-4 h-40"
              placeholder={`Cole ou digite seus dados ${dataType === 'text' ? 'de texto' : 'JSON'} para análise...`}
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
            ></textarea>
            <button
              onClick={handleAnalyzeData}
              className={`w-full py-3 rounded-md font-semibold transition duration-300 ${isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
              disabled={isLoading}
            >
              {isLoading ? 'Analisando...' : 'Analisar Dados'}
            </button>
            {analysisResult && (
              <div className="mt-4 p-3 bg-gray-800 rounded-md text-gray-200 whitespace-pre-wrap">
                {analysisResult}
              </div>
            )}
          </section>

          <section className="p-6 rounded-lg shadow-md" style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}>
            <h3 className="text-2xl font-bold text-white mb-4">Preparar Dados para Alimentar o Núcleo de Consciência (LLM)</h3>
            <p className="text-gray-300 mb-4">
              Prepare e simule o envio de dados que seriam usados para refinar o Núcleo de Consciência (LLM). O processamento ocorre localmente.
            </p>
            <textarea
              className="w-full p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:ring-purple-500 focus:border-purple-500 mb-4 h-40"
              placeholder="Cole dados para refinar o LLM (simulação local)..."
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
            ></textarea>
            <button
              onClick={handlePrepareForLLM}
              className={`w-full py-3 rounded-md font-semibold transition duration-300 ${isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'} text-white`}
              disabled={isLoading}
            >
              {isLoading ? 'Preparando...' : 'Preparar e Simular Envio'}
            </button>
          </section>
        </>
      )}

      {activeSubSection === 'seo-optimization' && <SeoSection addDebugMessage={addDebugMessage} />}
      {activeSubSection === 'video-ideas' && <VideosSection addDebugMessage={addDebugMessage} />}
      {activeSubSection === 'mind-map' && <MindMapSection addDebugMessage={addDebugMessage} />}

      <div className="mt-8 p-6 text-center text-gray-300 border-t border-gray-700 pt-6">
        <p className="text-sm">
          "A análise é a ponte entre o desejo e a realização." - Virgem AI
        </p>
      </div>
    </section>
  );
}

export default VirgoAIAssistant;
