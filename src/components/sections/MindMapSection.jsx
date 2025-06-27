import React, { useState, useCallback, useEffect } from 'react';
import { Tree } from 'react-d3-tree';

function MindMapSection() {
  const [inputText, setInputText] = useState('');
  const [mindMapData, setMindMapData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const BACKEND_URL = '/api/gerar-mapa-mental';

  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });
  const [translateState, setTranslateState] = useState({ x: 0, y: 0 });
  const [zoomState, setZoomState] = useState(0.8);

  const [selectedNode, setSelectedNode] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Ref para o elemento wrapper da árvore
  const treeWrapperRef = useCallback(node => {
    if (node !== null) {
      const observer = new ResizeObserver(() => {
        const newWidth = node.offsetWidth;
        const newHeight = node.offsetHeight;
        setDimensions({
          width: newWidth,
          height: newHeight,
        });
        // Recalcular translate para centralizar após redimensionamento
        setTranslateState({
          x: newWidth / 8, // Ajuste para o nó raiz aparecer mais à esquerda
          y: newHeight / 2, // Centraliza verticalmente
        });
      });
      observer.observe(node);
      return () => observer.disconnect();
    }
  }, []);

  // UseEffect para definir as dimensões iniciais ao carregar o componente
  useEffect(() => {
    if (treeWrapperRef.current) {
      const initialWidth = treeWrapperRef.current.offsetWidth;
      const initialHeight = treeWrapperRef.current.offsetHeight;
      setDimensions({
        width: initialWidth,
        height: initialHeight,
      });
      setTranslateState({
        x: initialWidth / 8,
        y: initialHeight / 2,
      });
    }
  }, [treeWrapperRef]);


  const mindMaps = [
    { id: 1, title: 'Ideias para o Projeto JARVIS' },
    { id: 2, title: 'Estrutura do Dashboard' },
  ];

  const handleNewMindMap = () => {
    alert('Função "Novo Mapa Mental" ainda a ser implementada com editor!');
    setMindMapData(null);
    setInputText('');
    setSelectedNode(null); // Limpa o nó selecionado ao criar um novo mapa
    setIsSidebarOpen(false); // Fecha a barra lateral
  };

  const handleLoadMindMap = () => {
    alert('Função "Carregar Mapa Mental Existente" ainda a ser implementada com backend real!');
  };

  const handleGenerateMindMap = async () => {
    if (!inputText.trim()) {
      alert("Por favor, digite algum texto para gerar o mapa mental.");
      return;
    }

    setIsLoading(true);
    setSelectedNode(null); // Limpa o nó selecionado
    setIsSidebarOpen(false); // Fecha a barra lateral

    try {
      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: inputText }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Resposta não JSON ou vazia.' }));
        throw new Error(errorData.error || `Erro do servidor: ${response.status}`);
      }

      const data = await response.json();

      // Função recursiva para formatar e adicionar a propriedade 'collapsed'
      const formatNode = (node) => ({
          name: node.node,
          attributes: {
              influence_score: node.influence_score
          },
          // Se o nó tiver filhos do LLM, inicia não colapsado.
          // O react-d3-tree usa _collapsed internamente quando você clica em um nó
          // mas para controle via estado, usamos 'collapsed'.
          collapsed: false, // Define todos os nós como não colapsados inicialmente
          children: node.children ? node.children.map(formatNode) : undefined
      });

      const formattedData = formatNode(data);
      setMindMapData(formattedData);

    } catch (error) {
      console.error("Erro ao gerar mapa mental:", error);
      alert(`Erro ao gerar o mapa mental: ${error.message}. Verifique o console para mais detalhes.`);
      setMindMapData(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Lida com o clique no nó, abre a barra lateral e define o nó selecionado
  const handleTreeClick = useCallback((nodeDatum) => {
    setSelectedNode(nodeDatum);
    setIsSidebarOpen(true);
    console.log("Nó clicado:", nodeDatum.name, "Score:", nodeDatum.attributes?.influence_score);
  }, []);

  // Função para fechar a barra lateral
  const closeSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedNode(null);
  };

  // Funções de controle de zoom e translação (agora manipulando o estado diretamente)
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

  // NOVO: Função auxiliar recursiva para encontrar e atualizar o estado 'collapsed' de um nó
  const updateNodeCollapsedState = useCallback((nodes, targetNodeName, isCollapsed) => {
    return nodes.map(node => {
      if (node.name === targetNodeName) {
        // Altera o estado 'collapsed' do nó
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

  // NOVO: Função para expandir/colapsar nó via barra lateral
  const handleToggleNodeChildren = (nodeToToggle) => {
    if (!mindMapData || !nodeToToggle) return;

    // A lógica de colapsar/expandir é feita alterando a propriedade 'collapsed'
    // no nosso estado `mindMapData`. O react-d3-tree irá reagir a isso.
    const newMindMapData = updateNodeCollapsedState(
      [mindMapData], // Passa a raiz da árvore como um array
      nodeToToggle.name,
      !nodeToToggle.collapsed // Inverte o estado atual de colapso
    )[0]; // Pega o primeiro elemento do array de volta

    setMindMapData(newMindMapData);

    // Atualiza o nó selecionado na sidebar para refletir o novo estado de colapso
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
    const influenceScore = nodeDatum.attributes?.influence_score || 0.1;
    const nodeRadius = 10 + (influenceScore * 20);
    const nodeFillColor = `hsl(200, ${50 + (influenceScore * 50)}%, ${40 + (influenceScore * 30)}%)`; 
    const textColor = '#eceff4'; 
    const fontSize = `${0.6 + (influenceScore * 0.5)}em`; 

    return (
      <g onClick={(e) => { 
        toggleNode(); // Permite expandir/colapsar ao clicar diretamente no nó
        handleTreeClick(nodeDatum); // Define o nó selecionado para a sidebar
        e.stopPropagation(); // Impede que o clique se propague para o wrapper da árvore
      }}>
        <circle 
          r={nodeRadius} 
          fill={nodeFillColor}
          stroke="#4c566a" 
          strokeWidth={2} 
        />
        <foreignObject
          x={-(nodeRadius * 1.2)}
          y={-(nodeRadius * 0.6)}
          width={nodeRadius * 2.4}
          height={nodeRadius * 1.2}
        >
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            overflow: 'hidden',
            wordBreak: 'break-word',
            textAlign: 'center',
            color: textColor,
            fontSize: fontSize,
            fontWeight: 'bold',
            textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
            padding: '2px'
          }}>
            {nodeDatum.name}
          </div>
        </foreignObject>
      </g>
    );
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: 'auto', position: 'relative' }}>
      <h2 style={{ color: '#eceff4', marginBottom: '20px', textAlign: 'center' }}>
        Seção de MAPA MENTAL
      </h2>
      <p style={{ color: '#d8dee9', textAlign: 'center', marginBottom: '30px' }}>
        Explore suas ideias e conceitos de forma visual. Digite um texto para gerar um mapa mental com inteligência de LLM.
      </p>

      <div className="section-content-box" style={{ background: '#3b4252', padding: '25px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}>
        <h3 style={{ color: '#eceff4', marginBottom: '15px' }}>Gerar Novo Mapa Mental</h3>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Digite o texto para gerar o mapa mental..."
          rows="8"
          style={{
            width: 'calc(100% - 20px)',
            padding: '10px',
            marginBottom: '15px',
            borderRadius: '4px',
            border: '1px solid #4c566a',
            backgroundColor: '#2e3440',
            color: '#eceff4',
            fontSize: '1em',
            resize: 'vertical'
          }}
        ></textarea>

        <button
          onClick={handleGenerateMindMap}
          disabled={isLoading}
          style={{
            padding: '10px 20px',
            backgroundColor: isLoading ? '#4c566a' : '#88c0d0',
            color: '#2e3440',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '1em',
            fontWeight: 'bold',
            transition: 'background-color 0.3s ease'
          }}
        >
          {isLoading ? 'Gerando...' : 'Gerar Mapa Mental'}
        </button>

        {/* Visualização do Mapa Mental Gerado */}
        {mindMapData && (
          <div style={{ marginTop: '30px', background: '#2e3440', borderRadius: '8px', border: '1px solid #4c566a', overflow: 'hidden' }}>
            <h3 style={{ color: '#88c0d0', marginBottom: '10px', padding: '15px', borderBottom: '1px solid #4c566a' }}>Visualização do Mapa Mental:</h3>
            <div id="treeWrapper" ref={treeWrapperRef} style={{ width: '100%', height: '500px', margin: 'auto', background: '#2e3440', position: 'relative' }}>
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
                // onNodeToggle é importante para atualizar o estado `collapsed` do nó no nosso `mindMapData`
                onNodeToggle={nodeDatum => {
                    // Atualiza o estado global do mapa mental para refletir o colapso/expansão
                    handleToggleNodeChildren(nodeDatum); // Usa a mesma função para atualizar o estado
                }}
              />
              {/* Controles de Zoom/Pan DENTRO da área do mapa */}
              <div style={{ 
                  position: 'absolute', 
                  bottom: '15px', 
                  right: '15px', // Colocado à direita para melhor visual
                  display: 'flex', 
                  flexDirection: 'column', // Empilha os botões
                  gap: '10px',
                  zIndex: 10 
              }}>
                  <button onClick={handleZoomIn} style={controlButtonStyle}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="11" cy="11" r="8"></circle>
                          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                          <line x1="11" y1="8" x2="11" y2="14"></line>
                          <line x1="8" y1="11" x2="14" y2="11"></line>
                      </svg>
                  </button>
                  <button onClick={handleZoomOut} style={controlButtonStyle}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="11" cy="11" r="8"></circle>
                          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                          <line x1="8" y1="11" x2="14" y2="11"></line>
                      </svg>
                  </button>
                  <button onClick={handleResetZoomPan} style={controlButtonStyle}>
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
          <div style={{
            position: 'fixed', 
            top: 0,
            right: 0,
            width: '300px',
            height: '100%',
            background: '#2e3440',
            color: '#eceff4',
            padding: '20px',
            boxShadow: '-2px 0 10px rgba(0,0,0,0.5)',
            zIndex: 100, 
            overflowY: 'auto'
          }}>
            <button 
              onClick={closeSidebar} 
              style={{ 
                position: 'absolute', 
                top: '10px', 
                right: '10px', 
                background: 'none', 
                border: 'none', 
                color: '#88c0d0', 
                fontSize: '1.5em', 
                cursor: 'pointer' 
              }}>
                &times;
            </button>
            <h3 style={{ color: '#88c0d0', marginBottom: '20px' }}>Detalhes do Nó</h3>
            <p><span style={{ fontWeight: 'bold', color: '#a3be8c' }}>Nome:</span> {selectedNode.name}</p>
            <p><span style={{ fontWeight: 'bold', color: '#a3be8c' }}>Score de Influência:</span> {selectedNode.attributes?.influence_score}</p>
            {/* Mostra o estado de colapso - usa 'collapsed' da nossa estrutura de dados */}
            <p><span style={{ fontWeight: 'bold', color: '#a3be8c' }}>Estado:</span> {selectedNode.collapsed ? 'Colapsado' : 'Expandido'}</p>
            <p><span style={{ fontWeight: 'bold', color: '#a3be8c' }}>Número de Filhos:</span> {selectedNode.children ? selectedNode.children.length : 0}</p>

            <h4 style={{ color: '#88c0d0', marginTop: '20px', marginBottom: '10px' }}>Ações:</h4>
            {/* Botão de Expandir/Colapsar Filhos, agora usa 'selectedNode.collapsed' */}
            {selectedNode.children !== undefined || (selectedNode.attributes && selectedNode.attributes.hasOwnProperty('originalChildren') && selectedNode.attributes.originalChildren) ? (
                <button 
                    onClick={() => handleToggleNodeChildren(selectedNode)} 
                    style={buttonStyle}
                >
                    {selectedNode.collapsed ? 'Expandir Filhos' : 'Colapsar Filhos'}
                </button>
            ) : null}
            {/* Outras ações futuras aqui */}
            <button onClick={() => alert(`Editar conteúdo de "${selectedNode.name}" futuro`)} style={{ ...buttonStyle, marginTop: '10px' }}>
                Editar Nó
            </button>
          </div>
        )}

        {/* Seção de Mapas Mentais Salvos (mantida do seu código original) */}
        <h3 style={{ color: '#eceff4', marginTop: '40px', marginBottom: '15px' }}>Os seus Mapas Mentais Salvos</h3>
        {mindMaps.length > 0 ? (
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {mindMaps.map(mindMap => (
              <li key={mindMap.id} style={{ marginBottom: '10px' }}>
                <span style={{ color: '#d8dee9' }}>{mindMap.title}</span>
                <button
                  onClick={() => alert(`Abrir mapa mental: ${mindMap.title}`)}
                  style={{
                    marginLeft: '15px',
                    padding: '5px 10px',
                    backgroundColor: '#4c566a',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    fontSize: '0.8em',
                    transition: 'background-color 0.2s ease'
                  }}
                >
                  Abrir
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: '#d8dee9' }}>Nenhum mapa mental criado ainda.</p>
        )}
        <button
          onClick={handleNewMindMap}
          style={{
            padding: '8px 15px',
            backgroundColor: '#5e81ac',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '10px',
            transition: 'background-color 0.2s ease'
          }}
        >
          Novo Mapa Mental (Limpar)
        </button>
        <button
          onClick={handleLoadMindMap}
          style={{
            padding: '8px 15px',
            backgroundColor: '#5e81ac',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '10px',
            marginLeft: '10px',
            transition: 'background-color 0.2s ease'
          }}
        >
          Carregar Mapa Mental
        </button>
      </div>
    </div>
  );
}

// Estilo de botão base para reutilização
const buttonStyle = {
    padding: '8px 15px',
    backgroundColor: '#5e81ac', 
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9em',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease'
};

// Estilo para os botões de controle de zoom/pan (separado para clareza)
const controlButtonStyle = {
    background: '#4c566a', // Cor para os controles de mapa
    color: '#eceff4',
    border: 'none',
    borderRadius: '8px', // Mais arredondado para um visual de botão flutuante
    cursor: 'pointer',
    fontSize: '0.9em',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
    boxShadow: '0 4px 8px rgba(0,0,0,0.4)', // Sombra para destaque
    display: 'flex', // Para centralizar o SVG
    justifyContent: 'center',
    alignItems: 'center',
    width: '40px', // Tamanho fixo para os botões de ícone
    height: '40px',
    padding: '0' // Remove padding extra
};

export default MindMapSection;
