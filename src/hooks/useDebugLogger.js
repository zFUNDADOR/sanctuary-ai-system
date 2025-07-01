// useDebugLogger.js

import { useState, useCallback } from 'react';

/**
 * Função utilitária para capturar mensagens de debug com contexto de origem (arquivo e linha).
 * Pode ser usada em qualquer componente React para logging avançado.
 */
export function addDebugMessage(message, level = 'info') {
  const stack = new Error().stack?.split('\n') || [];

  // Encontrar a primeira linha relevante no stack trace que contenha '/src/' e não seja desta função
  // Ajustamos para ser mais robusto, procurando a primeira linha que não seja do próprio useDebugLogger
  const callerLine = stack.find(
    (line) => line.includes('at') && line.includes('/src/') && !line.includes('useDebugLogger')
  );

  let fileAndLine = 'unknown';

  if (callerLine) {
    // Regex para extrair o caminho do arquivo e a linha. Pode precisar de ajuste dependendo do ambiente
    // Ex: "at Component (src/components/MyComponent.jsx:42:10)" -> src/components/MyComponent.jsx:42
    const match = callerLine.match(/(\/src\/.*?):(\d+)(?::\d+)?(?=\)|\s|$)/);
    if (match) {
      fileAndLine = `${match[1]}:${match[2]}`;
    } else {
      // Fallback para capturar a parte mais relevante se o regex principal falhar
      const simpleMatch = callerLine.match(/at\s+(?:.*?\s+\()?(.*?:\d+:\d+)\)?/);
      if (simpleMatch) {
        fileAndLine = simpleMatch[1].replace(/:(\d+)$/, ''); // Remove a coluna se presente
        if (!fileAndLine.includes('/src/')) {
          // Se o fallback não apontar para src/, ainda tentar extrair algo útil
          const parts = fileAndLine.split('/');
          fileAndLine = parts.length > 2 ? parts.slice(-2).join('/') : fileAndLine;
        }
      }
    }
  }

  return {
    message,
    timestamp: new Date(),
    level,
    fileAndLine,
    id: crypto.randomUUID?.() || Math.random().toString(36).slice(2), // ID único para renderização eficiente
  };
}

/**
 * Hook personalizado que encapsula o estado de logs e fornece funções para adicionar,
 * limpar e exportar mensagens de depuração.
 */
export function useDebugLogger() {
  const [logs, setLogs] = useState([]);

  // Função para adicionar um novo log
  const log = useCallback((message, level = 'info') => {
    const logEntry = addDebugMessage(message, level);
    setLogs((prevLogs) => {
      const newLogs = [...prevLogs, logEntry];
      // Limita o número de logs para evitar sobrecarga na UI e memória
      return newLogs.length > 200 ? newLogs.slice(newLogs.length - 200) : newLogs;
    });
  }, []);

  // Função para limpar todos os logs
  const clearLogs = useCallback(() => setLogs([]), []);

  // Função para exportar os logs para um arquivo JSON
  const exportLogs = useCallback(() => {
    const data = logs.map((log) => ({
      ...log,
      timestamp: log.timestamp.toISOString(), // Converte a data para string ISO para JSON
    }));
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `debug-logs-${Date.now()}.json`; // Nome do arquivo com timestamp
    document.body.appendChild(a); // Necessário para Firefox
    a.click();
    document.body.removeChild(a); // Limpeza
    URL.revokeObjectURL(url); // Libera o objeto URL
  }, [logs]);

  return { logs, log, clearLogs, exportLogs };
}
