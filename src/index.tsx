import { MantineProvider } from '@mantine/core';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import './index.css';
import { ErrorBoundary } from './pages/error/index';
import store from './redux';
import reportWebVitals from './reportWebVitals';
import { register as registerServiceWorker } from './serviceWorkerRegistration';
import { theme } from './theme/index';
// core styles are required for all packages
import '@mantine/charts/styles.css';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/dropzone/styles.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// Register the service worker
registerServiceWorker();

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
