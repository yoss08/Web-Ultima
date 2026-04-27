import { useAuth } from "../../services/AuthContext";
import { PlayerProfilePage } from "../../screens/player/PlayerProfilePage";
import { AdminProfilePage } from "../../screens/admin/AdminProfilePage";
import { SuperAdminProfilePage } from "../../screens/superadmin/SuperAdminProfilePage";
import { CoachProfilePage } from "../../screens/coach/CoachProfilePage";

export function Profile() {
  const { user } = useAuth();

  const role = (
    user?.role ??
    user?.user_metadata?.account_type ??
    user?.user_metadata?.accountType ??
    "player"
  ).toLowerCase();

  switch (role) {
    case "super_admin":
      return <SuperAdminProfilePage />;
    case "admin":
      return <AdminProfilePage />;
    case "coach":
      return <CoachProfilePage />;
    case "player":
    default:
      return <PlayerProfilePage />;
  }
}