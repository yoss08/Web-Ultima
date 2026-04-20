import { createContext, useContext, useEffect, useState } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '../config/supabase';

interface CustomUser extends SupabaseUser {
  fullName?: string;
  phoneNumber?: string;
  role?: string;
  club_id?: string;
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
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CustomUser | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUserWithProfile = async (supabaseUser: SupabaseUser | null) => {
    if (!supabaseUser) {
      setUser(null);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('full_name, phone, role, club_id')
      .eq('id', supabaseUser.id)
      .single();

    console.log('[AuthContext] supabaseUser.id:', supabaseUser.id);
    console.log('[AuthContext] profile from DB:', profile);
    console.log('[AuthContext] profile fetch error:', profileError);

    setUser({
      ...supabaseUser,
      fullName: profile?.full_name ?? supabaseUser.user_metadata?.full_name,
      phoneNumber: profile?.phone ?? supabaseUser.user_metadata?.phone_number,
      role:
        profile?.role ??
        supabaseUser.user_metadata?.account_type ??
        supabaseUser.user_metadata?.accountType,
      club_id: profile?.club_id ?? undefined,
    });
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      loadUserWithProfile(session?.user ?? null).finally(() => setLoading(false));
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
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
