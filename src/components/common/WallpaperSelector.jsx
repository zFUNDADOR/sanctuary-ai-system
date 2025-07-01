import React, { useRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import zodiacCircleImage from '../../assets/zodiac_circle.jpg'; // Importa a imagem do zodíaco

function WallpaperSelector() {
  const { currentWallpaper, setCurrentWallpaper, setCurrentView } = useTheme();
  const fileInputRef = useRef(null); // Ref para o input de arquivo

  // Lista de URLs de papéis de parede de exemplo (removido o zodíaco daqui)
  const wallpapers = [
    { name: 'Céu Estrelado', url: 'https://images.unsplash.com/photo-1536514498073-50e69d39c6b7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { name: 'Galáxia Distante', url: 'https://images.unsplash.com/photo-1506703570074-c5a40a6b7e0e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { name: 'Nebulosa Abstrata', url: 'https://images.unsplash.com/photo-1507499770-6b50937a00f2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { name: 'Amanhecer Cósmico', url: 'https://images.unsplash.com/photo-1462331940025-496dfcac6265?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  ];

  // Função para lidar com o upload de arquivo
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Cria uma URL para a imagem carregada localmente
        setCurrentWallpaper(reader.result);
      };
      reader.readAsDataURL(file); // Lê o arquivo como uma URL de dados (base64)
    }
  };

  // Função para acionar o clique no input de arquivo
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <section className="p-4 rounded-lg shadow-md w-full max-w-4xl" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
      <h2 className="text-3xl font-bold text-white mb-6 text-center">Selecionar Wallpaper</h2>
      <p className="text-gray-300 mb-8 text-center">
        Escolha uma imagem de fundo para personalizar a ambientação do seu Sanctuary.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {wallpapers.map((wallpaper, index) => (
          <div
            key={index}
            onClick={() => setCurrentWallpaper(wallpaper.url)}
            className={`relative w-full h-32 rounded-lg overflow-hidden cursor-pointer shadow-md transition-transform duration-300 hover:scale-105
                        ${currentWallpaper === wallpaper.url ? 'border-4 border-blue-500' : 'border-2 border-gray-700'}`}
          >
            <img
              src={wallpaper.url}
              alt={wallpaper.name}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x300/374151/ffffff?text=Erro+ao+carregar'; }}
            />
            {currentWallpaper === wallpaper.url && (
              <div className="absolute inset-0 flex items-center justify-center bg-blue-500 bg-opacity-50 text-white text-xl font-bold rounded-lg">
                Selecionado
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs p-1 text-center">
              {wallpaper.name}
            </div>
          </div>
        ))}

        {/* Botão de Upload de Imagem */}
        <div
          onClick={triggerFileInput}
          className={`relative w-full h-32 rounded-lg overflow-hidden cursor-pointer shadow-md transition-transform duration-300 hover:scale-105
                      flex items-center justify-center text-white text-center border-2 border-dashed border-gray-500 bg-gray-800 hover:bg-gray-700`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*" // Aceita apenas arquivos de imagem
          />
          <span className="text-lg font-semibold">+ Upload Imagem</span>
        </div>
      </div>

      <button
        onClick={() => setCurrentView('zodiac-theme')}
        className="mt-8 px-6 py-3 bg-purple-600 text-white font-semibold rounded-full shadow-lg hover:bg-purple-700 transition-colors duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-75"
      >
        Ir para o Tema Zodíaco (Interativo)
      </button>
    </section>
  );
}

export default WallpaperSelector;
