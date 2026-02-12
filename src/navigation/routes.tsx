import React, { JSX } from "react";
import { createBrowserRouter, Navigate } from "react-router";
import { HomePage } from "../screens/public/HomePage";
import { Solutions } from "../screens/public/Solutions";
import { SummaPage } from "../screens/public/SummaPage";
import { AlmusPage } from "../screens/public/AlmusPage";
import { LoginPage } from "../screens/public/LoginPage";
import { SignUpPage } from "../screens/public/SignUpPage";
import { ForgotPasswordPage } from "../screens/public/ForgotPasswordPage";
import { OverviewPage } from "../screens/admin/OverviewPage";
import { LiveMatchesPage } from "../screens/admin/LiveMatchesPage";
import { CourtsManagementPage } from "../screens/admin/CourtsManagementPage";
import { AnalyticsPage } from "../screens/admin/AnalyticsPage";
import { HydrationPage } from "../components/dashboard/HydrationPage";
import { SettingsPage } from "../components/dashboard/SettingsPage";
import { ProtectedDashboard } from "../components/dashboard/ProtectedDashboard";
import { Profile } from "../components/dashboard/Profile";
import { PlayerDashboard } from "../screens/player/PlayerDashboard";
import { useAuth } from "../services/AuthContext";
import { CourtBooking } from "../screens/player/CourtBooking";
import { PlayerStats } from "../screens/player/PlayerStats";
import { Matches } from "../screens/player/Matches";
import { Competitions } from "../screens/player/Competitions";


const DashboardIndex = () => {
  const { user } = useAuth();
  const role = user?.user_metadata?.account_type?.toLowerCase();
  
 if (role === 'player') {
    return <PlayerDashboard />;
  }
  return <OverviewPage />;
};
function RoleBasedRoute({ playerComponent, adminComponent }: { playerComponent: JSX.Element, adminComponent: JSX.Element }) {
  const { user } = useAuth();
  const role = user?.user_metadata?.account_type;
  return role === 'Player' ? playerComponent : adminComponent;
}
export const router = createBrowserRouter([
  {
    path: "/",
    Component: HomePage,
  },
  {
    path: "/solutions",
    Component: Solutions,
  },
  {
    path: "/summa",
    Component: SummaPage,
  },
  {
    path: "/almus",
    Component: AlmusPage,
  },
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/signup",
    Component: SignUpPage,
  },
  {
    path: "/forgot-password",
    Component: ForgotPasswordPage,
  },
  {
    path: "/dashboard",
    Component: ProtectedDashboard,
    children: [
      {
        index: true,
        Component: DashboardIndex,
      },
      {
        path: "live-matches",
        // Si Player -> Matches, sinon -> LiveMatchesPage
        element: <RoleBasedRoute playerComponent={<Matches />} adminComponent={<LiveMatchesPage />} />,
      },
      {
        path: "analytics",
        // Si Player -> PlayerStats, sinon -> AnalyticsPage
        element: <RoleBasedRoute playerComponent={<PlayerStats />} adminComponent={<AnalyticsPage />} />,
      },
      {
        path: "competitions",
        // Uniquement accessible par les joueurs
        element: <RoleBasedRoute playerComponent={<Competitions />} adminComponent={<Navigate to="/dashboard" />} />,
      },
      {
        path: "courts",

        element: <RoleBasedRoute playerComponent={<CourtBooking />} adminComponent={<CourtsManagementPage />} />      },
      {
        path: "hydration",
        Component: HydrationPage,
      },
      {
        path: "profile",
        Component: Profile,
      },
      {
        path: "settings",
        Component: SettingsPage,
      },
    ],
  },
]);
