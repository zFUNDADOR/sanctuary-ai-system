import React, { useState, useRef, useEffect } from 'react';
import Dashboard from './components/Dashboard/Dashboard';
import './App.css';

function App() {
  const [selectedSection, setSelectedSection] = useState("SEO");
  const [backgroundImage, setBackgroundImage] = useState('');
  const [selectedColor, setSelectedColor] = useState('blue'); // Usaremos 'blue', 'purple', etc. como chaves
  // Não precisamos mais de dashboardBaseColor como um state separado aqui,
  // pois a cor final RGBA será calculada a partir de selectedColor

  const fileInputRef = useRef(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setBackgroundImage(imageUrl);
    }
  };

  const handleWallpaperButtonClick = () => {
    fileInputRef.current.click();
  };

  // Define a cor de fundo com base na imagem selecionada
  const appStyle = {
    backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
  };

  // Função para converter HEX para RGBA com transparência
  const toRgba = (hex, alpha) => {
    if (!hex || hex.length < 7) return `rgba(0,0,0,${alpha})`; // Fallback para hex inválido
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  // Mapeamento de cores (HEX originais e suas variáveis auxiliares)
  const colorMap = {
    'blue': { base: '#2e3440', lighter: '#3b4252', darker: '#242930' }, // Nord
    'purple': { base: '#5e4d7a', lighter: '#7d699e', darker: '#4a3c61' },
    'green': { base: '#4a675f', lighter: '#6d9487', darker: '#3a524a' },
    'grey': { base: '#4c566a', lighter: '#6d7b90', darker: '#3e4658' },
    'pink': { base: '#8f3b5d', lighter: '#bb5b83', darker: '#702d4a' },
    'teal': { base: '#2a9d8f', lighter: '#4bb6a3', darker: '#217d72' },
  };

  // Este useEffect será executado sempre que selectedColor mudar
  useEffect(() => {
    const root = document.documentElement;
    const colors = colorMap[selectedColor] || colorMap['blue']; // Pega as cores do mapa, fallback para 'blue'

    // Define as variáveis CSS customizadas com transparência
    root.style.setProperty('--dashboard-base-color', toRgba(colors.base, 0.7)); // Balão principal 70%
    root.style.setProperty('--dashboard-lighter-color', toRgba(colors.lighter, 0.85)); // Bordas/links 85%
    root.style.setProperty('--dashboard-darker-color', toRgba(colors.darker, 0.9)); // Sombras 90%
    root.style.setProperty('--section-background-color', toRgba(colors.base, 0.85)); // Balões internos 85%
  }, [selectedColor]); // Dependência: só roda se selectedColor mudar

  // Cores predefinidas para os botões do seletor
  const colorOptions = [
    { name: "Padrão (Azul)", key: "blue", hex: "#2e3440" },
    { name: "Roxo Profundo", key: "purple", hex: "#5e4d7a" },
    { name: "Verde Escuro", key: "green", hex: "#4a675f" },
    { name: "Cinza Suave", key: "grey", hex: "#4c566a" },
    { name: "Rosa Vibrante", key: "pink", hex: "#8f3b5d" },
    { name: "Verde Azulado", key: "teal", hex: "#2a9d8f" },
  ];

  return (
    <div className="App" style={appStyle}>
      <header className="App-header">
        <nav>
          <button
            onClick={() => setSelectedSection("SEO")}
            className={selectedSection === "SEO" ? "active" : ""}
          >
            SEO
          </button>
          <button
            onClick={() => setSelectedSection("VÍDEOS")}
            className={selectedSection === "VÍDEOS" ? "active" : ""}
          >
            VÍDEOS
          </button>
          <button
            onClick={() => setSelectedSection("MAPA MENTAL")}
            className={selectedSection === "MAPA MENTAL" ? "active" : ""}
          >
            MAPA MENTAL
          </button>
        </nav>

        {/* Seletor de Cores para os Balões */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: '10px', color: '#eceff4', fontSize: '0.9em' }}>Cor dos Balões:</span>
          {colorOptions.map((color) => (
            <button
              key={color.key} // Usamos key aqui para identificar a cor
              onClick={() => setSelectedColor(color.key)} // Define selectedColor como a chave
              style={{
                backgroundColor: color.hex, // O botão mostra a cor sólida original
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                border: selectedColor === color.key ? '2px solid #88c0d0' : '2px solid transparent',
                cursor: 'pointer',
                margin: '0 5px',
                transition: 'border 0.2s ease',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}
              title={color.name}
            >
            </button>
          ))}
        </div>

        {/* Botão para escolher o wallpaper */}
        <button
          onClick={handleWallpaperButtonClick}
          style={{
            marginLeft: '15px',
            padding: '10px 15px',
            backgroundColor: '#88c0d0',
            color: '#282c34',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '0.9em',
            fontWeight: 'bold',
            transition: 'background-color 0.3s ease',
          }}
        >
          Wallpaper
        </button>
        {/* Input de arquivo oculto */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={fileInputRef}
          style={{ display: 'none' }}
        />
      </header>

      {/* Passa apenas selectedSection para o Dashboard, pois as cores são globais via CSS Vars */}
      <Dashboard selectedSection={selectedSection} />
    </div>
  );
}

export default App;