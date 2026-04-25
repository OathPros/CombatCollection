"use client";

import { useEffect, useMemo, useState } from "react";
import { AttackAttributeSelector } from "@/components/attack-attribute-selector";
import { WeaponSelect } from "@/components/weapon-select";
import { WeaponModeSelector } from "@/components/weapon-mode-selector";
import { RollButton } from "@/components/roll-button";
import { DescriptionResults } from "@/components/description-results";
import { EmptyState } from "@/components/empty-state";
import {
  ensureValidSelection,
  getValidAttributesForWeapon,
  getValidModesForWeapon,
  getWeaponBySlug,
  getWeaponsForAttribute,
  shouldDisableSecondaryWeapon
} from "@/lib/combat/weapon-rules";
import { listAllMatchingDescriptions, rollDescriptions } from "@/lib/combat/filtering";
import type { Character, LoadedCombatData, RollResult, WeaponMode } from "@/lib/combat/types";
import { saveCharacter } from "@/server/actions/save-character";

export function CharacterForm({
  data,
  initialCharacter,
  onSaveCharacter
}: {
  data: LoadedCombatData;
  initialCharacter?: Character;
  onSaveCharacter?: (character: Character) => void;
}) {
  const [id, setId] = useState<string | undefined>();
  const [name, setName] = useState("");
  const [attribute, setAttribute] = useState<"STR" | "DEX" | undefined>();
  const [primaryWeaponSlug, setPrimaryWeaponSlug] = useState<string>();
  const [primaryMode, setPrimaryMode] = useState<WeaponMode>();
  const [secondaryWeaponSlug, setSecondaryWeaponSlug] = useState<string>();
  const [secondaryMode, setSecondaryMode] = useState<WeaponMode>();
  const [useTwoHands, setUseTwoHands] = useState(false);
  const [results, setResults] = useState<RollResult[]>([]);
  const [allResults, setAllResults] = useState<RollResult[]>([]);
  const [hasRolled, setHasRolled] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const primaryWeapon = useMemo(() => getWeaponBySlug(data, primaryWeaponSlug), [data, primaryWeaponSlug]);
  const secondaryWeapon = useMemo(() => getWeaponBySlug(data, secondaryWeaponSlug), [data, secondaryWeaponSlug]);

  const filteredWeapons = useMemo(
    () => getWeaponsForAttribute(data.weapons, data.tagProfiles, attribute),
    [attribute, data.tagProfiles, data.weapons]
  );

  const validAttributes = useMemo(
    () => getValidAttributesForWeapon(primaryWeapon, data.tagProfiles),
    [data.tagProfiles, primaryWeapon]
  );
  const primaryValidModes = useMemo(() => getValidModesForWeapon(primaryWeapon, data.tagProfiles), [data.tagProfiles, primaryWeapon]);
  const secondaryValidModes = useMemo(
    () => getValidModesForWeapon(secondaryWeapon, data.tagProfiles),
    [data.tagProfiles, secondaryWeapon]
  );

  useEffect(() => {
    if (!initialCharacter) return;
    setId(initialCharacter.id);
    setName(initialCharacter.name ?? "");
    setAttribute(initialCharacter.attackAttribute);
    setPrimaryWeaponSlug(initialCharacter.primaryWeaponSlug);
    setPrimaryMode(initialCharacter.primaryMode);
    setSecondaryWeaponSlug(initialCharacter.secondaryWeaponSlug);
    setSecondaryMode(initialCharacter.secondaryMode);
    setResults([]);
    setAllResults([]);
    setHasRolled(false);
  }, [initialCharacter]);

  useEffect(() => {
    const nextAttribute = ensureValidSelection(attribute, validAttributes);
    if (nextAttribute !== attribute) {
      setAttribute(nextAttribute);
    }
  }, [attribute, validAttributes]);

  useEffect(() => {
    const nextPrimaryMode = ensureValidSelection(primaryMode, primaryValidModes);
    if (nextPrimaryMode !== primaryMode) {
      setPrimaryMode(nextPrimaryMode);
    }
  }, [primaryMode, primaryValidModes]);

  useEffect(() => {
    const nextSecondaryMode = ensureValidSelection(secondaryMode, secondaryValidModes);
    if (nextSecondaryMode !== secondaryMode) {
      setSecondaryMode(nextSecondaryMode);
    }
  }, [secondaryMode, secondaryValidModes]);


  useEffect(() => {
    if (primaryWeaponSlug && !filteredWeapons.some((weapon) => weapon.slug === primaryWeaponSlug)) {
      setPrimaryWeaponSlug(undefined);
    }

    if (secondaryWeaponSlug && !filteredWeapons.some((weapon) => weapon.slug === secondaryWeaponSlug)) {
      setSecondaryWeaponSlug(undefined);
    }
  }, [filteredWeapons, primaryWeaponSlug, secondaryWeaponSlug]);

  const disableSecondary = shouldDisableSecondaryWeapon(primaryWeapon, useTwoHands);

  const onRoll = () => {
    const safeAttribute = ensureValidSelection(attribute, validAttributes);
    const safePrimaryMode = ensureValidSelection(primaryMode, primaryValidModes);
    const safeSecondaryMode = ensureValidSelection(secondaryMode, secondaryValidModes);

    setAttribute(safeAttribute);
    setPrimaryMode(safePrimaryMode);
    setSecondaryMode(safeSecondaryMode);
    setHasRolled(true);

    const input = {
      attribute: safeAttribute,
      primaryWeaponSlug,
      primaryMode: safePrimaryMode,
      secondaryWeaponSlug: disableSecondary ? undefined : secondaryWeaponSlug,
      secondaryMode: disableSecondary ? undefined : safeSecondaryMode
    };

    setResults(rollDescriptions(input, data));
    setAllResults(listAllMatchingDescriptions(input, data));
  };

  const onSave = async () => {
    if (!name.trim()) return;

    setIsSaving(true);
    try {
      const saved = await saveCharacter({
        id,
        name: name.trim(),
        attackAttribute: attribute,
        primaryWeaponSlug,
        primaryMode,
        secondaryWeaponSlug: disableSecondary ? undefined : secondaryWeaponSlug,
        secondaryMode: disableSecondary ? undefined : secondaryMode
      });
      const savedCharacter: Character = {
        id: saved.id,
        userId: saved.userId,
        name: saved.name,
        attackAttribute: saved.attackAttribute === "STR" || saved.attackAttribute === "DEX" ? saved.attackAttribute : undefined,
        primaryWeaponSlug: saved.primaryWeaponSlug ?? undefined,
        primaryMode: saved.primaryMode as WeaponMode | undefined,
        secondaryWeaponSlug: saved.secondaryWeaponSlug ?? undefined,
        secondaryMode: saved.secondaryMode as WeaponMode | undefined
      };
      setId(savedCharacter.id);
      onSaveCharacter?.(savedCharacter);
    } finally {
      setIsSaving(false);
    }
  };

  if (!data.weapons.length) {
    return (
      <EmptyState
        title="No weapons available"
        description="Populate /data/weapons.json to enable weapon selection and filtering."
      />
    );
  }

  return (
    <div className="space-y-4">
      <label className="grid gap-1 text-sm">
        <span>Character Name</span>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="rounded border border-zinc-700 bg-zinc-900 px-3 py-2"
          placeholder="Aria Emberblade"
        />
      </label>

      <AttackAttributeSelector value={attribute} validAttributes={validAttributes} onChange={setAttribute} />

      <WeaponSelect id="primaryWeapon" label="Primary weapon" weapons={filteredWeapons} value={primaryWeaponSlug} onChange={setPrimaryWeaponSlug} />
      <WeaponModeSelector value={primaryMode} validModes={primaryValidModes} onChange={setPrimaryMode} />

      {primaryWeapon?.versatileTwoHandedOptional ? (
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={useTwoHands} onChange={(e) => setUseTwoHands(e.target.checked)} />
          Use two hands?
        </label>
      ) : null}

      <WeaponSelect
        id="secondaryWeapon"
        label="Secondary weapon (optional)"
        weapons={filteredWeapons}
        value={secondaryWeaponSlug}
        onChange={setSecondaryWeaponSlug}
        disabled={disableSecondary}
      />
      {!disableSecondary ? <WeaponModeSelector value={secondaryMode} validModes={secondaryValidModes} onChange={setSecondaryMode} /> : null}

      <div className="flex gap-2">
        <RollButton onClick={onRoll} hasRolled={hasRolled} />
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving || !name.trim()}
          className="rounded border border-zinc-600 px-4 py-2 text-sm disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save Character"}
        </button>
      </div>

      <DescriptionResults results={results} allResults={allResults} hasRolled={hasRolled} />
    </div>
  );
}
