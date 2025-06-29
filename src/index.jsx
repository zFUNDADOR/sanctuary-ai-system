import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // Certifique-se que App.jsx está diretamente em 'src/'
import './index.css'; // Certifique-se que index.css está diretamente em 'src/'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
