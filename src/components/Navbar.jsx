import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../lib/auth.jsx';

const PORTAL_LINKS = [
  { label: 'Overture', to: '/' },
  { label: 'Audience', to: '/conductors' },
  { label: 'First Chair', to: '/provider' },
  { label: 'Maestro', to: '/admin' },
  { label: 'Open Score', to: '/opensource' },
];

export default function Navbar() {
  const { user, signInWithGoogle } = useAuth();
  const [open, setOpen] = useState(false);

  const linkClasses = ({ isActive }) =>
    `transition-colors hover:text-neon ${isActive ? 'text-neon' : 'text-slate-300'}`;

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-void/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="font-display text-lg font-bold text-white">
          <span className="text-neon neon-text">♪</span> Think Tank Solutions AI
        </Link>

        <div className="hidden items-center gap-6 text-sm md:flex">
          {PORTAL_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === '/'} className={linkClasses}>
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center md:flex">
          {user ? (
            <Link
              to="/client/settings"
              className="flex h-9 w-9 items-center justify-center rounded-full font-semibold text-void"
              style={{ backgroundColor: user.avatarColor }}
              title={user.name}
            >
              {user.name.charAt(0)}
            </Link>
          ) : (
            <button
              type="button"
              onClick={signInWithGoogle}
              className="rounded-xl border border-neon/40 px-4 py-2 text-sm text-neon transition-colors hover:bg-neon/10"
            >
              Sign in
            </button>
          )}
        </div>

        <button
          type="button"
          className="text-slate-200 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? '✕' : '☰'}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-void/95 px-4 py-4 backdrop-blur-md md:hidden">
          <div className="flex flex-col gap-3 text-sm">
            {PORTAL_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={linkClasses}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
            {user ? (
              <Link to="/client/settings" className="text-neon" onClick={() => setOpen(false)}>
                {user.name} — Settings
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => {
                  signInWithGoogle();
                  setOpen(false);
                }}
                className="text-left text-neon"
              >
                Sign in
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
