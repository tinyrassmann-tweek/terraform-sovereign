import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './lib/auth.jsx';
import Layout from './components/Layout.jsx';

// Route-level code splitting: each portal loads on demand.
// The three.js hero scene only ships with the landing chunk.
const LandingPage = lazy(() => import('./pages/landing/LandingPage.jsx'));
const OnboardingPage = lazy(() => import('./pages/client/OnboardingPage.jsx'));
const ConductorsPage = lazy(() => import('./pages/client/ConductorsPage.jsx'));
const ConductorProfilePage = lazy(() => import('./pages/client/ConductorProfilePage.jsx'));
const ClientSettingsPage = lazy(() => import('./pages/client/ClientSettingsPage.jsx'));
const ProviderDashboard = lazy(() => import('./pages/provider/ProviderDashboard.jsx'));
const InstrumentsPage = lazy(() => import('./pages/provider/InstrumentsPage.jsx'));
const ProviderReviewsPage = lazy(() => import('./pages/provider/ProviderReviewsPage.jsx'));
const TuningPage = lazy(() => import('./pages/provider/TuningPage.jsx'));
const AdminOverview = lazy(() => import('./pages/admin/AdminOverview.jsx'));
const DirectoryManager = lazy(() => import('./pages/admin/DirectoryManager.jsx'));
const SponsoredManager = lazy(() => import('./pages/admin/SponsoredManager.jsx'));
const ReviewModerator = lazy(() => import('./pages/admin/ReviewModerator.jsx'));
const OpenSourceHub = lazy(() => import('./pages/opensource/OpenSourceHub.jsx'));

function RouteFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex items-center gap-3 text-neon">
        <span className="h-3 w-3 animate-ping rounded-full bg-neon" />
        <span className="font-display text-sm uppercase tracking-[0.3em]">Tuning…</span>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route path="/conductors" element={<ConductorsPage />} />
              <Route path="/conductors/:id" element={<ConductorProfilePage />} />
              <Route path="/client/settings" element={<ClientSettingsPage />} />
              <Route path="/provider" element={<ProviderDashboard />} />
              <Route path="/provider/instruments" element={<InstrumentsPage />} />
              <Route path="/provider/reviews" element={<ProviderReviewsPage />} />
              <Route path="/provider/tuning" element={<TuningPage />} />
              <Route path="/admin" element={<AdminOverview />} />
              <Route path="/admin/directory" element={<DirectoryManager />} />
              <Route path="/admin/sponsored" element={<SponsoredManager />} />
              <Route path="/admin/moderation" element={<ReviewModerator />} />
              <Route path="/opensource" element={<OpenSourceHub />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}
