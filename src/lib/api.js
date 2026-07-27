// Stub API layer — returns mock data with a small artificial delay.
// TODO: wire to Supabase

import { mockConductors } from '../data/mockConductors.js';
import { mockReviews } from '../data/mockReviews.js';

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchConductors(filters = {}) {
  // TODO: wire to Supabase
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
  // TODO: wire to Supabase
  await delay();
  return mockConductors.find((c) => c.id === id) || null;
}

export async function fetchReviews(conductorId) {
  // TODO: wire to Supabase
  await delay();
  if (!conductorId) return [...mockReviews];
  return mockReviews.filter((r) => r.conductorId === conductorId);
}

export async function submitBooking(booking) {
  // TODO: wire to Supabase
  await delay();
  return { id: `booking-${Date.now()}`, status: 'confirmed', ...booking };
}

export async function createCheckoutSession(conductorId, slot) {
  // TODO: wire to Stripe
  await delay();
  return { id: `cs_mock_${Date.now()}`, conductorId, slot, url: '#mock-checkout' };
}

export async function submitProviderResponse(reviewId, text) {
  // TODO: wire to Supabase
  await delay();
  return { reviewId, response: text, updated: true };
}

export async function moderateReview(id, action) {
  // TODO: wire to Supabase
  await delay();
  return { id, action, updated: true };
}

export async function updateProviderStatus(id, status) {
  // TODO: wire to Supabase
  await delay();
  return { id, status, updated: true };
}

export async function assignSponsoredPlacement(slotId, conductorId) {
  // TODO: wire to Supabase
  await delay();
  return { slotId, conductorId, updated: true };
}
