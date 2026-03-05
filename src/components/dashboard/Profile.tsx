import { Navigate } from "react-router";

/**
 * Profile component now serves as a redirect to the unified Settings page
 * which consolidates account profile and app preferences.
 */
export function Profile() {
  return <Navigate to="/dashboard/settings?tab=account" replace />;
}
