import { Navigate } from "react-router";

export function Profile() {
  return <Navigate to="/dashboard/settings?tab=account" replace />;
}
