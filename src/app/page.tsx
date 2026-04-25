import { AppShell } from "@/components/app-shell";
import { CharacterTabs } from "@/components/character-tabs";
import { loadCombatData } from "@/lib/combat/load-data";
import { listCharacters } from "@/server/actions/list-characters";
import type { Character, WeaponMode } from "@/lib/combat/types";

export default async function HomePage() {
  const data = await loadCombatData();
  const savedCharacters = process.env.DATABASE_URL ? await listCharacters() : [];
  const initialCharacters: Character[] = savedCharacters.map((character) => ({
    id: character.id,
    userId: character.userId,
    name: character.name,
    attackAttribute: character.attackAttribute === "STR" || character.attackAttribute === "DEX" ? character.attackAttribute : undefined,
    primaryWeaponSlug: character.primaryWeaponSlug ?? undefined,
    primaryMode: character.primaryMode as WeaponMode | undefined,
    secondaryWeaponSlug: character.secondaryWeaponSlug ?? undefined,
    secondaryMode: character.secondaryMode as WeaponMode | undefined
  }));

  return (
    <AppShell>
      <CharacterTabs data={data} initialCharacters={initialCharacters} />
    </AppShell>
  );
}
