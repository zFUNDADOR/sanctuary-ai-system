import React, { useState, useRef } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

// ** IMPORTANTE **
// No Replit, a porta do backend Python (5000) é exposta em uma URL diferente.
// Geralmente, é a mesma base URL do seu Replit, mas com a porta 5000.
// Você pode verificar a URL do seu backend na aba "Console" ou "Shell" do Replit
// quando o Flask iniciar (deve aparecer algo como "Running on http://0.0.0.0:5000").
// A URL real para o frontend será algo como: https://[SEU_REPLIT_ID].janeway.replit.dev:5000
// Ou apenas a base URL se o Replit fizer o proxy automático para /api
// Para simplificar no Replit, muitas vezes basta usar a porta 5000 ou o proxy que ele oferece.
// Para testar, vamos usar a URL do próprio Replit com a porta 5000.
// Procure no console do Replit a mensagem "Running on http://0.0.0.0:5000" do Flask.
// A URL completa será algo como: https://[SEU_NOME_DO_REPLIT].[SEU_USER].replit.dev:5000/api/analisar-seo
// OU, mais simples, se o Replit fizer o proxy, apenas '/api/analisar-seo'
// Vamos tentar com o caminho relativo primeiro, que é mais robusto no Replit se ele fizer o proxy.
const BACKEND_URL = '/api/analisar-seo'; // Replit costuma fazer proxy para /api

function SEOSection() {
  const [fileContent, setFileContent] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileReader = useRef(null);
  const [seoAnalysisData, setSeoAnalysisData] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      fileReader.current = new FileReader();
      fileReader.current.onload = (e) => {
        setFileContent(e.target.result);
      };
      fileReader.current.readAsText(file);
    } else {
      setFileContent(null);
      setFileName('');
      setSeoAnalysisData(null);
    }
  };

  const handleProcessFile = async () => { // Adicione 'async' aqui
    if (!fileContent) {
      alert("Por favor, selecione um arquivo para processar.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: fileContent }), // Envia o conteúdo do arquivo para o backend
      });

      if (!response.ok) {
        // Se a resposta não for OK (ex: 400, 500), lança um erro
        const errorData = await response.json();
        throw new Error(errorData.error || `Erro de rede ou servidor: ${response.status}`);
      }

      const data = await response.json(); // Pega a resposta JSON do backend
      setSeoAnalysisData(data); // Define os dados recebidos para os infográficos

    } catch (error) {
      console.error("Erro ao processar arquivo:", error);
      alert(`Erro ao processar o arquivo: ${error.message}. Verifique o console para mais detalhes.`);
      setSeoAnalysisData(null); // Limpa dados em caso de erro
    } finally {
      setIsLoading(false); // Sempre desativa o carregamento no final
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
    <div>
      <h3>Análise de Conteúdo SEO com Infográficos</h3>
      <p>Faça upload de um arquivo de texto (.txt, .csv, etc.) para simular a análise e visualizar infográficos de dados.</p>

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="file-upload" className="custom-file-upload">
          Escolher Arquivo
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".txt,.csv,.json,.md"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        {fileName && <span style={{ marginLeft: '10px', color: '#eceff4' }}>Arquivo selecionado: **{fileName}**</span>}
      </div>

      {fileContent && (
        <div className="file-content-preview">
          <h4>Pré-visualização do Conteúdo (500 primeiros caracteres):</h4>
          <pre>{fileContent.substring(0, 500)}...</pre>
          <button onClick={handleProcessFile} disabled={isLoading} style={{ marginTop: '15px' }}>
            {isLoading ? 'Processando Análise...' : 'Processar Arquivo para Análise'}
          </button>
        </div>
      )}

      {isLoading && <p style={{ color: '#88c0d0', marginTop: '20px', fontSize: '1.1em' }}>**Analisando dados do arquivo...**</p>}

      {seoAnalysisData && (
        <div style={{
          marginTop: '30px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-around',
          gap: '25px',
          width: '100%'
        }}>
          <div style={{
            flex: '1 1 45%',
            minWidth: '320px',
            backgroundColor: 'var(--section-background-color)',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 4px 10px var(--dashboard-darker-color)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            {/* O componente Pie agora recebe dados do backend */}
            <Pie data={seoAnalysisData.keywordDistribution} options={pieOptions} />
          </div>

          <div style={{
            flex: '1 1 45%',
            minWidth: '320px',
            backgroundColor: 'var(--section-background-color)',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 4px 10px var(--dashboard-darker-color)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center'
          }}>
            <h4>Métricas Principais de Análise:</h4>
            <table style={{ width: '90%', borderCollapse: 'collapse', color: '#eceff4', marginTop: '10px' }}>
              <tbody>
                {seoAnalysisData.keyMetrics.map((metric, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid var(--dashboard-lighter-color, rgba(200,200,200,0.3))' }}>
                    <td style={{ padding: '10px 5px', textAlign: 'left', fontWeight: 'bold' }}>{metric.label}:</td>
                    <td style={{ padding: '10px 5px', textAlign: 'right' }}>{metric.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ fontSize: '0.85em', color: '#b48ead', marginTop: '20px' }}>*Dados gerados pelo backend Python.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default SEOSection;