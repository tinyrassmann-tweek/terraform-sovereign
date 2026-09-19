// Supabase client — the single connection point for the real backend.
//
// Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (see .env.example).
// When they are absent the app runs entirely on mock data, so the
// frontend remains demo-able with zero backend.
import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase = isSupabaseConfigured ? createClient(url, anonKey) : null;

// Map a Supabase row (snake_case) to the frontend conductor shape (camelCase).
export function rowToConductor(row) {
  return {
    id: row.id,
    name: row.name,
    tagline: row.tagline,
    specialties: row.specialties ?? [],
    harmonyScore: row.harmony_score,
    resonanceCount: row.resonance_count,
    location: row.location,
    priceFrom: row.price_from,
    sponsored: row.sponsored,
    certified: row.certified,
    status: row.status,
    portfolio: row.portfolio ?? [],
    accent: row.accent,
    bio: row.bio,
  };
}

// Map a Supabase review row to the frontend review shape.
export function rowToReview(row) {
  return {
    id: row.id,
    conductorId: row.conductor_id,
    author: row.author,
    rating: row.rating,
    text: row.text,
    date: row.created_at,
    status: row.status,
    response: row.response,
  };
}
