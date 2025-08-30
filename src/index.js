import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Explicitly create root and render
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
