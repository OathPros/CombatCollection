"use client";

import { useState } from "react";
import type { Character, LoadedCombatData } from "@/lib/combat/types";
import { CharacterForm } from "@/components/character-form";
import { SavedCharacterList } from "@/components/saved-character-list";

export function CharacterTabs({ data, initialCharacters }: { data: LoadedCombatData; initialCharacters: Character[] }) {
  const [tab, setTab] = useState<"new" | "saved">("new");

  return (
    <div className="rounded-xl border border-zinc-700 bg-panel/90 p-4">
      <div className="mb-4 flex gap-2">
        <button className="rounded border px-3 py-1" onClick={() => setTab("new")}>New Character</button>
        <button className="rounded border px-3 py-1" onClick={() => setTab("saved")}>My Characters</button>
      </div>
      {tab === "new" ? <CharacterForm data={data} /> : <SavedCharacterList characters={initialCharacters} />}
    </div>
  );
}
