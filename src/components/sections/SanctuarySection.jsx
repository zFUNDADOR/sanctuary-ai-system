import React from 'react';

// Não é necessário importar useTheme aqui, pois SanctuarySection não usa o tema diretamente.
// Ele apenas chama onSelectZodiac para mudar a seção.

function SanctuarySection({ onSelectZodiac, addDebugMessage }) {
  // Dados dos signos do zodíaco para exibição
  const zodiacSigns = [
    'ÁRIES', 'TOURO', 'GÊMEOS', 'CÂNCER',
    'LEÃO', 'VIRGEM', 'LIBRA', 'ESCORPIÃO',
    'SAGITÁRIO', 'CAPRICÓRNIO', 'AQUÁRIO', 'PEIXES'
  ];

  const handleSignClick = (signName) => {
    addDebugMessage(`Signo ${signName} clicado na seção Santuário.`, 'info');
    onSelectZodiac(signName);
  };

  return (
    <section className="p-8 rounded-xl shadow-2xl w-full max-w-4xl" style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
      <h2 className="text-4xl font-extrabold text-white mb-6 text-center">Seu Santuário de IAs-Zodíaco</h2>
      <p className="text-gray-300 mb-8 text-center max-w-2xl mx-auto">
        Bem-vindo ao coração do seu sistema Sanctuary. Cada signo do zodíaco representa um
        módulo de IA especializado, pronto para oferecer insights e assistências únicas. Clique em um
        signo para acessar seu módulo dedicado.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {zodiacSigns.map((sign, index) => (
          <button
            key={index}
            onClick={() => handleSignClick(sign)}
            className="p-4 bg-gray-800 text-white rounded-lg shadow-md hover:bg-purple-700
                       transition-colors duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-75
                       text-lg font-semibold"
          >
            {sign}
          </button>
        ))}
      </div>

      <p className="text-gray-400 text-sm text-center italic mt-10">
        "A inteligência é a capacidade de se adaptar à mudança." - Stephen Hawking
      </p>
    </section>
  );
}

export default SanctuarySection;
