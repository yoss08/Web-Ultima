import { RouterProvider } from "react-router";
import { router } from "./navigation/routes";
import { AuthProvider } from "./services/AuthContext";
import { ThemeProvider } from './services/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>


  );
}
