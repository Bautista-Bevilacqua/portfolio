export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-mono text-muted">
      {children}
    </span>
  );
}
