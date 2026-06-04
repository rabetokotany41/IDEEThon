import { RouterProvider } from 'react-router-dom';
import { router } from './routes/routes';
function App() {
  return (
    <div className="text-white">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;