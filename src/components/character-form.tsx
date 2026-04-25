"use client";

import { useMemo, useState } from "react";
import { AttackAttributeSelector } from "@/components/attack-attribute-selector";
import { WeaponSelect } from "@/components/weapon-select";
import { WeaponModeSelector } from "@/components/weapon-mode-selector";
import { RollButton } from "@/components/roll-button";
import { DescriptionResults } from "@/components/description-results";
import { EmptyState } from "@/components/empty-state";
import { shouldDisableSecondaryWeapon } from "@/lib/combat/weapon-rules";
import { rollDescriptions } from "@/lib/combat/filtering";
import type { LoadedCombatData, RollResult, WeaponMode } from "@/lib/combat/types";

export function CharacterForm({ data }: { data: LoadedCombatData }) {
  const [name, setName] = useState("");
  const [attribute, setAttribute] = useState<"STR" | "DEX" | undefined>();
  const [primaryWeaponSlug, setPrimaryWeaponSlug] = useState<string>();
  const [primaryMode, setPrimaryMode] = useState<WeaponMode>();
  const [secondaryWeaponSlug, setSecondaryWeaponSlug] = useState<string>();
  const [secondaryMode, setSecondaryMode] = useState<WeaponMode>();
  const [useTwoHands, setUseTwoHands] = useState(false);
  const [results, setResults] = useState<RollResult[]>([]);
  const [hasRolled, setHasRolled] = useState(false);

  const primaryWeapon = useMemo(
    () => data.weapons.find((w) => w.slug === primaryWeaponSlug),
    [data.weapons, primaryWeaponSlug]
  );

  const disableSecondary = shouldDisableSecondaryWeapon(primaryWeapon, useTwoHands);

  const onRoll = () => {
    setHasRolled(true);
    setResults(
      rollDescriptions(
        {
          attribute,
          primaryWeaponSlug,
          primaryMode,
          secondaryWeaponSlug: disableSecondary ? undefined : secondaryWeaponSlug,
          secondaryMode: disableSecondary ? undefined : secondaryMode
        },
        data
      )
    );
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

      <AttackAttributeSelector value={attribute} onChange={setAttribute} />

      <WeaponSelect id="primaryWeapon" label="Primary weapon" weapons={data.weapons} value={primaryWeaponSlug} onChange={setPrimaryWeaponSlug} />
      <WeaponModeSelector weapon={primaryWeapon} value={primaryMode} onChange={setPrimaryMode} />

      {primaryWeapon?.versatileTwoHandedOptional ? (
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={useTwoHands} onChange={(e) => setUseTwoHands(e.target.checked)} />
          Use two hands?
        </label>
      ) : null}

      <WeaponSelect
        id="secondaryWeapon"
        label="Secondary weapon (optional)"
        weapons={data.weapons}
        value={secondaryWeaponSlug}
        onChange={setSecondaryWeaponSlug}
        disabled={disableSecondary}
      />
      {!disableSecondary ? (
        <WeaponModeSelector
          weapon={data.weapons.find((w) => w.slug === secondaryWeaponSlug)}
          value={secondaryMode}
          onChange={setSecondaryMode}
        />
      ) : null}

      <div className="flex gap-2">
        <RollButton onClick={onRoll} />
        <button type="button" className="rounded border border-zinc-600 px-4 py-2 text-sm">
          Save Character
        </button>
      </div>

      <DescriptionResults results={results} hasRolled={hasRolled} />
    </div>
  );
}
