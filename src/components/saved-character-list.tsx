import type { Character } from "@/lib/combat/types";

export function SavedCharacterList({
  characters,
  onLoadCharacter
}: {
  characters: Character[];
  onLoadCharacter: (character: Character) => void;
}) {
  if (!characters.length) {
    return <p className="text-sm text-zinc-300">No saved characters yet.</p>;
  }

  return (
    <ul className="space-y-2">
      {characters.map((character, idx) => (
        <li key={character.id ?? `${character.name}-${idx}`} className="rounded border border-zinc-700 p-3 text-sm">
          <p className="font-semibold">{character.name}</p>
          <p className="text-zinc-300">
            {character.attackAttribute ?? "No attribute"} · {character.primaryWeaponSlug ?? "No primary weapon"} ({character.primaryMode ?? "no mode"})
          </p>
          <p className="text-zinc-400">
            Secondary: {character.secondaryWeaponSlug ?? "none"}
            {character.secondaryWeaponSlug ? ` (${character.secondaryMode ?? "no mode"})` : ""}
          </p>
          <button
            type="button"
            onClick={() => onLoadCharacter(character)}
            className="mt-2 rounded border border-zinc-600 px-2 py-1 text-xs hover:bg-zinc-900"
          >
            Load Character
          </button>
        </li>
      ))}
    </ul>
  );
}
