export function Tag({ children }: { children: string }) {
  return (
    <span dir="auto" className="px-2.5 py-1 text-[11px] font-medium rounded-md bg-surface-alt text-muted border border-border/60">
      {children}
    </span>
  );
}
