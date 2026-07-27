export default function StarRating({ value = 0, size = 16 }) {
  const clamped = Math.max(0, Math.min(5, value));

  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${clamped} out of 5 stars`}>
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.max(0, Math.min(1, clamped - i));
        const pct = `${Math.round(fill * 100)}%`;
        return (
          <span key={i} className="relative inline-block leading-none" style={{ width: size, height: size }}>
            <span className="absolute inset-0 text-white/20" style={{ fontSize: size }}>
              ★
            </span>
            <span
              className="absolute inset-0 overflow-hidden text-gold"
              style={{ width: pct, fontSize: size }}
            >
              ★
            </span>
          </span>
        );
      })}
    </span>
  );
}
