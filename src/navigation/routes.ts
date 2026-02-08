import { createBrowserRouter } from "react-router";
import { HomePage } from "../screens/public/HomePage";
import { Solutions } from "../screens/public/Solutions";
import { SummaPage } from "../screens/public/SummaPage";
import { AlmusPage } from "../screens/public/AlmusPage";
import { LoginPage } from "../screens/public/LoginPage";
import { SignUpPage } from "../screens/public/SignUpPage";
import { ForgotPasswordPage } from "../screens/public/ForgotPasswordPage";
import { OverviewPage } from "../components/dashboard/OverviewPage";
import { LiveMatchesPage } from "../components/dashboard/LiveMatchesPage";
import { CourtsManagementPage } from "../components/dashboard/CourtsManagementPage";
import { AnalyticsPage } from "../components/dashboard/AnalyticsPage";
import { HydrationPage } from "../components/dashboard/HydrationPage";
import { SettingsPage } from "../components/dashboard/SettingsPage";
import { ProtectedDashboard } from "../components/dashboard/ProtectedDashboard";

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
        Component: OverviewPage,
      },
      {
        path: "live-matches",
        Component: LiveMatchesPage,
      },
      {
        path: "courts",
        Component: CourtsManagementPage,
      },
      {
        path: "analytics",
        Component: AnalyticsPage,
      },
      {
        path: "hydration",
        Component: HydrationPage,
      },
      {
        path: "settings",
        Component: SettingsPage,
      },
    ],
  },
]);
