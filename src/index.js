import React from 'react';
import { createRoot } from 'react-dom/client';  // Update this import
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App';

const root = createRoot(document.getElementById('root'));  // Use imported createRoot
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);