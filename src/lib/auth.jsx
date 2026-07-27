import { createContext, useContext, useEffect, useState, useCallback } from 'react';

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

  const signInWithGoogle = useCallback(() => {
    // TODO: replace with real Google OAuth (Supabase Auth)
    setUser({
      name: 'Alex Morgan',
      email: 'alex@example.com',
      avatarColor: '#22d3ee',
      role: 'client',
    });
  }, []);

  const signOut = useCallback(() => {
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
