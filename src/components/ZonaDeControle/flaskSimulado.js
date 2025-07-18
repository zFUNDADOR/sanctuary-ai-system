// src/components/ZonaDeControle/flaskSimulado.js
export function simularRequisicaoFlask(metodo, endpoint, dados = null) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (metodo === 'GET' && endpoint === '/api/status') {
        resolve({ status: 200, data: 'Backend Flask rodando normalmente.' });
      } else if (metodo === 'POST' && endpoint === '/api/enviar') {
        resolve({ status: 201, data: { mensagem: 'Dados recebidos com sucesso.', recebidos: dados } });
      } else {
        resolve({ status: 404, data: 'Endpoint não encontrado no backend simulado.' });
      }
    }, 800);
  });
}
