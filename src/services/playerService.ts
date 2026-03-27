import { supabase } from "../config/supabase";

/**
 * Player Service — API calls for player features
 */

// Get player stats (career overview)
export async function getPlayerStats(userId: string) {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, courts(name)")
    .eq("user_id", userId)
    .order("booking_date", { ascending: false });

  if (error) throw error;
  return data || [];
}

// Get match history with optional filters
export async function getMatchHistory(
  userId: string,
  filters?: { result?: string; dateFrom?: string; dateTo?: string }
) {
  let query = supabase
    .from("bookings")
    .select("*, courts(name)")
    .eq("user_id", userId)
    .order("booking_date", { ascending: false });

  if (filters?.result && filters.result !== "all") {
    query = query.eq("result", filters.result === "win" ? "Win" : "Loss");
  }
  if (filters?.dateFrom) {
    query = query.gte("booking_date", filters.dateFrom);
  }
  if (filters?.dateTo) {
    query = query.lte("booking_date", filters.dateTo);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

// Get single match details
export async function getMatchDetails(matchId: string) {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, courts(name, type, surface)")
    .eq("id", matchId)
    .single();

  if (error) throw error;
  return data;
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
