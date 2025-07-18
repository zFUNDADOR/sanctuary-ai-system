// src/components/ZonaDeControle/PainelFlaskSimulado.jsx
import React, { useState } from 'react';
import { simularRequisicaoFlask } from './flaskSimulado';

export default function PainelFlaskSimulado() {
  const [metodo, setMetodo] = useState('GET');
  const [endpoint, setEndpoint] = useState('/api/status');
  const [corpo, setCorpo] = useState('');
  const [resposta, setResposta] = useState(null);
  const [loading, setLoading] = useState(false);

  const enviarRequisicao = async () => {
    setLoading(true);
    let dados = null;
    try {
      dados = corpo ? JSON.parse(corpo) : null;
    } catch {
      // Substituído alert() por um console.error ou mensagem na UI se necessário
      console.error('JSON inválido no corpo da requisição.');
      setLoading(false);
      return;
    }
    const res = await simularRequisicaoFlask(metodo, endpoint, dados);
    setResposta(res);
    setLoading(false);
  };

  return (
    <div className="bg-gray-800 p-4 rounded border border-gray-700 mt-4">
      <h2 className="text-lg font-semibold mb-2">Simulação Backend Flask</h2>
      <div className="flex gap-2 mb-2">
        <select
          value={metodo}
          onChange={(e) => setMetodo(e.target.value)}
          className="bg-gray-700 text-white p-1 rounded"
        >
          <option>GET</option>
          <option>POST</option>
          <option>PUT</option>
          <option>DELETE</option>
        </select>
        <input
          type="text"
          value={endpoint}
          onChange={(e) => setEndpoint(e.target.value)}
          placeholder="/api/status"
          className="flex-1 bg-gray-700 text-white p-1 rounded"
        />
      </div>
      {(metodo === 'POST' || metodo === 'PUT') && (
        <textarea
          rows={4}
          value={corpo}
          onChange={(e) => setCorpo(e.target.value)}
          placeholder='JSON corpo da requisição'
          className="w-full bg-gray-700 text-white p-2 rounded mb-2 font-mono"
        />
      )}
      <button
        onClick={enviarRequisicao}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
      >
        {loading ? 'Enviando...' : 'Enviar Requisição'}
      </button>
      {resposta && (
        <pre className="mt-2 bg-black p-3 rounded text-green-400 font-mono">
          Status: {resposta.status}
          <br />
          {typeof resposta.data === 'string' ? resposta.data : JSON.stringify(resposta.data, null, 2)}
        </pre>
      )}
    </div>
  );
}
