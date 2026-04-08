import React, { JSX } from "react";
import { createBrowserRouter, Navigate } from "react-router";
import { HomePage } from "../screens/public/HomePage";
import { Solutions } from "../screens/public/Solutions";
import { SummaPage } from "../screens/public/SummaPage";
import { AlmusPage } from "../screens/public/AlmusPage";
import { LoginPage } from "../screens/public/LoginPage";
import { SignUpPage } from "../screens/public/SignUpPage";
import { ForgotPasswordPage } from "../screens/public/ForgotPasswordPage";
import { AboutPage } from "../screens/public/AboutPage";
import { OverviewPage } from "../screens/admin/OverviewPage";
import { AdminBookingsPage } from "../screens/admin/AdminBookingsPage";
import { AdminPlayersPage } from "../screens/admin/AdminPlayersPage";
import { AdminCompetitionsPage } from "../screens/admin/AdminCompetitionsPage";
import { VideoReviewPage } from "../screens/coach/VideoReviewPage";
import { AIRecommendations } from "../screens/coach/AIRecommendations";
import { CourtsManagementPage } from "../screens/admin/CourtsManagementPage";
import { AnalyticsPage } from "../screens/admin/AnalyticsPage";
import { HydrationPage } from "../components/dashboard/HydrationPage";
import { SettingsPage } from "../components/dashboard/SettingsPage";
import { ProtectedDashboard } from "../components/dashboard/ProtectedDashboard";
import { Profile } from "../components/dashboard/Profile";
import { PlayerDashboard } from "../screens/player/PlayerDashboard";
import { useAuth } from "../services/AuthContext";
import { CourtBooking } from "../screens/player/CourtBooking";
import { Matches } from "../screens/player/Matches";
import { Competitions } from "../screens/player/Competitions";
import { CoachDashboard } from "../screens/coach/CoachDashboard";
import { StudentList } from "../screens/coach/StudentList";
import { SessionScheduler } from "../screens/coach/SessionScheduler";
import { StudentDetails } from "../screens/coach/StudentDetails";
import { AdminCourtConfig } from "../screens/admin/AdminConfig";
import { AdminManagement } from "../screens/admin/AdminManagement";
import { PlayerStats } from "../screens/player/PlayerStats";
import { MatchDetails } from "../screens/player/MatchDetails";
import { StudentComparison } from "../screens/coach/StudentComparison";
import { LiveMatchesPage } from "../screens/public/LiveMatchesPage";
import BookingPage from "../screens/public/BookingPage";
import ClubDetailsPage from "../screens/public/ClubDetailsPage";

const DashboardIndex = () => {
  const { user } = useAuth();
  const role = (user?.role || user?.user_metadata?.account_type || user?.user_metadata?.accountType || '')?.toLowerCase();
  
  if (role === 'player') return <PlayerDashboard />;
  if (role === 'coach') return <CoachDashboard />;
  return <OverviewPage />;
};

function RoleBasedRoute({ playerComponent, adminComponent }: { playerComponent: JSX.Element, adminComponent: JSX.Element }) {
  const { user } = useAuth();
  const role = (user?.role || user?.user_metadata?.account_type || user?.user_metadata?.accountType || '')?.toLowerCase();
  return role === 'player' ? playerComponent : adminComponent;
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
    path: "/about",
    Component: AboutPage,
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
        path: "admin/overview",
        Component: OverviewPage,
      },
      {
       path: "admin/management",
       Component: AdminManagement,
      },
      {
        path: "admin/bookings",
        Component: AdminBookingsPage,
      },
      {
        path: "admin/players",
        Component: AdminPlayersPage,
      },
      {
        path: "admin/competitions",
        Component: AdminCompetitionsPage,
      },
      // --- ROUTES COACH ---
      {
        path: "coach/home",
        Component: CoachDashboard,
      },

      // --- ROUTES PLAYER ---
      {
        path: "player/home",
        Component: PlayerDashboard,
      },
      {
        path: "player/stats",
        Component: PlayerStats,
      },
      {
        path: "player/matches/:id",
        Component: MatchDetails,
      },
      {
        path: "matches",
        Component: Matches,
      }, 
      {
       path: "admin/courts-config",
       Component: AdminCourtConfig, 
      },
      {
        path: "analytics",
        element: <RoleBasedRoute playerComponent={<Navigate to="/dashboard" replace />} adminComponent={<AnalyticsPage />} />,
      },
      {
        path: "competitions",
        element: <RoleBasedRoute playerComponent={<Competitions />} adminComponent={<Navigate to="/dashboard" />} />,
      },
      {
        path: "courts",

        element: <RoleBasedRoute playerComponent={<CourtBooking />} adminComponent={<CourtsManagementPage />} />     
      },
      { path: "coach/students", Component: StudentList },
      { path: "coach/students/:id", Component: StudentDetails },
      { path: "coach/compare", Component: StudentComparison },
      { path: "coach/schedule", Component: SessionScheduler },
      { path: "coach/video-review", Component: VideoReviewPage },
      { path: "coach/ai-analysis", Component: AIRecommendations },
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
  {
    path: "/live-matches",
    Component: LiveMatchesPage,
  },
  {
    path: "/booking",
    Component: BookingPage,
  },
  {
    path: "/club/:id",
    Component: ClubDetailsPage,
  },
]);