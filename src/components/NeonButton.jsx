import { Link } from 'react-router-dom';

const VARIANTS = {
  primary:
    'btn-glow bg-gradient-to-r from-neon to-pulse text-void font-semibold hover:brightness-110',
  ghost:
    'border border-white/20 text-slate-200 hover:border-neon/60 hover:text-neon',
  gold:
    'bg-gradient-to-r from-gold to-amber-500 text-void font-semibold hover:brightness-110',
};

export default function NeonButton({
  to,
  href,
  onClick,
  variant = 'primary',
  className = '',
  children,
}) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm transition-all duration-300 ${VARIANTS[variant] || VARIANTS.primary} ${className}`.trim();

  if (to) {
    return (
      <Link to={to} className={classes} onClick={onClick}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={classes} onClick={onClick}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" className={classes} onClick={onClick}>
      {children}
    </button>
  );
}
