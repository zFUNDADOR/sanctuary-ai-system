import React, { useState } from 'react';
// Caminhos de importação ajustados e verificados
import './App.css'; 
import MindMapSection from './components/sections/MindMapSection'; 
import VideosSection from './components/sections/VideosSection'; 
import SeoSection from './components/sections/SeoSection';     

function App() {
  const [activeSection, setActiveSection] = useState('SEO');
  const [currentChatBubbleColor, setCurrentChatBubbleColor] = useState('bg-gray-700'); 
  const [isWallpaperActive, setIsWallpaperActive] = useState(false);

  const themeColors = {
    'red': { bubble: 'bg-red-700', bgMain: 'bg-gradient-to-br from-red-900 to-rose-900', display: '#b91c1c' },
    'blue': { bubble: 'bg-blue-700', bgMain: 'bg-gradient-to-br from-blue-900 to-indigo-900', display: '#1d4ed8' },
    'green': { bubble: 'bg-green-700', bgMain: 'bg-gradient-to-br from-green-900 to-emerald-900', display: '#047857' },
    'purple': { bubble: 'bg-purple-700', bgMain: 'bg-gradient-to-br from-purple-900 to-pink-900', display: '#7e22ce' },
    'yellow': { bubble: 'bg-yellow-700', bgMain: 'bg-gradient-to-br from-yellow-900 to-orange-900', display: '#f59e0b' },
    'indigo': { bubble: 'bg-indigo-700', bgMain: 'bg-gradient-to-br from-indigo-900 to-violet-900', display: '#4f46e5' },
    'gray': { bubble: 'bg-gray-700', bgMain: 'bg-gray-900', display: '#374151' }, 
  };

  const handleBubbleColorChange = (colorKey) => {
    setCurrentChatBubbleColor(themeColors[colorKey].bubble);
    setIsWallpaperActive(false); 
  };

  const handleWallpaperToggle = () => {
    setIsWallpaperActive(prev => !prev);
    setCurrentChatBubbleColor('bg-gray-700'); 
  };

  let mainBackgroundClass = '';
  let wallpaperStyle = {};

  if (isWallpaperActive) {
    mainBackgroundClass = 'bg-cover bg-center';
    wallpaperStyle = { 
      backgroundImage: "url('https://placehold.co/1920x1080/000000/FFFFFF?text=Seu+Wallpaper+Aqui')", 
      transition: 'background-image 0.5s ease-in-out' 
    };
  } else {
    mainBackgroundClass = themeColors[currentChatBubbleColor.replace('bg-', '')].bgMain;
  }
  
  const currentTextColorClass = 'text-gray-100'; 

  return (
    <div className={`min-h-screen ${mainBackgroundClass} ${currentTextColorClass} transition-colors duration-500`} style={wallpaperStyle}>
      {/* Header com os botões de navegação */}
      <header className="bg-gray-800 p-4 shadow-lg flex flex-col sm:flex-row justify-between items-center text-white">
        <h1 className="text-2xl font-bold mb-4 sm:mb-0">Sanctuary AI System</h1>
        <nav className="flex space-x-4">
          <button
            className={`px-4 py-2 rounded-md font-semibold transition-colors duration-300 
              ${activeSection === 'SEO' ? 'bg-blue-600 text-white' : 'bg-gray-600 hover:bg-gray-700 text-gray-200'}`}
            onClick={() => setActiveSection('SEO')}
          >
            SEO
          </button>
          <button
            className={`px-4 py-2 rounded-md font-semibold transition-colors duration-300 
              ${activeSection === 'VIDEOS' ? 'bg-blue-600 text-white' : 'bg-gray-600 hover:bg-gray-700 text-gray-200'}`}
            onClick={() => setActiveSection('VIDEOS')}
          >
            VÍDEOS
          </button>
          <button
            className={`px-4 py-2 rounded-md font-semibold transition-colors duration-300 
              ${activeSection === 'MAPA MENTAL' ? 'bg-blue-600 text-white' : 'bg-gray-600 hover:bg-gray-700 text-gray-200'}`}
            onClick={() => setActiveSection('MAPA MENTAL')}
          >
            MAPA MENTAL
          </button>
        </nav>
      </header>

      {/* Controles de tema/wallpaper */}
      <div className="p-4 bg-gray-700 shadow-md flex flex-wrap items-center gap-4 text-white">
        <span className="font-semibold">Cor dos Balões:</span>
        {Object.keys(themeColors).filter(key => key !== 'gray').map((colorKey) => (
          <button
            key={colorKey}
            className={`w-8 h-8 rounded-full border-2 cursor-pointer transition-all duration-300 
                        ${currentChatBubbleColor === themeColors[colorKey].bubble && !isWallpaperActive ? 'border-blue-400 scale-110' : 'border-transparent hover:scale-105'}`}
            onClick={() => handleBubbleColorChange(colorKey)}
            style={{ backgroundColor: themeColors[colorKey].display }} 
          >
          </button>
        ))}
        
        <button
          className={`px-4 py-2 rounded-md font-semibold transition-colors duration-300 
            ${isWallpaperActive ? 'bg-blue-600 text-white' : 'bg-gray-600 hover:bg-gray-700 text-gray-200'}`}
          onClick={handleWallpaperToggle}
        >
          Wallpaper
        </button>
        {isWallpaperActive && (
          <span className="ml-4 text-yellow-300">
            *O Wallpaper é uma simulação por placeholder. Para upload, é necessário uma implementação adicional de arquivos.
          </span>
        )}
      </div>

      <main className="p-4">
        {activeSection === 'SEO' && <SeoSection currentChatBubbleColor={currentChatBubbleColor} />}
        {activeSection === 'VIDEOS' && <VideosSection currentChatBubbleColor={currentChatBubbleColor} />}
        {activeSection === 'MAPA MENTAL' && <MindMapSection currentChatBubbleColor={currentChatBubbleColor} />}
      </main>
    </div>
  );
}

export default App;
