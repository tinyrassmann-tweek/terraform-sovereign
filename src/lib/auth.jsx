import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from './supabaseClient.js';

const AuthContext = createContext(null);

const STORAGE_KEY = 'tts-auth';

const loadPersisted = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

// Normalize a Supabase auth user into the app's user shape.
function supabaseUserToAppUser(su) {
  if (!su) return null;
  return {
    id: su.id,
    name: su.user_metadata?.full_name ?? su.email?.split('@')[0] ?? 'User',
    email: su.email,
    avatarColor: '#22d3ee',
    role: su.user_metadata?.role ?? 'client',
  };
}

export function AuthProvider({ children }) {
  const persisted = loadPersisted();
  const [user, setUser] = useState(persisted?.user ?? null);
  const [favorites, setFavorites] = useState(persisted?.favorites ?? []);
  const [bookings, setBookings] = useState(persisted?.bookings ?? []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, favorites, bookings }));
    } catch {
      // storage unavailable — ignore
    }
  }, [user, favorites, bookings]);

  // When Supabase is configured, hydrate from the live session and follow auth changes.
  useEffect(() => {
    if (!isSupabaseConfigured) return undefined;
    supabase.auth.getSession().then(({ data }) => {
      setUser(supabaseUserToAppUser(data.session?.user));
    });
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(supabaseUserToAppUser(session?.user));
    });
    return () => subscription.subscription.unsubscribe();
  }, []);

  const signInWithGoogle = useCallback(async () => {
    if (isSupabaseConfigured) {
      // Real Google OAuth via Supabase Auth. Enable the Google provider in the
      // Supabase dashboard (Authentication → Providers) with your OAuth client
      // credentials, and add this app's URL to the redirect allow-list.
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin + import.meta.env.BASE_URL },
      });
      if (error) console.error('Google sign-in failed:', error.message);
      return;
    }
    // Mock sign-in fallback (no backend configured).
    setUser({
      name: 'Alex Morgan',
      email: 'alex@example.com',
      avatarColor: '#22d3ee',
      role: 'client',
    });
  }, []);

  const signOut = useCallback(async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
  }, []);

  const toggleFavorite = useCallback((conductorId) => {
    setFavorites((prev) =>
      prev.includes(conductorId)
        ? prev.filter((id) => id !== conductorId)
        : [...prev, conductorId]
    );
  }, []);

  const addBooking = useCallback((booking) => {
    setBookings((prev) => [...prev, { id: `booking-${Date.now()}`, ...booking }]);
  }, []);

  const value = {
    user,
    signInWithGoogle,
    signOut,
    favorites,
    toggleFavorite,
    bookings,
    addBooking,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
