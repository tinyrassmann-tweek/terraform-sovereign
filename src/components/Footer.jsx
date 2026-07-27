import { Link } from 'react-router-dom';
import { BRAND } from '../data/constants.js';

const PORTAL_LINKS = [
  { label: 'Overture', to: '/' },
  { label: 'Audience', to: '/conductors' },
  { label: 'First Chair', to: '/provider' },
  { label: 'Maestro', to: '/admin' },
  { label: 'Open Score', to: '/opensource' },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-obsidian py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 text-center sm:px-6">
        <Link to="/" className="font-display text-lg font-bold text-white">
          <span className="text-neon">♪</span> {BRAND.platform}
        </Link>
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-slate-400">
          {PORTAL_LINKS.map((link) => (
            <Link key={link.to} to={link.to} className="transition-colors hover:text-neon">
              {link.label}
            </Link>
          ))}
        </nav>
        <p className="text-xs text-slate-500">
          {BRAND.method}™ — {BRAND.tagline}
        </p>
      </div>
    </footer>
  );
}
