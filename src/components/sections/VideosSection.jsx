import React from 'react';

function VideosSection({ sectionBgColor }) { 
  return (
    <section className="p-4">
      <h2 className="text-3xl font-bold text-white mb-4">Análise de Vídeos</h2>
      <p className="text-gray-300 mb-6">
        Gerencie e otimize seus vídeos para maior engajamento e alcance.
      </p>
      <div className="p-4 rounded-lg shadow-md" style={{ backgroundColor: sectionBgColor }}>
        <h3 className="text-xl font-semibold text-white mb-3">
          Upload ou Link de Vídeo
        </h3>
        <p className="text-gray-400 mb-4">
          Cole a URL de um vídeo ou faça upload para análise de transcrição e conteúdo.
        </p>
        <input
          type="text"
          placeholder="Cole a URL do vídeo aqui..."
          className="w-full p-3 rounded-md bg-gray-800 text-gray-200 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        ></input>
        <button className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300">
          Analisar Vídeo
        </button>
      </div>
    </section>
  );
}

export default VideosSection;
