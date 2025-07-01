// src/components/sections/VideosSection.jsx
import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

function VideosSection({ addDebugMessage }) {
  const { currentTheme } = useTheme();
  const [videoTopic, setVideoTopic] = useState('');
  const [videoIdeas, setVideoIdeas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateVideoIdeas = async () => {
    if (!videoTopic.trim()) {
      addDebugMessage('Por favor, insira um tópico para gerar ideias de vídeo.', 'warn');
      setVideoIdeas(['Por favor, insira um tópico para gerar ideias de vídeo.']);
      return;
    }
    setIsLoading(true);
    setVideoIdeas([]);
    addDebugMessage('Gerando ideias de vídeo...', 'info');

    try {
      // Simulação de chamada de API para geração de ideias de vídeo
      const response = await new Promise(resolve => setTimeout(() => {
        const ideas = [
          `Tutorial completo sobre "${videoTopic}" para iniciantes.`,
          `5 dicas avançadas para dominar "${videoTopic}".`,
          `Os maiores erros ao lidar com "${videoTopic}" e como evitá-los.`,
          `Entrevista com um especialista em "${videoTopic}".`,
          `Desvendando os mitos sobre "${videoTopic}".`
        ];
        resolve({
          status: 'success',
          data: ideas.slice(0, Math.floor(Math.random() * 3) + 2) // Retorna 2 a 4 ideias
        });
      }, 2000));

      if (response.status === 'success' && response.data.length > 0) {
        setVideoIdeas(response.data);
        addDebugMessage('Ideias de vídeo geradas com sucesso.', 'success');
      } else {
        setVideoIdeas(['Não foi possível gerar ideias de vídeo para este tópico.']);
        addDebugMessage('Falha ao gerar ideias de vídeo.', 'error');
      }
    } catch (error) {
      setVideoIdeas(['Ocorreu um erro inesperado ao gerar ideias de vídeo.']);
      addDebugMessage(`Erro inesperado ao gerar ideias de vídeo: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="p-6 rounded-lg shadow-md w-full max-w-4xl mx-auto mt-6" style={{ backgroundColor: currentTheme.internalBg }}>
      <h3 className="text-2xl font-bold text-white mb-4">Geração de Ideias para Vídeos</h3>
      <p className="text-gray-300 mb-4">Insira um tópico e receba sugestões de conteúdo para seus vídeos.</p>
      <input
        type="text"
        className="w-full p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:ring-blue-500 focus:border-blue-500 mb-4"
        placeholder="Ex: Marketing Digital para Pequenas Empresas"
        value={videoTopic}
        onChange={(e) => setVideoTopic(e.target.value)}
      />
      <button
        onClick={generateVideoIdeas}
        className={`w-full py-3 rounded-md font-semibold transition duration-300 ${isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} text-white`}
        disabled={isLoading}
      >
        {isLoading ? 'Gerando...' : 'Gerar Ideias'}
      </button>
      {videoIdeas.length > 0 && (
        <div className="mt-4 p-3 bg-gray-800 rounded-md text-gray-200">
          <p className="font-semibold mb-2">Ideias Geradas:</p>
          <ul className="list-disc list-inside">
            {videoIdeas.map((idea, index) => (
              <li key={index}>{idea}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

export default VideosSection;
