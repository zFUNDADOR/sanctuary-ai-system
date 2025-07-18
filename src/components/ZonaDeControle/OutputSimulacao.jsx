// src/components/ZonaDeControle/OutputSimulacao.jsx
import React from 'react';

export default function OutputSimulacao({ output, onSimular }) {
  return (
    <div>
      <button 
        onClick={onSimular} 
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
      >
        Iniciar Simulação
      </button>
      <div className="mt-2 bg-black text-green-400 font-mono p-3 h-32 overflow-y-auto rounded border border-gray-700">
        {output.split('\n').map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>
    </div>
  );
}
