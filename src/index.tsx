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

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <MantineProvider defaultColorScheme={'light'} theme={theme}>
      <ErrorBoundary>
        <Provider store={store}>
          <App />
        </Provider>
      </ErrorBoundary>
    </MantineProvider>
  </React.StrictMode>
);

reportWebVitals();
