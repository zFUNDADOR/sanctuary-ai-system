import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

function ControlZone({ addDebugMessage }) {
  const { currentTheme } = useTheme();
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Simulação de "núcleos" locais para prompts da Zona de Controle
  const localNuclei = {
    codeAssistancePrompt: `Você é um assistente de programação experiente e prestativo, focado em ajudar a entender, refatorar e depurar código.
    Receberá um trecho de código e uma solicitação específica. Forneça uma resposta clara e concisa.
    
    Exemplos de solicitações:
    - "Explique este código."
    - "Refatore este código para ser mais eficiente."
    - "Encontre erros neste código."
    - "Converta este código para Python."
    
    Agora, analise o seguinte código e solicitação:`,
  };

  const executeCode = async () => {
    if (!code.trim()) {
      setOutput('Por favor, insira um código para executar.');
      addDebugMessage('Tentativa de execução com código vazio.', 'warn');
      return;
    }

    setIsLoading(true);
    setOutput('Executando código...');
    addDebugMessage('Iniciando execução de código...', 'info');

    try {
      // Simulação de execução de código JavaScript
      // ATENÇÃO: Executar código arbitrário do usuário diretamente em um ambiente real
      // pode ser um risco de segurança. Aqui é apenas uma simulação controlada.
      const result = await new Promise((resolve) => {
        try {
          // Cria uma função para executar o código em um escopo isolado
          const func = new Function(code);
          let consoleOutput = '';
          const originalConsoleLog = console.log;
          // Redireciona console.log para capturar a saída
          console.log = (...args) => {
            consoleOutput += args.map(String).join(' ') + '\n';
            originalConsoleLog(...args); // Ainda loga no console real do navegador
          };

          func(); // Executa o código
          console.log = originalConsoleLog; // Restaura console.log
          resolve(`Execução Concluída:\n${consoleOutput || 'Nenhuma saída no console.'}`);
        } catch (error) {
          resolve(`Erro de Execução:\n${error.message}`);
        }
      });
      setOutput(result);
      addDebugMessage('Execução de código simulada com sucesso.', 'success');
    } catch (error) {
      setOutput(`Erro inesperado na simulação: ${error.message}`);
      addDebugMessage(`Erro inesperado na simulação: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const requestCodeAssistance = async () => {
    if (!code.trim()) {
      setOutput('Por favor, insira um código para solicitar assistência.');
      addDebugMessage('Tentativa de assistência com código vazio.', 'warn');
      return;
    }

    setIsLoading(true);
    setOutput('Solicitando assistência de código...');
    addDebugMessage('Solicitando assistência de código...', 'info');

    try {
      // Simulação de chamada à API Gemini para assistência de código
      // Em um cenário real, você faria uma chamada fetch para o Gemini API aqui.
      // Exemplo de como seria a chamada (mantendo apiKey vazia para o ambiente Canvas):
      const prompt = `Analise o seguinte código JavaScript e forneça sugestões de melhoria, explique seu funcionamento ou corrija erros:\n\n\`\`\`javascript\n${code}\n\`\`\``;
      let chatHistory = [];
      chatHistory.push({ role: "user", parts: [{ text: prompt }] });
      const payload = { contents: chatHistory };
      const apiKey = ""; // Deixe vazio para o ambiente Canvas
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        const text = result.candidates[0].content.parts[0].text;
        setOutput(`Assistência do Gemini AI:\n${text}`);
        addDebugMessage('Assistência de código do Gemini AI recebida.', 'success');
      } else {
        setOutput('Não foi possível obter assistência do Gemini AI.');
        addDebugMessage('Resposta inesperada da API Gemini.', 'error');
      }
    } catch (error) {
      setOutput(`Ocorreu um erro ao solicitar assistência: ${error.message}`);
      addDebugMessage(`Erro ao chamar API Gemini: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="p-8 rounded-xl shadow-2xl text-center max-w-5xl w-full mx-auto my-8 border border-gray-700" style={{ backgroundColor: currentTheme.internalBg }}>
      <h2 className="text-4xl font-extrabold text-white mb-4">Aquário: Editor e Simulador de Código</h2>
      <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
        Insira código JavaScript para emular sua saída ou solicitar assistência do Gemini API.
      </p>

      <div className="mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">Seu código para testar:</h3>
        <textarea
          className="w-full p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:ring-blue-500 focus:border-blue-500 h-60 font-mono"
          placeholder="Escreva seu código JavaScript aqui..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
        ></textarea>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <button
          onClick={executeCode}
          className={`flex-1 py-3 rounded-md font-semibold transition duration-300 ${isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'} text-white`}
          disabled={isLoading}
        >
          {isLoading ? 'Executando...' : 'Executar Código'}
        </button>
        <button
          onClick={requestCodeAssistance}
          className={`flex-1 py-3 rounded-md font-semibold transition duration-300 ${isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-yellow-600 hover:bg-yellow-700'} text-white`}
          disabled={isLoading}
        >
          {isLoading ? 'Solicitando...' : 'Obter Assistência de Código (Gemini API)'}
        </button>
      </div>

      {output && (
        <div className="mt-4 p-4 bg-gray-800 rounded-md text-gray-200 text-left whitespace-pre-wrap font-mono">
          <h3 className="text-xl font-bold text-white mb-2">Saída/Resultado:</h3>
          {output}
        </div>
      )}

      <div className="mt-8 p-6 text-center text-gray-300 border-t border-gray-700 pt-6">
        <p className="text-sm">
          "A inovação é a arte de transformar o impossível em realidade." - Aquário AI
        </p>
      </div>
    </section>
  );
}

export default ControlZone;
