import { RouterProvider } from "react-router";
import { router } from "./navigation/routes";

export default function App() {
  return <RouterProvider router={router} />;
}
