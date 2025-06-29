import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
// Importação do arquivo CSS principal agora aponta para index.css
import './index.css'; // <--- MUDANÇA AQUI!

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
