import { RouterProvider } from 'react-router';
import { router } from './navigation/routes';
import { AuthProvider } from './services/AuthContext';
import { ToastProvider } from './components/ui/CustomToast';

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <ToastProvider />
    </AuthProvider>
  );
}

export default App;

