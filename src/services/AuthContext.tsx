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

  // Fonction pour fusionner les données de session avec les métadonnées
  const mapUserWithMetadata = (supabaseUser: SupabaseUser | null): CustomUser | null => {
    if (!supabaseUser) return null;
    return {
      ...supabaseUser,
      fullName: supabaseUser.user_metadata?.fullName,
      phoneNumber: supabaseUser.user_metadata?.phoneNumber,
      role: supabaseUser.user_metadata?.accountType?.toLowerCase(), // On récupère le rôle stocké au SignUp
    };
  };

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(mapUserWithMetadata(session?.user ?? null));
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(mapUserWithMetadata(session?.user ?? null));
      setLoading(false);
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