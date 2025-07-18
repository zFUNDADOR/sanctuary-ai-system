// src/components/ZonaDeControle/simulador.js
export default function simulateCode(fileName, code) {
  // Simula a saída de execução ou análise do código conforme a extensão
  if (fileName.endsWith('.jsx') || fileName.endsWith('.js')) {
    if (code.includes('return')) {
      return `Simulação: React componente renderizado com sucesso.`;
    }
    return 'Simulação: Código JavaScript/JSX analisado.';
  }

  if (fileName.endsWith('.py')) {
    if (code.includes('Flask')) {
      return `Simulação: Flask rodando na porta 5000.`;
    }
    return 'Simulação: Código Python analisado.';
  }

  if (fileName.endsWith('.txt') || fileName.endsWith('.md')) {
    return `Simulação: Visualização do arquivo de texto.`;
  }

  return `Simulação: Arquivo ${fileName} processado.`;
}
