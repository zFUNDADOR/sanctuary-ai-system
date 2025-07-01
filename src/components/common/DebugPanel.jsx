// src/components/common/DebugPanel.jsx

import React from 'react';

export default function DebugPanel({ logs, onClose, onClear, onExport }) {
  return (
    // Posição alterada para 'bottom-4 left-4' para não conflitar com botões à direita no cabeçalho
    // e com o painel de debug à direita.
    <div className="fixed bottom-4 left-4 w-96 bg-gray-900 text-white p-4 overflow-y-auto h-96 rounded-xl shadow-2xl flex flex-col z-50 border border-gray-700">
      <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
        <h2 className="text-xl font-bold">Debug Logs</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-200 text-2xl font-bold leading-none"
          aria-label="Fechar Painel de Debug"
        >
          &times;
        </button>
      </div>
      
      <div className="flex gap-2 mb-4">
        <button
          onClick={onClear}
          className="flex-1 px-3 py-2 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 transition duration-300 text-sm"
        >
          Limpar Logs
        </button>
        <button
          onClick={onExport}
          className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition duration-300 text-sm"
        >
          Exportar Logs
        </button>
      </div>

      <ul className="space-y-2 text-sm flex-grow overflow-y-auto pr-2 custom-scrollbar">
        {logs.length === 0 ? (
          <li className="text-gray-500 text-center py-4">Nenhum log para exibir.</li>
        ) : (
          logs.map((log) => (
            <li key={log.id} className="border-b border-gray-700 pb-1 last:border-b-0">
              <p className="text-white break-words">{log.message}</p>
              <p className="text-gray-400 text-xs mt-0.5">
                {log.timestamp.toLocaleTimeString()} — <span className="italic">{log.fileAndLine}</span>
              </p>
            </li>
          ))
        )}
      </ul>

      {/* Estilo para a scrollbar customizada */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #374151; /* gray-700 */
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #6b7280; /* gray-500 */
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af; /* gray-400 */
        }
      `}</style>
    </div>
  );
}
