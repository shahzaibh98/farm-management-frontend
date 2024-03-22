import { RouterProvider } from 'react-router-dom';
import './App.css';
import { authRouter } from './routes';

function App() {
  return <RouterProvider router={authRouter} />;
}

export default App;
