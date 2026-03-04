import { createContext, useContext, useEffect, useState } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js'; // On renomme l'import pour éviter le conflit
import { supabase } from '../config/supabase';

// 1. On définit l'interface pour vos données personnalisées
interface CustomUser extends SupabaseUser {
  fullName?: string;
  phoneNumber?: string;
  role?: string;
}

interface AuthContextType {
  user: CustomUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CustomUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetches profile from 'profiles' table and merges with auth user
  const loadUserWithProfile = async (supabaseUser: SupabaseUser | null) => {
    if (!supabaseUser) {
      setUser(null);
      return;
    }

    // Fetch real data from profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('full_name, phone, role')
      .eq('id', supabaseUser.id)
      .single();

    // 🔍 DEBUG - check browser console to diagnose NULL issue
    console.log('[AuthContext] supabaseUser.id:', supabaseUser.id);
    console.log('[AuthContext] profile from DB:', profile);
    console.log('[AuthContext] profile fetch error:', profileError);
    console.log('[AuthContext] user_metadata:', supabaseUser.user_metadata);

    setUser({
      ...supabaseUser,
      // profiles table takes priority; fallback to user_metadata
      fullName: profile?.full_name ?? supabaseUser.user_metadata?.full_name,
      phoneNumber:
        profile?.phone ??
        supabaseUser.user_metadata?.phone_number,
      role:
        profile?.role ??
        supabaseUser.user_metadata?.account_type ??
        supabaseUser.user_metadata?.accountType,
    });
  };

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      loadUserWithProfile(session?.user ?? null).finally(() => setLoading(false));
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoading(true);
      loadUserWithProfile(session?.user ?? null).finally(() => setLoading(false));
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}