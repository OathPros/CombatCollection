interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-zinc-700 bg-zinc-900/70 p-6 text-center">
      <h3 className="font-serif text-xl text-parchment">{title}</h3>
      <p className="mt-2 text-sm text-zinc-300">{description}</p>
    </div>
  );
}
