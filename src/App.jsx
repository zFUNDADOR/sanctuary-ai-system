import React, { useState } from 'react';

// O componente principal App.jsx do seu Sanctuary
function App() {
  const [activeTab, setActiveTab] = useState('seo'); // Estado para controlar a aba ativa

  // Estado para a cor dos "balões" ou temas
  const [balloonColor, setBalloonColor] = useState('bg-blue-500'); 

  // Função para mudar a cor dos balões
  const changeBalloonColor = (color) => {
    setBalloonColor(color);
  };

  // Cores disponíveis para os balões/temas
  const colors = [
    'bg-blue-500', 
    'bg-purple-500', 
    'bg-green-500', 
    'bg-red-500', 
    'bg-yellow-500',
    'bg-indigo-500'
  ];

  // Estado para o URL do wallpaper
  const [wallpaperUrl, setWallpaperUrl] = useState('');

  // Função para mudar o wallpaper (simulada)
  const changeWallpaper = () => {
    // Exemplo: usar um placeholder ou uma URL de imagem de teste
    const newWallpaper = wallpaperUrl ? '' : 'https://placehold.co/1920x1080/000000/FFFFFF/png?text=Wallpaper+Sanctuary';
    setWallpaperUrl(newWallpaper);
  };

  return (
    <div className={`min-h-screen bg-gray-900 text-gray-100 font-inter ${wallpaperUrl ? 'bg-cover bg-center' : ''}`} style={{ backgroundImage: wallpaperUrl ? `url(${wallpaperUrl})` : 'none' }}>
      <div className="container mx-auto p-4">
        <header className="flex flex-col md:flex-row items-center justify-between bg-gray-800 p-4 rounded-lg shadow-lg mb-6">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 mb-4 md:mb-0">
            Sanctuary AI System
          </h1>
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('seo')}
              className={`px-6 py-3 rounded-full text-lg font-semibold transition-all duration-300 ${
                activeTab === 'seo' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-blue-500 hover:text-white'
              }`}
            >
              SEO
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`px-6 py-3 rounded-full text-lg font-semibold transition-all duration-300 ${
                activeTab === 'videos' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-blue-500 hover:text-white'
              }`}
            >
              VÍDEOS
            </button>
            <button
              onClick={() => setActiveTab('mind-map')} // Adicionando a aba de Mapa Mental
              className={`px-6 py-3 rounded-full text-lg font-semibold transition-all duration-300 ${
                activeTab === 'mind-map' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-blue-500 hover:text-white'
              }`}
            >
              MAPA MENTAL
            </button>
          </div>
        </header>

        <div className="flex flex-wrap items-center justify-center bg-gray-800 p-4 rounded-lg shadow-lg mb-6">
          <span className="mr-4 text-lg font-semibold text-gray-300">Cor dos Balões:</span>
          {colors.map((color, index) => (
            <button
              key={index}
              className={`w-8 h-8 rounded-full mx-1 ${color} border-2 ${balloonColor === color ? 'border-white' : 'border-transparent'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition-all duration-200`}
              onClick={() => changeBalloonColor(color)}
            ></button>
          ))}
          <button
            onClick={changeWallpaper}
            className="ml-6 px-4 py-2 rounded-full text-md font-semibold bg-gray-700 text-gray-300 hover:bg-blue-500 hover:text-white transition-all duration-300"
          >
            Wallpaper
          </button>
        </div>

        <main className="bg-gray-800 p-6 rounded-lg shadow-lg">
          {activeTab === 'seo' && (
            <section>
              <h2 className="text-3xl font-bold text-white mb-4">Conteúdo de SEO</h2>
              <p className="text-gray-300 mb-6">
                Aqui você pode exibir métricas, análises de palavras-chave e otimizações de SEO.
              </p>
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-3">
                  Análise de Conteúdo SEO com Infográficos
                </h3>
                <p className="text-gray-400 mb-4">
                  Faça upload de um arquivo de texto (.txt, .csv, etc) para simular a analisar e visualizar infográficos de dados.
                </p>
                <button className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300">
                  Escolher Arquivo
                </button>
                {/* Aqui você adicionaria o componente de upload de arquivo real */}
              </div>
            </section>
          )}

          {activeTab === 'videos' && (
            <section>
              <h2 className="text-3xl font-bold text-white mb-4">Análise de Vídeos</h2>
              <p className="text-gray-300 mb-6">
                Gerencie e otimize seus vídeos para maior engajamento e alcance.
              </p>
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-3">
                  Upload ou Link de Vídeo
                </h3>
                <p className="text-gray-400 mb-4">
                  Cole a URL de um vídeo ou faça upload para análise de transcrição e conteúdo.
                </p>
                <input
                  type="text"
                  placeholder="Cole a URL do vídeo aqui..."
                  className="w-full p-3 rounded-md bg-gray-800 text-gray-200 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                />
                <button className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300">
                  Analisar Vídeo
                </button>
              </div>
            </section>
          )}

          {activeTab === 'mind-map' && (
            <MindMapSection /> // Renderiza o novo componente de Mapa Mental aqui
          )}
        </main>
      </div>
    </div>
  );
}

// NOVO COMPONENTE: MindMapSection
function MindMapSection() {
  const [inputText, setInputText] = useState('');
  const [mindMapData, setMindMapData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateMindMap = async () => {
    setIsLoading(true);
    setError(null);
    setMindMapData(null); // Limpa dados anteriores

    try {
      const response = await fetch('http://127.0.0.1:5000/api/gerar-mapa-mental', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: inputText }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao gerar mapa mental.');
      }

      setMindMapData(data);
    } catch (err) {
      console.error('Erro ao chamar API de mapa mental:', err);
      setError(err.message || 'Ocorreu um erro desconhecido ao gerar o mapa mental.');
    } finally {
      setIsLoading(false);
    }
  };

  // Função auxiliar para renderizar nós do mapa mental recursivamente
  const renderNode = (node, level = 0) => {
    if (!node) return null;

    const indent = level * 2; // Nível de indentação
    const nodeStyle = {
      marginLeft: `${indent}rem`,
      padding: '0.5rem 1rem',
      borderRadius: '0.5rem',
      marginBottom: '0.5rem',
      backgroundColor: `rgba(59, 130, 246, ${node.influence_score || 0.5})`, // Exemplo de cor baseada na influência
      color: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    };

    return (
      <div key={node.node + level} className="transition-all duration-300 ease-in-out">
        <div style={nodeStyle}>
          <p className="font-semibold">{node.node}</p>
          <p className="text-sm">Relevância: {node.relevance_score?.toFixed(2)} | Influência: {node.influence_score?.toFixed(2)}</p>
        </div>
        {node.children && node.children.length > 0 && (
          <div className="mt-1">
            {node.children.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <section>
      <h2 className="text-3xl font-bold text-white mb-4">Gerador de Mapa Mental (IA-Zodíaco Virgo)</h2>
      <p className="text-gray-300 mb-6">
        Insira um texto e a IA-Zodíaco Virgo (usando Gemini) extrairá os conceitos principais e sub-conceitos para um mapa mental.
      </p>

      <div className="bg-gray-700 p-4 rounded-lg">
        <h3 className="text-xl font-semibold text-white mb-3">Texto para Análise</h3>
        <textarea
          className="w-full p-3 rounded-md bg-gray-800 text-gray-200 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 h-40 resize-y"
          placeholder="Cole ou digite seu texto aqui para gerar o mapa mental..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        ></textarea>
        <button
          onClick={generateMindMap}
          disabled={isLoading || !inputText.trim()}
          className={`px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 ${isLoading || !inputText.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? 'Gerando...' : 'Gerar Mapa Mental'}
        </button>

        {error && (
          <div className="mt-4 p-3 bg-red-800 text-red-100 rounded-md">
            Erro: {error}
          </div>
        )}

        {mindMapData && (
          <div className="mt-6 p-4 bg-gray-800 rounded-lg shadow-inner">
            <h3 className="text-2xl font-bold text-white mb-4">Estrutura do Mapa Mental:</h3>
            <div className="text-gray-200">
              {renderNode(mindMapData)}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default App;
