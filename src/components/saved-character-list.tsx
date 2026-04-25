import type { Character } from "@/lib/combat/types";

export function SavedCharacterList({ characters }: { characters: Character[] }) {
  if (!characters.length) {
    return <p className="text-sm text-zinc-300">No saved characters yet.</p>;
  }

  return (
    <ul className="space-y-2">
      {characters.map((character, idx) => (
        <li key={character.id ?? `${character.name}-${idx}`} className="rounded border border-zinc-700 p-3 text-sm">
          <p className="font-semibold">{character.name}</p>
          <p className="text-zinc-300">
            {character.attackAttribute ?? "No attribute"} · {character.primaryWeaponSlug ?? "No weapon"}
          </p>
        </li>
      ))}
    </ul>
  );
}
