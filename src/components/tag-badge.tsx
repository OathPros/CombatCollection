export function TagBadge({ tag }: { tag: string }) {
  return <span className="rounded bg-zinc-800 px-2 py-1 text-[10px] uppercase tracking-widest text-zinc-200">{tag}</span>;
}
