import { ProtectedRoute } from "../ProtectedRoute";
import { DashboardWrapper } from "./DashboardWrapper";

export function ProtectedDashboard() {
  return (
    <ProtectedRoute>
      <DashboardWrapper />
    </ProtectedRoute>
  );
}