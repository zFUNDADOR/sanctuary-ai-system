import React, { useState } from 'react';

function VideosSection() {
  // Estado para a URL do vídeo
  const [videoUrl, setVideoUrl] = useState('');
  // Estado para a transcrição do vídeo
  const [transcription, setTranscription] = useState('');
  // Estado para armazenar os dados de análise do vídeo recebidos do backend
  const [videoAnalysisData, setVideoAnalysisData] = useState(null);
  // Estado para controlar o carregamento (requisição à API)
  const [isLoading, setIsLoading] = useState(false);
  // URL do backend para o endpoint de análise de vídeo
  const BACKEND_URL = '/api/analisar-video';

  // Dados simulados para sua galeria de vídeos (ainda sem backend real para carregar/salvar)
  const videos = [
    { id: 1, title: 'Introdução ao Desenvolvimento Web', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
    { id: 2, title: 'Desvendando React Hooks', url: 'https://vimeo.com/channels/staffpicks/295240409' },
    { id: 3, title: 'Primeiros Passos com Node.js', url: 'https://www.dailymotion.com/video/x2yydz' }
  ];

  // Função para lidar com a análise do vídeo via API
  const handleAnalyzeVideo = async () => {
    if (!videoUrl.trim() && !transcription.trim()) {
      alert("Por favor, forneça uma URL de vídeo ou uma transcrição para análise.");
      return;
    }

    setIsLoading(true); // Ativa o estado de carregamento

    try {
      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Envia a URL do vídeo E/OU a transcrição para o backend
        body: JSON.stringify({ videoUrl: videoUrl, transcription: transcription }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Resposta não JSON ou vazia.' }));
        throw new Error(errorData.error || `Erro do servidor: ${response.status}`);
      }

      const data = await response.json(); // Pega a resposta JSON do backend
      setVideoAnalysisData(data); // Define os dados recebidos para exibição

    } catch (error) {
      console.error("Erro ao analisar vídeo:", error);
      alert(`Erro ao analisar o vídeo: ${error.message}. Verifique o console para mais detalhes.`);
      setVideoAnalysisData(null); // Limpa dados em caso de erro
    } finally {
      setIsLoading(false); // Desativa o carregamento no final
    }
  };

  // Função para lidar com o upload de um novo vídeo (ainda sem backend real)
  const handleUploadNewVideo = () => {
    alert('Função "Upload de Novo Vídeo" ainda a ser implementada com backend real!');
    // Aqui você abriria um modal ou navegaria para uma interface de upload
  };


  return (
    <div className="p-5 max-w-4xl mx-auto"> {/* Usando classes Tailwind para padding, largura máxima e centralização */}
      <h2 className="text-xl md:text-2xl font-bold text-blue-300 mb-6 text-center">Seção de VÍDEOS</h2>
      <p className="text-gray-300 mb-8 text-center">
        Analise vídeos inserindo uma URL ou transcrevendo o conteúdo.
      </p>

      <div className="bg-gray-700 p-6 rounded-lg shadow-lg mb-8"> {/* Box para entrada de análise */}
        <h3 className="text-lg md:text-xl font-semibold text-white mb-4">Analisar Novo Vídeo</h3>

        {/* Campo para URL do Vídeo */}
        <div className="mb-4">
          <label htmlFor="videoUrl" className="block text-gray-300 text-sm font-bold mb-2">URL do Vídeo:</label>
          <input
            type="text"
            id="videoUrl"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="Ex: https://www.youtube.com/watch?v=exemplo"
            className="shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-800"
          />
        </div>

        {/* Campo para Transcrição do Vídeo */}
        <div className="mb-6">
          <label htmlFor="transcription" className="block text-gray-300 text-sm font-bold mb-2">Ou Transcrição do Conteúdo:</label>
          <textarea
            id="transcription"
            value={transcription}
            onChange={(e) => setTranscription(e.target.value)}
            placeholder="Cole a transcrição do vídeo aqui..."
            rows="6"
            className="shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-800 resize-y"
          ></textarea>
        </div>

        <button
          onClick={handleAnalyzeVideo}
          disabled={isLoading}
          className={`w-full py-2 px-4 rounded-md font-semibold transition-colors duration-300 ${
            isLoading ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {isLoading ? 'Analisando...' : 'Analisar Vídeo'}
        </button>
      </div>

      {/* Exibição dos Resultados da Análise de Vídeo */}
      {videoAnalysisData && (
        <div className="bg-gray-700 p-6 rounded-lg shadow-lg mt-8">
          <h3 className="text-lg md:text-xl font-semibold text-blue-300 mb-4">Resultados da Análise:</h3>
          <div className="text-gray-300">
            <p className="mb-2"><span className="font-bold">Título:</span> {videoAnalysisData.title}</p>
            <p className="mb-2"><span className="font-bold">Duração:</span> {videoAnalysisData.duration}</p>
            <p className="mb-2"><span className="font-bold">Sentimento:</span> {videoAnalysisData.sentiment}</p>
            <p className="mb-2"><span className="font-bold">Palavras-chave:</span> {videoAnalysisData.keywords.join(', ')}</p>
            <p className="font-bold mt-4">Principais Destaques:</p>
            <ul className="list-disc list-inside pl-4">
              {videoAnalysisData.keyHighlights.map((highlight, index) => (
                <li key={index} className="text-gray-300">{highlight}</li>
              ))}
            </ul>
          </div>
          <p className="text-xs text-gray-400 mt-6">*Dados gerados pelo backend Python (simulados).</p>
        </div>
      )}

      {/* Sua Galeria de Vídeos (mantida do código original, com classes Tailwind) */}
      <div className="bg-gray-700 p-6 rounded-lg shadow-lg mt-8">
        <h3 className="text-lg md:text-xl font-semibold text-white mb-4">Sua Galeria de Vídeos</h3>
        {videos.length > 0 ? (
          <ul className="list-none p-0"> {/* Removendo estilos inline */}
            {videos.map(video => (
              <li key={video.id} className="mb-2"> {/* Removendo estilos inline */}
                <a 
                  href={video.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-400 hover:underline" // Usando classes Tailwind para link 
                >
                  {video.title}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-300">Nenhum vídeo adicionado ainda.</p>
        )}
        <button
          onClick={handleUploadNewVideo}
          className="mt-4 py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-md font-semibold transition-colors duration-300"
        >
          Upload de Novo Vídeo
        </button>
      </div>
    </div>
  );
}

export default VideosSection;
