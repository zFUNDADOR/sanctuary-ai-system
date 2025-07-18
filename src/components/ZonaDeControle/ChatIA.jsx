import React, { useState, useEffect } from 'react';
import { Copy, ThumbsUp, ThumbsDown } from 'lucide-react'; // Importação de ícones
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';

// Variáveis globais fornecidas pelo ambiente Canvas.
// Fornece valores padrão robustos caso o ambiente não as defina.
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

let firebaseConfig = {};
try {
  // Tenta fazer o parse de __firebase_config. Se não for uma string JSON válida, usa um objeto vazio.
  if (typeof __firebase_config !== 'undefined' && __firebase_config) {
    firebaseConfig = JSON.parse(__firebase_config);
  } else {
    console.warn("Variável __firebase_config não definida ou vazia. Usando configuração Firebase fornecida manualmente.");
    // **** ESTES SÃO OS VALORES REAIS DO SEU PROJETO FIREBASE 'nucleo-153b2' ****
    firebaseConfig = {
      apiKey: "AIzaSyC7SQQ983TWZDmcPkatGlWHLtNlPQyaGbA",
      authDomain: "nucleo-153b2.firebaseapp.com",
      projectId: "nucleo-153b2",
      storageBucket: "nucleo-153b2.firebasestorage.app",
      messagingSenderId: "251851322962",
      appId: "1:251851322962:web:f6f7c61306ef5825c6918b",
      measurementId: "G-T8268J60LW" 
    };
  }
} catch (e) {
  console.error("Erro ao fazer parse de __firebase_config. Usando configuração fornecida manualmente:", e);
  // **** ESTES SÃO OS VALORES REAIS DO SEU PROJETO FIREBASE 'nucleo-153b2' ****
  firebaseConfig = {
    apiKey: "AIzaSyC7SQQ983TWZDmcPkatGlWHLtNlPQyaGbA",
    authDomain: "nucleo-153b2.firebaseapp.com",
    projectId: "nucleo-153b2",
    storageBucket: "nucleo-153b2.firebasestorage.app",
    messagingSenderId: "251851322962",
    appId: "1:251851322962:web:f6f7c61306ef5825c6918b",
    measurementId: "G-T8268J60LW"
  };
}

const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// Inicialização do Firebase (feita uma vez)
let app, db, auth;
// Só inicializa se firebaseConfig tiver uma apiKey (indicando que não é um objeto vazio total)
if (firebaseConfig.apiKey) {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
} else {
  console.error("Firebase não pôde ser inicializado: firebaseConfig está vazio ou inválido.");
}


export default function ChatIA({ chatHistory, onEnviarMensagem }) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState(null); // Estado para armazenar o userId
  const [isAuthReady, setIsAuthReady] = useState(false); // Estado para indicar que a autenticação está pronta

  // Efeito para inicializar Firebase e autenticar o usuário
  useEffect(() => {
    // Verifica se app e auth foram inicializados
    if (!app || !auth) {
      console.error("Firebase 'app' ou 'auth' não inicializados. A autenticação não pode prosseguir.");
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        // Se não houver token inicial, faça login anonimamente
        try {
          if (initialAuthToken) {
            await signInWithCustomToken(auth, initialAuthToken);
          } else {
            await signInAnonymously(auth);
          }
          setUserId(auth.currentUser?.uid || crypto.randomUUID()); // Garante um userId
        } catch (error) {
          console.error("Erro na autenticação Firebase:", error);
          setUserId(crypto.randomUUID()); // Fallback para userId aleatório
        }
      }
      setIsAuthReady(true); // Autenticação pronta
    });

    return () => unsubscribe();
  }, []); // Array de dependências vazio para rodar apenas uma vez na montagem

  // Efeito para carregar histórico de chat do Firestore
  useEffect(() => {
    // Só prossegue se o Firebase estiver inicializado, autenticação pronta e userId disponível
    if (!isAuthReady || !db || !userId) {
      console.warn("Firestore não pronto para carregar histórico. isAuthReady:", isAuthReady, "db:", !!db, "userId:", !!userId);
      return;
    }

    // Define o caminho da coleção para dados privados do usuário
    const chatCollectionRef = collection(db, `artifacts/${appId}/users/${userId}/chat_history`);
    const q = query(chatCollectionRef, orderBy('timestamp', 'asc')); // Ordena por timestamp

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => doc.data());
      // Atualiza o histórico de chat no estado do componente pai (App.jsx)
      const formattedMessages = messages.map(msg => ({
        user: msg.userMessage,
        ai: msg.aiResponse
      }));
      onEnviarMensagem(formattedMessages, true); // O segundo parâmetro indica para substituir o histórico
    }, (error) => {
      console.error("Erro ao carregar histórico do Firestore:", error);
    });

    return () => unsubscribe();
  }, [isAuthReady, db, userId, onEnviarMensagem]); // Dependências para re-executar o efeito

  const handleSubmit = async () => {
    // Garante que Firebase, userId e db estão prontos antes de enviar
    if (!input.trim() || !isAuthReady || !db || !userId) {
      console.warn("Não é possível enviar mensagem: Firebase, autenticação ou userId não estão prontos.");
      return;
    }

    const userMessage = input;
    onEnviarMensagem({ user: userMessage, ai: '...' }); 
    setInput('');
    setIsLoading(true);

    try {
      // Histórico de chat para a API Gemini
      let currentChatHistory = [];
      chatHistory.forEach(entry => {
        if (entry.user) {
          currentChatHistory.push({ role: "user", parts: [{ text: entry.user }] });
        }
        if (entry.ai && entry.ai !== '...') {
          currentChatHistory.push({ role: "model", parts: [{ text: entry.ai.replace('IA: ', '') }] });
        }
      });
      currentChatHistory.push({ role: "user", parts: [{ text: userMessage }] });

      const payload = { contents: currentChatHistory };
      // **** AQUI ESTÁ A MUDANÇA: USAR A apiKey DO FIREBASE PARA A API GEMINI ****
      const apiKeyForGemini = firebaseConfig.apiKey; // Reutiliza a chave de API do Firebase
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKeyForGemini}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      let aiResponseText = "Erro: Não foi possível obter resposta da IA.";
      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        aiResponseText = result.candidates[0].content.parts[0].text;
      } else if (result.error) {
        aiResponseText = `Erro da API: ${result.error.message}`;
      }

      // Salva a interação no Firestore
      await addDoc(collection(db, `artifacts/${appId}/users/${userId}/chat_history`), {
        userMessage: userMessage,
        aiResponse: aiResponseText,
        timestamp: serverTimestamp(),
      });

      onEnviarMensagem({ user: userMessage, ai: `IA: ${aiResponseText}` });

    } catch (error) {
      console.error("Erro ao comunicar com a IA ou salvar no Firestore:", error);
      onEnviarMensagem({ user: userMessage, ai: `IA: Desculpe, houve um erro ao processar sua solicitação: ${error.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  // Função para lidar com o feedback (Like/Dislike)
  const handleFeedback = async (entry, feedbackType) => {
    // Garante que Firebase, userId e db estão prontos antes de salvar
    if (!isAuthReady || !db || !userId) {
      console.warn("Não é possível salvar feedback: Firebase, autenticação ou userId não estão prontos.");
      return;
    }

    try {
      await addDoc(collection(db, `artifacts/${appId}/users/${userId}/ai_feedback`), {
        userMessage: entry.user,
        aiResponse: entry.ai,
        feedbackType: feedbackType,
        timestamp: serverTimestamp(),
      });
      console.log(`Feedback '${feedbackType}' salvo para:`, entry.user);
    } catch (error) {
      console.error("Erro ao salvar feedback no Firestore:", error);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-lg">Comando para IA</label>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Digite um comando ou pergunta..."
        className="bg-gray-800 p-2 rounded border border-gray-600 text-white"
        onKeyPress={(e) => {
          if (e.key === 'Enter' && !isLoading) {
            handleSubmit();
          }
        }}
        disabled={isLoading || !isAuthReady || !db} // Desabilita se não estiver pronto
      />
      <button 
        onClick={handleSubmit}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        disabled={isLoading || !isAuthReady || !db} // Desabilita se não estiver pronto
      >
        {isLoading ? 'Enviando para IA...' : 'Enviar para IA'}
      </button>
      <div className="bg-gray-800 p-2 rounded h-40 overflow-y-auto border border-gray-700 text-sm">
        {chatHistory.map((entry, i) => (
          <div key={i} className="mb-2">
            {entry.user && <div className="text-blue-300">Você: {entry.user}</div>}
            {entry.ai && (
              <div className="text-purple-400 flex justify-between items-center">
                <span>{entry.ai}</span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => navigator.clipboard.writeText(entry.ai)}
                    className="p-1 rounded-full hover:bg-gray-700 transition-colors duration-200"
                    title="Copiar"
                  >
                    <Copy size={16} />
                  </button>
                  <button 
                    onClick={() => handleFeedback(entry, 'like')}
                    className="p-1 rounded-full hover:bg-green-600 transition-colors duration-200"
                    title="Gostei"
                  >
                    <ThumbsUp size={16} />
                  </button>
                  <button 
                    onClick={() => handleFeedback(entry, 'dislike')}
                    className="p-1 rounded-full hover:bg-red-600 transition-colors duration-200"
                    title="Não Gostei"
                  >
                    <ThumbsDown size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="text-gray-500 italic">IA está pensando...</div>
        )}
      </div>
    </div>
  );
}
