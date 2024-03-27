import { RouterProvider } from 'react-router-dom';
import { authRouter } from './routes';

// Style and Css
import './App.css';
function App() {
  return <RouterProvider router={authRouter} />;
}

export default App;
