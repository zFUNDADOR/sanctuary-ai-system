import React from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import python from 'react-syntax-highlighter/dist/esm/languages/hljs/python';
import html from 'react-syntax-highlighter/dist/esm/languages/hljs/xml';
import { atelierCaveDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

// Registra as linguagens para o SyntaxHighlighter
SyntaxHighlighter.registerLanguage('javascript', js);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('html', html);

// Função para detectar a linguagem do arquivo com base na extensão
const detectLanguage = (filename) => {
  if (filename.endsWith('.jsx') || filename.endsWith('.js')) return 'javascript';
  if (filename.endsWith('.py')) return 'python';
  if (filename.endsWith('.html')) return 'html';
  return 'text'; // Linguagem padrão se não for reconhecida
};

// Componente EditorDeCodigo
export default function EditorDeCodigo({ fileName, code, onChange }) {
  const language = detectLanguage(fileName);

  return (
    <div className="flex flex-col">
      {/* Rótulo do editor com o nome do arquivo */}
      <label className="text-lg mb-1">Editor — {fileName}</label>
      
      {/* Área de texto editável para o código */}
      <textarea
        value={code}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-52 font-mono bg-gray-800 text-white p-2 rounded border border-gray-700 resize-none"
        style={{ 
          overflowWrap: 'break-word', // Quebra palavras longas para evitar overflow
          whiteSpace: 'pre-wrap' // Preserva espaços em branco e quebra linhas
        }}
      />
      
      {/* Contêiner para o SyntaxHighlighter, com rolagem automática */}
      <div className="mt-2 border border-gray-700 rounded bg-black overflow-auto">
        <SyntaxHighlighter
          language={language}
          style={atelierCaveDark} // Estilo de tema para o destaque de sintaxe
          showLineNumbers={true} // Habilita a exibição dos números de linha
          wrapLines={true} // Habilita a quebra de linha automática
          className="custom-syntax-highlighter" // Adicionado um nome de classe para estilização via CSS
          
          // customStyle é aplicado à tag <pre> que envolve o código destacado
          customStyle={{
            backgroundColor: 'transparent', // Fundo transparente
            padding: '1em', // Espaçamento interno
            margin: 0, // Remove margens padrão
            width: '100%', // Garante que ocupe toda a largura disponível
            boxSizing: 'border-box', // Inclui padding e borda no cálculo da largura
            
            // Estilos CSS importantes para a quebra de linha e palavras
            whiteSpace: 'pre-wrap', // Preserva espaços em branco e quebra linhas longas
            wordBreak: 'break-all', // Força a quebra de palavras para evitar overflow horizontal
          }}
          
          // lineProps é aplicado a cada elemento <li> que representa uma linha de código
          lineProps={{
            style: {
              wordBreak: 'break-all', // Garante quebra de palavra para linhas longas
              whiteSpace: 'pre-wrap', // Garante quebra de linha
              display: 'block' // Garante que cada linha se comporte como um bloco
            }
          }}
          // Propriedade para customizar o estilo dos números de linha
          lineNumberStyle={{
            color: '#6c757d', // Cor dos números de linha (um cinza sutil)
            paddingRight: '1em', // Espaçamento à direita dos números
            userSelect: 'none', // Impede seleção do número da linha
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
