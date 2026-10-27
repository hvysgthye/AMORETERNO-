import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { KEEPSAKE_CSS } from './utils/keepsakeStyles';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <style>{KEEPSAKE_CSS}</style>
    <App />
  </React.StrictMode>
);
