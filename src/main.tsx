import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource/kaushan-script';
import '@fontsource/alegreya/400.css';
import '@fontsource/alegreya/400-italic.css';
import '@fontsource/alegreya/700.css';
import '@fontsource/almendra/400.css';
import '@fontsource/almendra/700.css';
import '@fontsource/almendra-sc/400.css';
import './styles.css';
import { App } from './App';
import { StoreProvider } from './store';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <StoreProvider>
      <App />
    </StoreProvider>
  </React.StrictMode>,
);
