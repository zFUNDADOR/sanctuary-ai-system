import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import zodiacCircleImage from '../../assets/zodiac_circle.jpg'; // Importa a imagem do zodíaco

// Importe os ícones dos signos do zodíaco
import {
  GiAries, GiTaurus, GiGemini, GiCancer, GiLeo, GiVirgo,
  GiLibra, GiScorpio, GiSagittarius, GiCapricorn, GiAquarius, GiPisces
} from 'react-icons/gi';

const zodiacIcons = {
  ARIES: GiAries,
  TAURUS: GiTaurus,
  GEMINI: GiGemini,
  CANCER: GiCancer,
  LEO: GiLeo,
  VIRGO: GiVirgo,
  LIBRA: GiLibra,
  SCORPIO: GiScorpio,
  SAGITTARIUS: GiSagittarius,
  CAPRICORN: GiCapricorn,
  AQUARIUS: GiAquarius,
  PISCES: GiPisces,
};

function ZodiacTheme({ addDebugMessage, onBackToWallpapers }) {
  const { currentTheme } = useTheme();

  // Posições dos botões do zodíaco (ajustadas manualmente para o círculo)
  // Você pode ajustar estes valores (top e left) para mover os botões
  // top e left são percentagens em relação ao contêiner da imagem do zodíaco.
  // O transform: 'translate(-50%, -50%)' centraliza o botão no ponto exato.
  const zodiacButtonPositions = [
    { name: 'ÁRIES', icon: zodiacIcons.ARIES, top: '15%', left: '50%' },
    { name: 'TOURO', icon: zodiacIcons.TAURUS, top: '25%', left: '70%' },
    { name: 'GÊMEOS', icon: zodiacIcons.GEMINI, top: '45%', left: '80%' },
    { name: 'CÂNCER', icon: zodiacIcons.CANCER, top: '65%', left: '70%' },
    { name: 'LEÃO', icon: zodiacIcons.LEO, top: '75%', left: '50%' },
    { name: 'VIRGEM', icon: zodiacIcons.VIRGO, top: '65%', left: '30%' },
    { name: 'LIBRA', icon: zodiacIcons.LIBRA, top: '45%', left: '20%' },
    { name: 'ESCORPIÃO', icon: zodiacIcons.SCORPIO, top: '25%', left: '30%' },
    { name: 'SAGITÁRIO', icon: zodiacIcons.SAGITTARIUS, top: '35%', left: '15%' },
    { name: 'CAPRICÓRNIO', icon: zodiacIcons.CAPRICORN, top: '5%', left: '30%' },
    { name: 'AQUÁRIO', icon: zodiacIcons.AQUARIUS, top: '5%', left: '70%' },
    { name: 'PEIXES', icon: zodiacIcons.PISCES, top: '35%', left: '85%' },
  ];

  const handleZodiacButtonClick = (signName) => {
    // Substituído alert() por uma mensagem no console ou um modal customizado se necessário
    console.log(`Você clicou no signo: ${signName}!`);
    addDebugMessage(`Zodíaco interativo clicado: ${signName}`, 'info');
    // Aqui você pode adicionar lógica para interagir com a API Gemini
  };

  return (
    <section
      className="relative flex flex-col items-center justify-center p-8 rounded-xl shadow-2xl w-full max-w-5xl mx-auto my-8 border border-gray-700"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo semitransparente para o componente
        minHeight: '600px', // Altura mínima para visualização
      }}
    >
      <h2 className="text-4xl font-extrabold text-white mb-4">Tema Zodíaco Interativo</h2>
      <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
        Explore os signos do zodíaco diretamente na roda. Clique em cada um para interagir!
      </p>

      {/* Contêiner da imagem do zodíaco e dos botões */}
      <div
        className="relative w-full max-w-xl aspect-square rounded-full flex items-center justify-center"
        style={{
          backgroundImage: `url(${zodiacCircleImage})`,
          backgroundSize: 'contain', // Ajusta a imagem para caber sem cortar
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          opacity: 0.8, // Opacidade da imagem do zodíaco
        }}
      >
        {/* Botões dos signos do zodíaco */}
        {zodiacButtonPositions.map((sign, index) => {
          const IconComponent = sign.icon;
          return (
            <button
              key={sign.name}
              onClick={() => handleZodiacButtonClick(sign.name)}
              className={`absolute p-3 rounded-full bg-gray-800 shadow-md
                          transition-all duration-300 transform hover:scale-110 flex items-center justify-center
                          ${currentTheme.bubble} text-white`}
              style={{
                top: sign.top,
                left: sign.left,
                transform: 'translate(-50%, -50%)', // Centraliza o botão no ponto
                zIndex: 10,
                width: '60px', // Tamanho fixo para os botões
                height: '60px',
              }}
            >
              {IconComponent && <IconComponent className="text-3xl" />}
            </button>
          );
        })}
      </div>

      <button
        onClick={onBackToWallpapers}
        className="mt-8 px-6 py-3 bg-red-600 text-white font-semibold rounded-full shadow-lg hover:bg-red-700 transition-colors duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-75"
      >
        Voltar para Wallpapers
      </button>
    </section>
  );
}

export default ZodiacTheme;
