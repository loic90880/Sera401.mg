window.addEventListener('error', (event) => {
  document.body.innerHTML = `<pre style="padding:16px;color:#b91c1c;background:#fef2f2;white-space:pre-wrap;">Erreur JS : ${event.message}\n${event.filename}:${event.lineno}</pre>`;
});

window.addEventListener('unhandledrejection', (event) => {
  document.body.innerHTML = `<pre style="padding:16px;color:#b91c1c;background:#fef2f2;white-space:pre-wrap;">Promise rejetée : ${event.reason?.message || event.reason}</pre>`;
});

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
