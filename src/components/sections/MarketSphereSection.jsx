// src/components/sections/MarketSphereSection.jsx
import React, { useEffect, useRef } from 'react';
// Importa a função initMarketSphere do seu arquivo market-sphere.js
import { initMarketSphere, updateMarketData } from '../../market-sphere'; 
// Importa o CSS específico para a esfera do mercado
import './MarketSphere.css'; // <-- ADICIONE ESTA LINHA AQUI!

// Dados de mercado iniciais (exemplo do seu app.js original)
const initialMarketData = {
    sectors: [
        {
            id: 'setor1',
            name: 'Saúde e Bem-Estar',
            micro_niches: [
                { id: 'mn1', name: 'Receitas Veganas sem Glúten para Atletas', sigla: 'RVSA', status: 'ativo' },
                { id: 'mn2', name: 'Meditação para Redução de Estresse em Profissionais', sigla: 'MRSP', status: 'inativo' },
                { id: 'mn3', name: 'Exercícios de Baixo Impacto para Idosos', sigla: 'EBII', status: 'ativo' },
                { id: 'mn4', name: 'Suplementos Naturais para Foco Mental', sigla: 'SNFM', status: 'inativo' },
                { id: 'mn5', name: 'Yoga para Iniciantes com Problemas de Coluna', sigla: 'YIPC', status: 'ativo' }
            ]
        },
        {
            id: 'setor2',
            name: 'Tecnologia',
            micro_niches: [
                { id: 'mn6', name: 'Cursos de Programação para Crianças', sigla: 'CPPC', status: 'inativo' },
                { id: 'mn7', name: 'Ferramentas de Automação para Pequenas Empresas', sigla: 'FAPE', status: 'ativo' },
                { id: 'mn8', name: 'Desenvolvimento de Apps Low-Code', sigla: 'DALC', status: 'ativo' }
            ]
        },
        {
            id: 'setor3',
            name: 'Finanças Pessoais',
            micro_niches: [
                { id: 'mn9', name: 'Investimentos para Iniciantes', sigla: 'IFI', status: 'ativo' },
                { id: 'mn10', name: 'Gestão de Dívidas para Jovens Adultos', sigla: 'GDJA', status: 'inativo' }
            ]
        },
        {
            id: 'setor4',
            name: 'Marketing Digital',
            micro_niches: [
                { id: 'mn11', name: 'SEO Local para Pequenos Negócios', sigla: 'SLPN', status: 'ativo' },
                { id: 'mn12', name: 'Copywriting para E-commerce', sigla: 'CPEC', status: 'ativo' },
                { id: 'mn13', name: 'Automação de Marketing para Afiliados', sigla: 'AMPA', status: 'inativo' }
            ]
        }
    ]
};


// Componente MarketSphereSection para exibir a visualização 3D da esfera do mercado
export default function MarketSphereSection() {
  const containerRef = useRef(null); // Ref para o contêiner da esfera

  useEffect(() => {
    // Garante que o contêiner existe antes de inicializar a esfera
    if (containerRef.current) {
      console.log('Container para Market Sphere está pronto:', containerRef.current); // LOG: Confirma que o ref está disponível
      // Chama a função de inicialização da esfera do mercado
      // Passa o ID do contêiner e os dados iniciais
      initMarketSphere(containerRef.current.id, initialMarketData);
    }

    // Função de limpeza (opcional, mas boa prática para Three.js)
    return () => {
      // Se a esfera precisar ser destruída ao desmontar o componente, a lógica iria aqui
      // Ex: cleanupThreeJsScene();
    };
  }, []); // Array de dependências vazio para rodar apenas uma vez na montagem

  return (
    <section id="market-sphere" className="p-4 bg-gray-900 text-white min-h-screen">
      <h2 className="text-3xl font-bold mb-4 text-center">Esfera do Mercado: Progressão de Micro-Nichos</h2>
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl mb-6">
        <p className="text-lg text-gray-300 mb-4 text-center">
          Explore os setores de mercado e o progresso dos seus micro-nichos. Clique em um setor para ver os detalhes.
        </p>
        {/* Contêiner para a visualização 3D da esfera */}
        <div id="market-sphere-container" ref={containerRef} className="relative w-full h-[600px] bg-gray-700 rounded-lg overflow-hidden">
          {/* Tooltips e botão de retorno serão gerenciados pelo market-sphere.js */}
          {/* REMOVIDAS as classes Tailwind de opacidade, pointer-events e z-index para que o CSS externo tenha controle total */}
          <div id="market-sphere-tooltip" className="absolute bg-black bg-opacity-70 text-white text-sm p-2 rounded-md transition-opacity duration-200"></div>
          <div id="vector-tooltip" className="absolute bg-black bg-opacity-70 text-white text-sm p-2 rounded-md transition-opacity duration-200"></div>
          <button id="back-to-sectors-btn" className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-lg transition-all duration-200 z-20" style={{ display: 'none' }}>
            Voltar para Setores
          </button>
        </div>
      </div>
    </section>
  );
}
