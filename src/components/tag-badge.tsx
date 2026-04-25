export function TagBadge({ tag }: { tag: string }) {
  return (
    <span className="rounded-full border border-ember/40 bg-ember/10 px-2.5 py-1 text-[10px] uppercase tracking-widest text-parchment">
      {tag}
    </span>
  );
}
