import { RouterProvider } from 'react-router';
import { router } from './navigation/routes';
import { AuthProvider } from './services/AuthContext';
import { ToastProvider } from './components/ui/CustomToast';

/**
 * The main App component that sets up the global providers.
 * Includes Authentication, Routing, and Toast notification providers.
 */
function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <ToastProvider />
    </AuthProvider>
  );
}

export default App;

