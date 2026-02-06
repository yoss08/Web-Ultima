import { RouterProvider } from "react-router";
import { router } from "./navigation/routes";
import { AuthProvider } from "./services/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
