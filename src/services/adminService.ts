import { supabase } from '../config/supabase';

const API_URL = (import.meta as any).env?.VITE_API_URL || '/api';
// All Express routes are mounted at /api/admin — always include that prefix.
const ADMIN_API = `${API_URL}/api/admin`;

/**
 * Attaches the current Supabase session token to every fetch request.
 * Without this the backend auth middleware rejects with 401/403.
 */
async function authHeaders(): Promise<HeadersInit> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) throw new Error('Not authenticated. Please log in again.');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session.access_token}`,
  };
}

export const adminService = {
  // ─── PLAYERS ────────────────────────────────────────────────
  async getUnassignedPlayers() {
    const headers = await authHeaders();
    const response = await fetch(`${ADMIN_API}/players`, { headers });
    if (!response.ok) throw new Error('Failed to fetch players');
    const players = await response.json();
    return players.filter((p: any) => !p.coach_id);
  },

  async getClubPlayers(clubId: string) {
    const headers = await authHeaders();
    const response = await fetch(`${ADMIN_API}/players?club_id=${clubId}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch club players');
    return response.json();
  },

  // ─── COACHES ────────────────────────────────────────────────
  async getAllCoaches() {
    const headers = await authHeaders();
    const response = await fetch(`${ADMIN_API}/players`, { headers });
    if (!response.ok) throw new Error('Failed to fetch coaches');
    const profiles = await response.json();
    return profiles.filter((p: any) => p.account_type === 'Coach' || p.role === 'coach');
  },

  async getClubCoaches(clubId: string) {
    const headers = await authHeaders();
    const response = await fetch(`${ADMIN_API}/coaches?club_id=${clubId}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch club coaches');
    return response.json();
  },

  async getUnassignedCoaches() {
    const headers = await authHeaders();
    const response = await fetch(`${ADMIN_API}/unassigned-coaches`, { headers });
    if (!response.ok) throw new Error('Failed to fetch unassigned coaches');
    return response.json();
  },

  async assignCoachToClub(coachId: string) {
    const headers = await authHeaders();
    const response = await fetch(`${ADMIN_API}/coaches/${coachId}/assign`, {
      method: 'PUT',
      headers,
    });
    if (!response.ok) throw new Error('Failed to assign coach to club');
    return response.json();
  },

  async unassignCoachFromClub(coachId: string) {
    const headers = await authHeaders();
    const response = await fetch(`${ADMIN_API}/coaches/${coachId}/unassign`, {
      method: 'PUT',
      headers,
    });
    if (!response.ok) throw new Error('Failed to unassign coach from club');
    return response.json();
  },

  async assignCoachToPlayer(playerId: string, coachId: string) {
    const headers = await authHeaders();
    const response = await fetch(`${ADMIN_API}/players/${playerId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ coach_id: coachId }),
    });
    if (!response.ok) throw new Error('Failed to assign coach');
    return response.json();
  },

  // ─── BOOKINGS ───────────────────────────────────────────────
  async getClubBookings(clubId: string) {
    const headers = await authHeaders();
    const response = await fetch(`${ADMIN_API}/bookings?club_id=${clubId}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch club bookings');
    return response.json();
  },

  async acceptBooking(bookingId: string | number) {
    const headers = await authHeaders();
    const response = await fetch(`${ADMIN_API}/bookings/${bookingId}/accept`, {
      method: 'PUT',
      headers,
    });
    if (!response.ok) throw new Error('Failed to accept booking');
    return response.json();
  },

  async rejectBooking(bookingId: string | number) {
    const headers = await authHeaders();
    const response = await fetch(`${ADMIN_API}/bookings/${bookingId}/reject`, {
      method: 'PUT',
      headers,
    });
    if (!response.ok) throw new Error('Failed to reject booking');
    return response.json();
  },

  // ─── COURTS ─────────────────────────────────────────────────
  async getAllCourts() {
    const headers = await authHeaders();
    const response = await fetch(`${ADMIN_API}/courts`, { headers });
    if (!response.ok) throw new Error(`Failed to fetch courts: ${response.status}`);
    return response.json();
  },

  async getClubCourts(clubId: string) {
    const headers = await authHeaders();
    const response = await fetch(`${ADMIN_API}/courts?club_id=${clubId}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch club courts');
    return response.json();
  },

  async addCourt(courtData: { name: string; type: string; status: string; club_id?: string }) {
    const headers = await authHeaders();
    const response = await fetch(`${ADMIN_API}/courts`, {
      method: 'POST',
      headers,
      body: JSON.stringify(courtData),
    });
    if (!response.ok) throw new Error('Failed to add court');
    return response.json();
  },

  async deleteCourt(courtId: string | number) {
    const headers = await authHeaders();
    const response = await fetch(`${ADMIN_API}/courts/${courtId}`, {
      method: 'DELETE',
      headers,
    });
    if (!response.ok) throw new Error('Failed to delete court');
    return response.json();
  },

  async updateCourt(courtId: string | number, updates: Record<string, any>) {
    const headers = await authHeaders();
    const response = await fetch(`${ADMIN_API}/courts/${courtId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update court');
    return response.json();
  },

  async updateCourtStatus(courtId: string | number, status: string) {
    const headers = await authHeaders();
    const response = await fetch(`${ADMIN_API}/courts/${courtId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error(`Failed to update court status: ${response.status}`);
    return response.json();
  },

  // ─── MATCHES ────────────────────────────────────────────────
  async getClubMatches(clubId: string) {
    const headers = await authHeaders();
    const response = await fetch(`${ADMIN_API}/matches?club_id=${clubId}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch club matches');
    return response.json();
  },

  async createMatch(matchData: {
    booking_id?: string | number;
    player1_id: string;
    player2_id?: string;
    court_id: string | number;
    status: 'live' | 'completed';
    start_time?: string;
    end_time?: string;
  }) {
    const headers = await authHeaders();
    const response = await fetch(`${ADMIN_API}/matches`, {
      method: 'POST',
      headers,
      body: JSON.stringify(matchData),
    });
    if (!response.ok) throw new Error('Failed to create match');
    return response.json();
  },

  async updateScore(matchId: string | number, score: string) {
    const headers = await authHeaders();
    const response = await fetch(`${ADMIN_API}/matches/${matchId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ current_score: score }),
    });
    if (!response.ok) throw new Error('Failed to update score');
    return response.json();
  },

  // ─── ANALYTICS ──────────────────────────────────────────────
  async getGlobalStats() {
    const headers = await authHeaders();
    const response = await fetch(`${ADMIN_API}/reports/overview`, { headers });
    if (!response.ok) throw new Error('Failed to fetch stats');
    return response.json();
  },

  async getClubStats(clubId: string) {
    const headers = await authHeaders();
    const response = await fetch(`${ADMIN_API}/reports/overview?club_id=${clubId}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch club stats');
    return response.json();
  },

  // ─── CLUB INFO ──────────────────────────────────────────────
  /**
   * Fetches the club assigned to the currently logged-in admin directly via
   * Supabase — bypasses Express so there's no URL/auth issue on the GET.
   */
  async getClubInfo() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) throw new Error('Not authenticated');

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('club_id')
      .eq('id', session.user.id)
      .single();

    if (profileError) throw new Error(profileError.message);
    if (!profile?.club_id) throw new Error('No club assigned to this admin account yet.');

    const { data: club, error: clubError } = await supabase
      .from('clubs')
      .select('*')
      .eq('id', profile.club_id)
      .single();

    if (clubError) throw new Error(clubError.message);

    // Also return court count so the header shows the right number
    const { count } = await supabase
      .from('courts')
      .select('id', { count: 'exact', head: true })
      .eq('club_id', profile.club_id);

    return { ...club, court_count: count ?? 0 };
  },

  /**
   * Updates the club via the Express PUT /api/admin/club endpoint.
   * The backend reads club_id from req.user (JWT middleware) — safe and scoped.
   * Changes are immediately reflected in the super_admin's ClubManagement view.
   */
  async updateClubInfo(_clubId: string, updates: Record<string, any>) {
    const headers = await authHeaders();
    const response = await fetch(`${ADMIN_API}/club`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(updates),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || `Failed to update club: ${response.status}`);
    }
    return response.json();
  },
};