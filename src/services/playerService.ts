import { supabase } from "../config/supabase";

/**
 * Player Service — API calls for player features
 */

// Get player stats (career overview)
export async function getPlayerStats(userId: string) {
  // Query matches where user is either player1 or player2
  const { data, error } = await supabase
    .from("matches")
    .select("*, booking:bookings(*, courts(name))")
    .or(`player1_id.eq.${userId},player2_id.eq.${userId}`)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

// Get all players for opponent selection
export async function getPlayers() {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url")
    .eq("role", "player")
    .order("full_name", { ascending: true });

  if (error) throw error;
  return data || [];
}

// Get match history with optional filters
export async function getMatchHistory(
  userId: string,
  filters?: { result?: string; dateFrom?: string; dateTo?: string }
) {
  let query = supabase
    .from("matches")
    .select("*, player1:profiles!player1_id(full_name), player2:profiles!player2_id(full_name), booking:bookings(*, courts(name))")
    .or(`player1_id.eq.${userId},player2_id.eq.${userId}`)
    .order("created_at", { ascending: false });

  if (filters?.result && filters.result !== "all") {
    if (filters.result === "win") {
      query = query.eq("winner_id", userId);
    } else {
      query = query.neq("winner_id", userId).not("winner_id", "is", null);
    }
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

// Get single match details
export async function getMatchDetails(matchId: string) {
  const { data, error } = await supabase
    .from("matches")
    .select("*, player1:profiles!player1_id(*), player2:profiles!player2_id(*), booking:bookings(*, courts(name, type, surface))")
    .eq("id", matchId)
    .single();

  if (error) throw error;
  return data;
}

// Create a match record
export async function createMatch(matchData: {
  booking_id: string;
  player1_id: string;
  player2_id: string;
  match_type?: string;
}) {
  const { data, error } = await supabase
    .from("matches")
    .insert([matchData])
    .select();

  if (error) throw error;
  return data?.[0];
}

// Update a booking (modify reservation)
export async function updateBooking(bookingId: string, updates: Record<string, any>) {
  const { data, error } = await supabase
    .from("bookings")
    .update(updates)
    .eq("id", bookingId)
    .select();

  if (error) throw error;
  return data?.[0];
}

// Cancel a booking
export async function cancelBooking(bookingId: string) {
  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId);

  if (error) throw error;
  return { success: true };
}

// Get player's upcoming bookings
export async function getUpcomingBookings(userId: string) {
  const today = new Date().toISOString().split("T")[0];
  const { data, error } = await supabase
    .from("bookings")
    .select("*, courts(name)")
    .eq("user_id", userId)
    .gte("booking_date", today)
    .order("booking_date", { ascending: true });

  if (error) throw error;
  return data || [];
}

// Get player profile
export async function getPlayerProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data;
}

// Update player profile
export async function updatePlayerProfile(userId: string, updates: Record<string, any>) {
  const { data, error } = await supabase
    .from("profiles")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", userId)
    .select();

  if (error) throw error;
  return data?.[0];
}
