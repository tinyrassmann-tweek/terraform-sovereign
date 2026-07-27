export default function GlassCard({ className = '', hover = false, children }) {
  return (
    <div className={`glass ${hover ? 'glass-hover' : ''} ${className}`.trim()}>
      {children}
    </div>
  );
}
