import './styles/global.css';
import './styles/recipes.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { initFlavor, initTheme } from './lib/themes';
import { initPreferences } from './lib/preferences';

initFlavor();
initTheme();
initPreferences();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(() => {});
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
