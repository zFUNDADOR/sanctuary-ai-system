import React, { useState, useRef } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const BACKEND_URL = 'http://127.0.0.1:5000/api/analisar-seo'; 

function SeoSection({ sectionBgColor }) { 
  const [fileContent, setFileContent] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null); 
  const [seoAnalysisData, setSeoAnalysisData] = useState(null);
  const [message, setMessage] = useState(''); 
  const [messageType, setMessageType] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      setMessage(''); 
      setMessageType('');
      const reader = new FileReader();
      reader.onload = (e) => {
        setFileContent(e.target.result);
      };
      reader.readAsText(file);
    } else {
      setFileContent(null);
      setFileName('');
      setSeoAnalysisData(null);
      setMessage('');
      setMessageType('');
    }
  };

  const handleProcessFile = async () => {
    if (!fileContent) {
      setMessage("Por favor, selecione um arquivo para processar.");
      setMessageType("error");
      return;
    }

    setIsLoading(true);
    setMessage(""); 
    setMessageType("");
    setSeoAnalysisData(null); 

    try {
      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: fileContent }), 
      });

      const data = await response.json(); 

      if (!response.ok) {
        throw new Error(data.error || `Erro de rede ou servidor: ${response.status}`);
      }

      setSeoAnalysisData(data); 
      setMessage("Análise de SEO concluída com sucesso!");
      setMessageType("success");

    } catch (error) {
      console.error("Erro ao processar arquivo:", error);
      setMessage(`Erro ao processar o arquivo: ${error.message}. Verifique o console para mais detalhes.`);
      setMessageType("error");
      setSeoAnalysisData(null); 
    } finally {
      setIsLoading(false); 
    }
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#eceff4', 
          font: {
            size: 14
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== null) {
              label += context.parsed + '%';
            }
            return label;
          }
        }
      },
      title: {
        display: true,
        text: 'Distribuição de Palavras-Chave Principais',
        color: '#eceff4', 
        font: {
          size: 18
        }
      }
    }
  };

  return (
    <section className="p-4"> 
      <h2 className="text-3xl font-bold text-white mb-4">Conteúdo de SEO</h2>
      <p className="text-gray-300 mb-6">
        Aqui você pode exibir métricas, análises de palavras-chave e otimizações de SEO.
      </p>

      <div className="p-4 rounded-lg shadow-md" style={{ backgroundColor: sectionBgColor }}>
        <h3 className="text-xl font-semibold text-white mb-3">Análise de Conteúdo SEO com Infográficos</h3>
        <p className="text-gray-400 mb-4">Faça upload de um arquivo de texto (.txt, .csv, etc.) para simular a análise e visualizar infográficos de dados.</p>

        {/* Seletor de Arquivo */}
        <div className="mb-5 flex items-center">
          <label htmlFor="file-upload" className="px-5 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700 transition duration-300">
            Escolher Arquivo
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".txt,.csv,.json,.md"
            onChange={handleFileChange}
            ref={fileInputRef} 
            className="hidden" 
          />
          {fileName && <span className="ml-3 text-gray-300">Arquivo selecionado: <span className="font-bold">{fileName}</span></span>}
        </div>

        {/* Pré-visualização do Conteúdo do Arquivo e Botão de Processar */}
        {fileContent && (
          <div className="mt-4 p-4 bg-gray-800 rounded-lg shadow-md">
            <h4 className="text-lg font-semibold text-gray-200 mb-2">Pré-visualização do Conteúdo (500 primeiros caracteres):</h4>
            <pre className="p-3 bg-gray-900 rounded-md max-h-40 overflow-y-auto text-sm text-gray-300 whitespace-pre-wrap break-words">{fileContent.substring(0, 500)}...</pre>
            <button
              onClick={handleProcessFile}
              disabled={isLoading}
              className={`mt-4 px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Processando Análise...' : 'Processar Arquivo para Análise'}
            </button>
          </div>
        )}

        {/* Mensagens de status (carregamento, sucesso, erro) */}
        {isLoading && (
          <p className="text-blue-400 mt-5 text-lg font-semibold">Analisando dados do arquivo...</p>
        )}

        {message && (
          <div className={`mt-5 p-3 rounded-md ${messageType === 'error' ? 'bg-red-800 text-red-100' : 'bg-green-800 text-green-100'}`}>
            {message}
          </div>
        )}

        {/* Exibição dos Infográficos de SEO */}
        {seoAnalysisData && (
          <div className="mt-6 flex flex-wrap justify-around gap-6 w-full">
            {/* Gráfico de Pizza */}
            <div className="flex-1 min-w-[320px] bg-gray-700 p-6 rounded-lg shadow-xl flex flex-col items-center justify-center">
              <Pie data={seoAnalysisData.keywordDistribution} options={pieOptions} />
            </div>

            {/* Métricas Principais */}
            <div className="flex-1 min-w-[320px] bg-gray-700 p-6 rounded-lg shadow-xl flex flex-col items-center justify-start">
              <h4 className="text-xl font-semibold text-gray-200 mb-4">Métricas Principais de Análise:</h4>
              <table className="w-11/12 border-collapse text-gray-200 mt-2">
                <tbody>
                  {seoAnalysisData.keyMetrics.map((metric, index) => (
                    <tr key={index} className="border-b border-gray-600 last:border-b-0">
                      <td className="py-2 px-1 text-left font-semibold">{metric.label}:</td>
                      <td className="py-2 px-1 text-right">{metric.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-sm text-gray-400 mt-4 text-center">*Dados gerados pelo backend Python.</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default SeoSection;
