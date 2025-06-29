import React, { useState } from 'react';
import './App.css';
import MindMapSection from './components/sections/MindMapSection';
import VideosSection from './components/sections/VideosSection';
import SeoSection from './components/sections/SeoSection';

function App() {
  const [activeSection, setActiveSection] = useState('SEO');
  const [currentSectionTheme, setCurrentSectionTheme] = useState({
    sectionBackground: 'rgba(29, 78, 216, 0.7)', 
    buttonDisplayColor: '#1d4ed8' 
  }); 
  const [isWallpaperActive, setIsWallpaperActive] = useState(false);
  const [selectedWallpaperFile, setSelectedWallpaperFile] = useState(null);

  const themes = {
    'red': { sectionBackground: 'rgba(185, 28, 28, 0.7)', buttonDisplayColor: '#b91c1c' },
    'blue': { sectionBackground: 'rgba(29, 78, 216, 0.7)', buttonDisplayColor: '#1d4ed8' },
    'green': { sectionBackground: 'rgba(4, 120, 87, 0.7)', buttonDisplayColor: '#047857' },
    'purple': { sectionBackground: 'rgba(126, 34, 206, 0.7)', buttonDisplayColor: '#7e22ce' },
    'yellow': { sectionBackground: 'rgba(245, 158, 11, 0.7)', buttonDisplayColor: '#f59e0b' },
    'indigo': { sectionBackground: 'rgba(79, 70, 229, 0.7)', buttonDisplayColor: '#4f46e5' },
    'gray': { sectionBackground: 'rgba(55, 65, 81, 0.7)', buttonDisplayColor: '#374151' }, 
  };

  const handleThemeChange = (themeName) => {
    setCurrentSectionTheme(themes[themeName]); 
    console.log(`Cor do balão alterada para: ${themeName}`);
    console.log(`Wallpaper Ativo: ${isWallpaperActive}, Arquivo Wallpaper: ${selectedWallpaperFile ? selectedWallpaperFile.name : 'Nenhum'}`);
  };

  const handleWallpaperFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedWallpaperFile(file);
      setIsWallpaperActive(true); 
      setCurrentSectionTheme(themes['gray']); 
      console.log(`Wallpaper selecionado: ${file.name}`);
    } else {
      console.log('Nenhum arquivo de wallpaper selecionado.');
    }
  };

  let mainBackgroundClasses = '';
  let mainBackgroundStyle = {};

  if (isWallpaperActive && selectedWallpaperFile) {
    mainBackgroundClasses = 'bg-cover bg-center';
    mainBackgroundStyle = { 
      backgroundImage: `url(${URL.createObjectURL(selectedWallpaperFile)})`, 
      transition: 'background-image 0.5s ease-in-out' 
    };
  } else {
    mainBackgroundClasses = 'bg-gray-900'; 
    mainBackgroundStyle = {}; 
  }
  
  const currentTextColorClass = 'text-gray-100';

  return (
    <div className={`min-h-screen ${mainBackgroundClasses} ${currentTextColorClass} transition-colors duration-500`} style={mainBackgroundStyle}>
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

      <div className="p-4 bg-gray-700 shadow-md flex flex-wrap items-center gap-4 text-white">
        <span className="font-semibold">Cor dos Balões:</span>
        {Object.keys(themes).map((themeName) => (
          <button
            key={themeName}
            className={`w-8 h-8 rounded-full border-2 cursor-pointer transition-all duration-300 
                        ${currentSectionTheme.buttonDisplayColor === themes[themeName].buttonDisplayColor ? 'border-blue-400 scale-110' : 'border-transparent hover:scale-105'}`}
            onClick={() => handleThemeChange(themeName)}
            style={{ backgroundColor: themes[themeName].buttonDisplayColor }} 
          >
          </button>
        ))}
        
        <input
          type="file"
          id="wallpaper-upload"
          accept="image/*, .gif" 
          className="hidden"
          onChange={handleWallpaperFileChange}
        />
        <label 
          htmlFor="wallpaper-upload" 
          className={`px-4 py-2 rounded-md font-semibold transition-colors duration-300 cursor-pointer 
            ${isWallpaperActive ? 'bg-blue-600 text-white' : 'bg-gray-600 hover:bg-gray-700 text-gray-200'}`}
        >
          {isWallpaperActive && selectedWallpaperFile ? `Wallpaper (${selectedWallpaperFile.name.substring(0, 10)}...)` : 'Selecionar Wallpaper'}
        </label>
        {isWallpaperActive && selectedWallpaperFile && ( 
          <button
            className="ml-2 px-4 py-2 rounded-md font-semibold transition-colors duration-300 bg-red-600 hover:bg-red-700 text-white"
            onClick={() => { 
              setIsWallpaperActive(false); 
              setSelectedWallpaperFile(null); 
              setCurrentSectionTheme(themes['blue']); 
              console.log('Wallpaper removido.');
            }} 
          >
            Remover Wallpaper
          </button>
        )}
        {selectedWallpaperFile && (
          <span className="ml-4 text-yellow-300">
            *A imagem é mostrada localmente. Upload real requer backend.
          </span>
        )}
      </div>

      <main className="p-4">
        {activeSection === 'SEO' && <SeoSection sectionBgColor={currentSectionTheme.sectionBackground} />}
        {activeSection === 'VIDEOS' && <VideosSection sectionBgColor={currentSectionTheme.sectionBackground} />}
        {activeSection === 'MAPA MENTAL' && <MindMapSection sectionBgColor={currentSectionTheme.sectionBackground} />}
      </main>
    </div>
  );
}

export default App;
