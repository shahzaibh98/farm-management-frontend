import { MantineProvider } from '@mantine/core';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import './index.css';
import store from './redux';
import reportWebVitals from './reportWebVitals';
import { theme } from './theme/index';
import { ErrorBoundary } from './pages/error/index';
// core styles are required for all packages
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/charts/styles.css';
import '@mantine/dropzone/styles.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/firebase-messaging-sw.js')
      .then(registration => {
        console.log(
          'Service Worker registration successful with scope: ',
          registration.scope
        );
      })
      .catch(err => {
        console.log('Service Worker registration failed: ', err);
      });
  });
}

root.render(
  <MantineProvider defaultColorScheme={'light'} theme={theme}>
    <ErrorBoundary>
      <Provider store={store}>
        <App />
      </Provider>
    </ErrorBoundary>
  </MantineProvider>
);

reportWebVitals();
