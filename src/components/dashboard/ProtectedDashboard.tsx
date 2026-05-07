import { ProtectedRoute } from "../ProtectedRoute";
import { DashboardWrapper } from "./DashboardWrapper";

/**
 * A wrapper component that protects dashboard routes using ProtectedRoute.
 * It ensures the user is authenticated before rendering the DashboardWrapper.
 */
export function ProtectedDashboard() {
  return (
    <ProtectedRoute>
      <DashboardWrapper />
    </ProtectedRoute>
  );
}