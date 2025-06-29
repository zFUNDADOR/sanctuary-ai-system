import React, { useState, useCallback, useEffect, useRef } from 'react'; 
import { Tree } from 'react-d3-tree';

function MindMapSection({ sectionBgColor }) {
  const [inputText, setInputText] = useState('');
  const [mindMapData, setMindMapData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(''); 
  const [messageType, setMessageType] = useState(''); 

  const BACKEND_URL = 'http://127.0.0.1:5000/api/gerar-mapa-mental';

  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });
  const [translateState, setTranslateState] = useState({ x: 0, y: 0 });
  const [zoomState, setZoomState] = useState(0.8);

  const [selectedNode, setSelectedNode] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const treeWrapperRef = useRef(null);

  useEffect(() => {
    if (treeWrapperRef.current) {
      const node = treeWrapperRef.current;
      const observer = new ResizeObserver(() => {
        const newWidth = node.offsetWidth;
        const newHeight = node.offsetHeight;
        setDimensions({
              width: newWidth,
              height: newHeight,
            });
        setTranslateState({
              x: newWidth / 8, 
              y: newHeight / 2, 
            });
      });
      observer.observe(node);
      return () => observer.disconnect(); 
    }
  }, []); 

  const mindMaps = [
    { id: 1, title: 'Ideias para o Projeto JARVIS' },
    { id: 2, title: 'Estrutura do Dashboard' },
  ];

  const handleNewMindMap = () => {
    setMessage('Função "Novo Mapa Mental" ainda a ser implementada com editor!');
    setMessageType('info');
    setMindMapData(null);
    setInputText('');
    setSelectedNode(null); 
    setIsSidebarOpen(false); 
  };

  const handleLoadMindMap = () => {
    setMessage('Função "Carregar Mapa Mental Existente" ainda a ser implementada com backend real!');
    setMessageType('info');
  };

  const handleGenerateMindMap = async () => {
    if (!inputText.trim()) {
      setMessage("Por favor, digite algum texto para gerar o mapa mental.");
      setMessageType("error");
      return;
    }

    setIsLoading(true);
    setSelectedNode(null); 
    setIsSidebarOpen(false); 
    setMessage('');
    setMessageType('');

    try {
      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: inputText }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `Erro do servidor: ${response.status}`);
      }

      const formatNode = (node) => ({
          name: node.node,
          attributes: {
              influence_score: node.influence_score
          },
          collapsed: false, 
          children: node.children ? node.children.map(formatNode) : undefined
      });

      const formattedData = formatNode(data);
      setMindMapData(formattedData);
      setMessage("Mapa mental gerado com sucesso!");
      setMessageType("success");

    } catch (error) {
      console.error("Erro ao gerar mapa mental:", error);
      setMessage(`Erro ao gerar o mapa mental: ${error.message}. Verifique o console para mais detalhes.`);
      setMessageType("error");
      setMindMapData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTreeClick = useCallback((nodeDatum) => {
    setSelectedNode(nodeDatum);
    setIsSidebarOpen(true);
    console.log("Nó clicado:", nodeDatum.name, "Score:", nodeDatum.attributes?.influence_score);
  }, []);

  const closeSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedNode(null);
  };

  const handleZoomIn = () => setZoomState(prev => prev * 1.2);
  const handleZoomOut = () => setZoomState(prev => prev / 1.2);
  const handleResetZoomPan = () => {
    if (treeWrapperRef.current) {
      const initialWidth = treeWrapperRef.current.offsetWidth;
      const initialHeight = treeWrapperRef.current.offsetHeight;
      setZoomState(0.8);
      setTranslateState({
        x: initialWidth / 8,
        y: initialHeight / 2,
      });
    }
  };

  const updateNodeCollapsedState = useCallback((nodes, targetNodeName, isCollapsed) => {
    return nodes.map(node => {
      if (node.name === targetNodeName) {
        return { ...node, collapsed: isCollapsed };
      }
      if (node.children) {
        return {
          ...node,
          children: updateNodeCollapsedState(node.children, targetNodeName, isCollapsed),
        };
      }
      return node;
    });
  }, []);

  const handleToggleNodeChildren = (nodeToToggle) => {
    if (!mindMapData || !nodeToToggle) return;

    const newMindMapData = updateNodeCollapsedState(
      [mindMapData], 
      nodeToToggle.name,
      !nodeToToggle.collapsed 
    )[0]; 

    setMindMapData(newMindMapData);

    const findUpdatedNode = (data, name) => {
        if (!data) return null;
        if (data.name === name) return data;
        if (data.children) {
            for (let child of data.children) {
                const found = findUpdatedNode(child, name);
                if (found) return found;
            }
        }
        return null;
    };
    setSelectedNode(findUpdatedNode(newMindMapData, nodeToToggle.name));
  };

  const renderCustomNodeElement = ({ nodeDatum, toggleNode }) => {
    // Garante um tamanho mínimo para os nós, mesmo com pontuações de influência baixas
    const influenceScore = nodeDatum.attributes?.influence_score || 0.1;
    const baseRadius = 25; // Aumentado o raio base para melhor visibilidade
    const scoreScale = 30; // Quanta a pontuação influencia o tamanho
    const nodeRadius = baseRadius + (influenceScore * scoreScale); 
    
    const nodeFillColor = `hsl(200, ${50 + (influenceScore * 50)}%, ${40 + (influenceScore * 30)}%)`; 
    const textColor = '#e2e8f0'; 
    // Escala do tamanho da fonte mais agressivamente
    const fontSize = `${0.8 + (influenceScore * 0.5)}em`; 

    return (
      <g onClick={(e) => { 
        toggleNode(); 
        handleTreeClick(nodeDatum); 
        e.stopPropagation(); 
      }}>
        <circle 
          r={nodeRadius} 
          fill={nodeFillColor}
          stroke="#4c566a" 
          strokeWidth={2} 
        />
        {/* Usando foreignObject para renderizar conteúdo HTML (o nome do nó) */}
        <foreignObject
          x={-nodeRadius} // Começa da borda esquerda do círculo (aprox)
          y={-nodeRadius / 2} // Centraliza verticalmente
          width={nodeRadius * 2} // Largura duas vezes o raio (aprox. diâmetro)
          height={nodeRadius} // Altura igual ao raio para espaço vertical
        >
          {/* Esta div contém o texto e gerencia o estilo para visibilidade */}
          <div 
            className="flex items-center justify-center h-full text-center p-0.5" 
            style={{ 
              color: textColor, 
              fontSize: fontSize, 
              lineHeight: '1', // Altura de linha mais justa para mais linhas
              overflow: 'hidden', // Ainda esconde o excesso se o texto for muito longo
              wordBreak: 'break-word', // Quebra palavras longas
              whiteSpace: 'normal', // Permite quebra de linha normal
              fontWeight: 'bold', // Deixa o texto em negrito
              textShadow: '1px 1px 2px rgba(0,0,0,0.7)' // Adiciona sombra ao texto para melhor legibilidade
            }}
          >
            {nodeDatum.name}
          </div>
        </foreignObject>
      </g>
    );
  };

  return (
    <section className="p-4">
      <h2 className="text-3xl font-bold text-white mb-4">Gerador de Mapa Mental (IA-Zodíaco Virgo)</h2>
      <p className="text-gray-300 mb-6">
        Explore suas ideias e conceitos de forma visual. Digite um texto para gerar um mapa mental com inteligência de LLM.
      </p>

      <div className="p-4 rounded-lg shadow-md" style={{ backgroundColor: sectionBgColor }}>
        <h3 className="text-xl font-semibold text-white mb-3">Gerar Novo Mapa Mental</h3>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Digite o texto para gerar o mapa mental..."
          rows="8"
          className="w-full p-3 mb-4 rounded-md border border-gray-600 bg-gray-800 text-gray-200 text-base resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>

        <button
          onClick={handleGenerateMindMap}
          disabled={isLoading}
          className={`px-5 py-2 rounded-md font-semibold transition-colors duration-300 ${
            isLoading ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isLoading ? 'Gerando...' : 'Gerar Mapa Mental'}
        </button>

        {message && (
          <div className={`mt-4 p-3 rounded-md ${messageType === 'error' ? 'bg-red-800 text-red-100' : messageType === 'success' ? 'bg-green-800 text-green-100' : 'bg-blue-800 text-blue-100'}`}>
            {message}
          </div>
        )}

        {mindMapData && (
          <div className="mt-8 p-4 rounded-lg border border-gray-600 bg-gray-800 overflow-hidden">
            <h3 className="text-2xl font-bold text-blue-300 mb-4 pb-2 border-b border-gray-600">Visualização do Mapa Mental:</h3>
            <div id="treeWrapper" ref={treeWrapperRef} className="w-full h-[500px] mx-auto bg-gray-800 relative">
              <Tree
                data={mindMapData}
                translate={translateState}
                zoom={zoomState}
                orientation="horizontal"
                onNodeClick={handleTreeClick} 
                renderCustomNodeElement={renderCustomNodeElement}
                pathFunc="step"
                collapsible={true}
                depthFactor={250}
                separation={{ siblings: 1.0, nonSiblings: 1.5 }}
                enableDrag={true}
                enableZoom={true}
                onNodeToggle={nodeDatum => {
                    handleToggleNodeChildren(nodeDatum);
                }}
              />
              <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
                  <button onClick={handleZoomIn} className="bg-gray-700 text-gray-300 p-2 rounded-lg shadow-lg hover:bg-gray-600 transition duration-300 flex justify-center items-center w-10 h-10">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="11" cy="11" r="8"></circle>
                          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                          <line x1="11" y1="8" x2="11" y2="14"></line>
                          <line x1="8" y1="11" x2="14" y2="11"></line>
                      </svg>
                  </button>
                  <button onClick={handleZoomOut} className="bg-gray-700 text-gray-300 p-2 rounded-lg shadow-lg hover:bg-gray-600 transition duration-300 flex justify-center items-center w-10 h-10">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="11" cy="11" r="8"></circle>
                          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                          <line x1="8" y1="11" x2="14" y2="11"></line>
                      </svg>
                  </button>
                  <button onClick={handleResetZoomPan} className="bg-gray-700 text-gray-300 p-2 rounded-lg shadow-lg hover:bg-gray-600 transition duration-300 flex justify-center items-center w-10 h-10">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 10a7 7 0 1 1 14 0c0 1.62-.27 3.23-1.12 4.7l-4.14 4.14a2.91 2.91 0 0 1-4.13 0L3.12 14.7C2.27 13.23 2 11.62 2 10Z"></path>
                          <path d="M7 10h.01"></path>
                          <path d="M11 10h.01"></path>
                          <path d="M15 10h.01"></path>
                      </svg>
                  </button>
              </div>
            </div>
          </div>
        )}

        {/* Barra Lateral de Detalhes do Nó */}
        {isSidebarOpen && selectedNode && (
          <div className="fixed top-0 right-0 w-72 h-full bg-gray-800 text-gray-100 p-6 shadow-xl z-50 overflow-y-auto">
            <button 
              onClick={closeSidebar} 
              className="absolute top-4 right-4 bg-transparent border-none text-blue-400 text-2xl cursor-pointer"
            >
                &times;
            </button>
            <h3 className="text-blue-300 text-xl font-bold mb-5">Detalhes do Nó</h3>
            <p className="mb-2"><span className="font-bold text-green-400">Nome:</span> {selectedNode.name}</p>
            <p className="mb-2"><span className="font-bold text-green-400">Score de Influência:</span> {selectedNode.attributes?.influence_score}</p>
            <p className="mb-2"><span className="font-bold text-green-400">Estado:</span> {selectedNode.collapsed ? 'Colapsado' : 'Expandido'}</p>
            <p className="mb-2"><span className="font-bold text-green-400">Número de Filhos:</span> {selectedNode.children ? selectedNode.children.length : 0}</p>
            
            <h4 className="text-blue-300 text-lg font-bold mt-5 mb-3">Ações:</h4>
            {selectedNode.children !== undefined || (selectedNode.attributes && selectedNode.attributes.hasOwnProperty('originalChildren') && selectedNode.attributes.originalChildren) ? (
                <button 
                    onClick={() => handleToggleNodeChildren(selectedNode)} 
                    className="py-2 px-4 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition duration-300 w-full mb-3"
                >
                    {selectedNode.collapsed ? 'Expandir Filhos' : 'Colapsar Filhos'}
                </button>
            ) : null}
            <button onClick={() => alert(`Editar conteúdo de "${selectedNode.name}" futuro`)} className="py-2 px-4 bg-gray-600 text-gray-200 rounded-md font-semibold hover:bg-gray-700 transition duration-300 w-full">
                Editar Nó
            </button>
          </div>
        )}

        {/* Seção de Mapas Mentais Salvos */}
        <h3 className="text-xl font-bold text-white mt-10 mb-4">Os seus Mapas Mentais Salvos</h3>
        {mindMaps.length > 0 ? (
          <ul className="list-none p-0">
            {mindMaps.map(mindMap => (
              <li key={mindMap.id} className="mb-2">
                <span className="text-gray-300">{mindMap.title}</span>
                <button
                  onClick={() => alert(`Abrir mapa mental: ${mindMap.title}`)}
                  className="ml-4 px-3 py-1 bg-gray-600 text-white rounded-md text-sm cursor-pointer hover:bg-gray-700 transition duration-300"
                >
                  Abrir
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-300">Nenhum mapa mental criado ainda.</p>
        )}
        <button
          onClick={handleNewMindMap}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md font-semibold hover:bg-indigo-700 transition duration-300 mr-2"
        >
          Novo Mapa Mental (Limpar)
        </button>
        <button
          onClick={handleLoadMindMap}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md font-semibold hover:bg-indigo-700 transition duration-300"
        >
          Carregar Mapa Mental
        </button>
      </div>
    </section>
  );
}

export default MindMapSection;
