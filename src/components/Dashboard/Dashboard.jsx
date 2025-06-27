import React from 'react'; // Não precisamos mais do useEffect aqui para cores
import SEOSection from '../sections/SEOSection';
import VideosSection from '../sections/VideosSection';
import MindMapSection from '../sections/MindMapSection';

function Dashboard({ selectedSection }) { // Remove selectedColor daqui, não precisamos mais dela diretamente

  // As cores de background do dashboard-container e section-content-box
  // serão definidas pelas variáveis CSS customizadas --dashboard-base-color e --section-background-color
  // que são gerenciadas no App.jsx.

  return (
    <div className="dashboard-container" style={{ backgroundColor: 'var(--dashboard-base-color)' }}>
      {/* O background-color do container principal agora vem da variável CSS */}
      <div className="section-content-box" style={{ backgroundColor: 'var(--section-background-color)' }}>
        {selectedSection === 'SEO' && (
          <div>
            <h2>Conteúdo de SEO</h2>
            <p>Aqui você pode exibir métricas, análises de palavras-chave e otimizações de SEO.</p>
            <SEOSection />
          </div>
        )}
        {selectedSection === 'VÍDEOS' && ( // CORRIGIDO: Use "VÍDEOS" com acento
          <div>
            <h2>Seção de VÍDEOS</h2>
            <p>Aqui você pode gerenciar e visualizar seus vídeos.</p>
            <VideosSection />
          </div>
        )}
        {selectedSection === 'MAPA MENTAL' && (
          <div>
            <h2>Seção de MAPA MENTAL</h2>
            <p>Explore suas ideias e conceitos de forma visual.</p>
            <MindMapSection />
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;