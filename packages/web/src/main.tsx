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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
