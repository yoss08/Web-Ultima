import { createClient } from '@supabase/supabase-js';

// Configuration Supabase directe (pour Figma Make)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL; // Vite utilise import.meta.env
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types pour l'utilisateur
export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone_number?: string;
  account_type: 'Player' | 'Coach' | 'Facility';
  created_at: string;
  updated_at: string;
}

// Helper functions
export const authHelpers = {
  // Sign up
  async signUp(email: string, password: string, userData: {
    fullName: string;
    phoneNumber: string;
    accountType: string;
  }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: userData.fullName,
          phone_number: userData.phoneNumber,
          account_type: userData.accountType,
        },
      },
    });
    return { data, error };
  },

  // Sign in
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Reset password
  async resetPassword(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { data, error };
  },

  // Get current user
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  // Get user profile
  async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    return { data, error };
  },

  // Update user profile
  async updateUserProfile(userId: string, updates: Partial<UserProfile>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    return { data, error };
  },
};