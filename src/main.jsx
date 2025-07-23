import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import '../layout.css';
import '../lib/os-gui/layout.css';
import '../lib/os-gui/windows-98.css';
import '../lib/clippy.js/build/clippy.css';
import '../classic.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
