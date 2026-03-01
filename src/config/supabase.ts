import { createClient } from '@supabase/supabase-js'

// Replace with your actual Supabase project URL and anon key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://eflxicthczsxnoegeinx.supabase.co';
const supabaseAnonKey =import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmbHhpY3RoY3pzeG5vZWdlaW54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwMzY5MDMsImV4cCI6MjA4NTYxMjkwM30.FFniM5-EGml2Q_bO28mPbVCEBmXZiO35rsDUw-q9jFY';

if (!supabaseUrl) {
  throw new Error('Missing environment variable: VITE_SUPABASE_URL');
}
if (!supabaseAnonKey) {
  throw new Error('Missing environment variable: VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);




// Types pour l'utilisateur
export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone_number?: string;
  telephone?: string;
  account_type: 'Player' | 'Coach' | 'Facility' | 'Admin';
  role?: string;
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
    // 1. Sign up user
    const { data: authData, error: authError } = await supabase.auth.signUp({
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

    if (authError || !authData.user) return { data: authData, error: authError };

    // 2. Insert into profiles table to ensure persistence/queryability
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: authData.user.id,
        email: email,
        full_name: userData.fullName,
        phone_number: userData.phoneNumber,
        telephone: userData.phoneNumber, // Sync to telephone column
        account_type: userData.accountType,
        role: userData.accountType, // Sync to role column
        updated_at: new Date().toISOString(),
      });

    if (profileError) {
      console.error('Error syncing profile:', profileError);
      // We don't block the signup if profile sync fails, but we log it
    }

    return { data: authData, error: authError };
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