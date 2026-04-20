import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) throw new Error("Missing VITE_SUPABASE_URL");
if (!supabaseAnonKey) throw new Error("Missing VITE_SUPABASE_ANON_KEY");

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export type ProfileRole = "player" | "coach" | "admin" | "super_admin";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string | null;
  role?: ProfileRole;
  avatar_url?: string;
  created_at: string;
  club_id?: string | null;
}

export const authHelpers = {
  async signUp(
    email: string,
    password: string,
    userData: {
      fullName: string;
      phoneNumber?: string;
    }
  ) {
    // 1) Create auth user (no authorization role here)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: userData.fullName,
          phone: userData.phoneNumber ?? null, // (optional) keep auth metadata non-sensitive
        },
      },
    });

    if (authError || !authData.user) return { data: authData, error: authError };

    // 2) Persist profile with default role = player
    const { error: profileError } = await supabase.from("profiles").upsert({
      id: authData.user.id,
      full_name: userData.fullName,
      phone: userData.phoneNumber ?? null,
      role: "player", // ✅ always default
    });

    if (profileError) console.error("Error syncing profile:", profileError);

    return { data: authData, error: authError };
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async resetPassword(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { data, error };
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    return { data, error };
  },

  async updateUserProfile(userId: string, updates: Partial<UserProfile>) {
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    return { data, error };
  },
};