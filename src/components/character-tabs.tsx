"use client";

import { useState } from "react";
import type { Character, LoadedCombatData } from "@/lib/combat/types";
import { CharacterForm } from "@/components/character-form";
import { SavedCharacterList } from "@/components/saved-character-list";

export function CharacterTabs({ data, initialCharacters }: { data: LoadedCombatData; initialCharacters: Character[] }) {
  const [tab, setTab] = useState<"new" | "saved">("new");
  const [characters, setCharacters] = useState<Character[]>(initialCharacters);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | undefined>();

  const onSaveCharacter = (savedCharacter: Character) => {
    setCharacters((prev) => {
      const existingIndex = prev.findIndex((character) => character.id === savedCharacter.id);
      if (existingIndex >= 0) {
        const next = [...prev];
        next[existingIndex] = savedCharacter;
        return next;
      }
      return [savedCharacter, ...prev];
    });
  };

  const onLoadCharacter = (character: Character) => {
    setSelectedCharacter(character);
    setTab("new");
  };

  return (
    <div className="rounded-xl border border-zinc-700 bg-panel/90 p-4">
      <div className="mb-4 flex gap-2">
        <button className="rounded border px-3 py-1" onClick={() => setTab("new")}>New Character</button>
        <button className="rounded border px-3 py-1" onClick={() => setTab("saved")}>My Characters</button>
      </div>
      {tab === "new" ? (
        <CharacterForm data={data} initialCharacter={selectedCharacter} onSaveCharacter={onSaveCharacter} />
      ) : (
        <SavedCharacterList characters={characters} onLoadCharacter={onLoadCharacter} />
      )}
    </div>
  );
}
