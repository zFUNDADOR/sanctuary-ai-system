import React from 'react';
// Caminhos de importação corrigidos para os componentes auxiliares
import EditorDeCodigo from '../ZonaDeControle/EditorDeCodigo';
import OutputSimulacao from '../ZonaDeControle/OutputSimulacao'; 
import ChatIA from '../ZonaDeControle/ChatIA';
import FileSidebar from '../ZonaDeControle/FileSidebar'; 
import simulateCode from '../ZonaDeControle/simulador';
import PainelFlaskSimulado from '../ZonaDeControle/PainelFlaskSimulado';

// Caminho absoluto para useAbaEditor a partir da raiz do 'src'
import useAbaEditor from '/src/hooks/useAbaEditor'; 

const initialFiles = {
  'App.jsx': `import React from 'react';

function App() {
  return <h1>Hello from App</h1>;
}

export default App;`,
  'main.py': `from flask import Flask

app = Flask(__name__)

@app.route('/')
def home():
    return "Hello from Flask!"

if __name__ == '__main__':
    app.run(port=5000)`
};

export default function ZonaDeControle() {
  const {
    files,
    activeFile,
    openTabs,
    openTab,
    closeTab,
    updateFileContent,
    addFiles,
  } = useAbaEditor(initialFiles, 'App.jsx');

  const simulationOutput = simulateCode(activeFile, files[activeFile]);

  const [chatHistory, setChatHistory] = React.useState([]);

  // Ajuste na função handleSendToIA para lidar com o carregamento do histórico do Firestore
  const handleSendToIA = (messageEntry, replaceHistory = false) => {
    if (replaceHistory) {
      // Se replaceHistory for true, substitui todo o histórico
      setChatHistory(messageEntry);
    } else {
      // Caso contrário, adiciona a nova mensagem
      setChatHistory((prev) => {
        // Se a última mensagem for um placeholder, atualiza-a
        // Isso é importante para quando a resposta da IA chega e substitui o "..."
        if (prev.length > 0 && prev[prev.length - 1].ai === '...') {
          const updatedHistory = [...prev];
          updatedHistory[updatedHistory.length - 1] = messageEntry;
          return updatedHistory;
        }
        // Caso contrário, adiciona uma nova entrada
        return [...prev, messageEntry];
      });
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* FileSidebar - Largura fixa e rolagem interna */}
      <FileSidebar
        files={files}
        activeFile={activeFile}
        onFileSelect={openTab}
        onUploadFiles={addFiles}
      />

      {/* Conteúdo principal - Flexível e com rolagem vertical */}
      <div className="flex-1 flex flex-col p-4 gap-4 overflow-y-auto">
        {/* Título da Zona de Controle */}
        <h1 className="text-3xl font-bold mb-6">ZONA DE CONTROLE</h1>

        {/* Abas abertas - Ajustes para quebra de linha e espaçamento */}
        <div className="flex flex-wrap gap-2 pb-2 border-b border-gray-600 mb-4 min-h-[40px]">
          {openTabs.map((tab) => (
            <div
              key={tab}
              className={`flex-shrink-0 px-3 py-1 rounded-t-md cursor-pointer flex items-center gap-2 justify-between min-w-[120px] max-w-[200px] ${ // Ajustado min-w e max-w
                tab === activeFile ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-400'
              }`}
              onClick={() => openTab(tab)}
            >
              <span className="truncate block flex-grow">{tab}</span>
              <button 
                onClick={(e) => { e.stopPropagation(); closeTab(tab); }}
                className="ml-2 p-1 rounded-full hover:bg-gray-600 transition-colors duration-200"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Editor de Código */}
        <EditorDeCodigo
          fileName={activeFile}
          code={files[activeFile]}
          onChange={(code) => updateFileContent(activeFile, code)}
        />

        {/* Output de Simulação */}
        <OutputSimulacao
          output={simulationOutput}
          onSimular={() => {}}
        />

        {/* Chat com IA */}
        <ChatIA
          chatHistory={chatHistory}
          onEnviarMensagem={handleSendToIA}
        />

        {/* Painel Flask Simulado */}
        <PainelFlaskSimulado />
      </div>
    </div>
  );
}
