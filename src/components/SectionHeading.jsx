export default function SectionHeading({ kicker, title, children }) {
  return (
    <div className="mx-auto mb-12 max-w-2xl text-center">
      {kicker && (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-neon neon-text">
          {kicker}
        </p>
      )}
      <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">{title}</h2>
      {children && <div className="mt-4 text-slate-400">{children}</div>}
    </div>
  );
}
