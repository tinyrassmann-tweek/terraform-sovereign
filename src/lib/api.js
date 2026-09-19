// API layer. When Supabase env vars are configured (see .env.example) these
// functions hit the real backend; otherwise they fall back to mock data so
// the frontend stays fully demo-able with zero backend.
//
// Table schemas live in supabase/schema.sql.

import { supabase, isSupabaseConfigured, rowToConductor, rowToReview } from './supabaseClient.js';
import { mockConductors } from '../data/mockConductors.js';
import { mockReviews } from '../data/mockReviews.js';

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchConductors(filters = {}) {
  if (isSupabaseConfigured) {
    let query = supabase.from('conductors').select('*');
    if (filters.status) query = query.eq('status', filters.status);
    if (typeof filters.certified === 'boolean') query = query.eq('certified', filters.certified);
    if (filters.specialty) query = query.contains('specialties', [filters.specialty]);
    const { data, error } = await query;
    if (error) throw new Error(`fetchConductors: ${error.message}`);
    return data.map(rowToConductor);
  }
  await delay();
  let results = [...mockConductors];
  if (filters.specialty) {
    results = results.filter((c) => c.specialties.includes(filters.specialty));
  }
  if (filters.status) {
    results = results.filter((c) => c.status === filters.status);
  }
  if (typeof filters.certified === 'boolean') {
    results = results.filter((c) => c.certified === filters.certified);
  }
  return results;
}

export async function fetchConductorById(id) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from('conductors').select('*').eq('id', id).single();
    if (error) return null;
    return rowToConductor(data);
  }
  await delay();
  return mockConductors.find((c) => c.id === id) || null;
}

export async function fetchReviews(conductorId) {
  if (isSupabaseConfigured) {
    let query = supabase.from('reviews').select('*').order('created_at', { ascending: false });
    if (conductorId) query = query.eq('conductor_id', conductorId);
    const { data, error } = await query;
    if (error) throw new Error(`fetchReviews: ${error.message}`);
    return data.map(rowToReview);
  }
  await delay();
  if (!conductorId) return [...mockReviews];
  return mockReviews.filter((r) => r.conductorId === conductorId);
}

export async function submitBooking(booking) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('bookings')
      .insert({
        conductor_id: booking.conductorId,
        date: booking.date,
        slot: booking.slot,
        price: booking.price,
        status: 'confirmed',
      })
      .select()
      .single();
    if (error) throw new Error(`submitBooking: ${error.message}`);
    return { id: data.id, status: data.status, ...booking };
  }
  await delay();
  return { id: `booking-${Date.now()}`, status: 'confirmed', ...booking };
}

export async function createCheckoutSession(conductorId, slot) {
  // TODO: wire to Stripe — call your Edge Function / backend endpoint that
  // creates a Stripe Checkout Session and redirect to the returned url.
  await delay();
  return { id: `cs_mock_${Date.now()}`, conductorId, slot, url: '#mock-checkout' };
}

export async function submitProviderResponse(reviewId, text) {
  if (isSupabaseConfigured) {
    const { error } = await supabase.from('reviews').update({ response: text }).eq('id', reviewId);
    if (error) throw new Error(`submitProviderResponse: ${error.message}`);
    return { reviewId, response: text, updated: true };
  }
  await delay();
  return { reviewId, response: text, updated: true };
}

export async function moderateReview(id, action) {
  if (isSupabaseConfigured) {
    const status = { approve: 'approved', flag: 'flagged', remove: 'removed' }[action] ?? action;
    const { error } = await supabase.from('reviews').update({ status }).eq('id', id);
    if (error) throw new Error(`moderateReview: ${error.message}`);
    return { id, action, updated: true };
  }
  await delay();
  return { id, action, updated: true };
}

export async function updateProviderStatus(id, status) {
  if (isSupabaseConfigured) {
    const { error } = await supabase.from('conductors').update({ status }).eq('id', id);
    if (error) throw new Error(`updateProviderStatus: ${error.message}`);
    return { id, status, updated: true };
  }
  await delay();
  return { id, status, updated: true };
}

export async function assignSponsoredPlacement(slotId, conductorId) {
  if (isSupabaseConfigured) {
    const { error } = await supabase
      .from('sponsored_placements')
      .upsert({ slot_id: slotId, conductor_id: conductorId });
    if (error) throw new Error(`assignSponsoredPlacement: ${error.message}`);
    return { slotId, conductorId, updated: true };
  }
  await delay();
  return { slotId, conductorId, updated: true };
}
