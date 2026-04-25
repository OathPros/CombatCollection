import { weightedSampleUnique } from "@/lib/combat/randomize";
import { filterByWeaponAndInput } from "@/lib/combat/matching";
import type { LoadedCombatData, RollInput, RollResult } from "@/lib/combat/types";

const DEFAULT_COUNT = 6;

function normalizeCount(input?: number): number {
  if (!input) return DEFAULT_COUNT;
  return Math.max(4, Math.min(8, input));
}

function interleave<T>(a: T[], b: T[]): T[] {
  const result: T[] = [];
  const max = Math.max(a.length, b.length);
  for (let i = 0; i < max; i += 1) {
    if (a[i]) result.push(a[i]);
    if (b[i]) result.push(b[i]);
  }
  return result;
}

export function rollDescriptions(input: RollInput, data: LoadedCombatData): RollResult[] {
  const count = normalizeCount(input.count);
  const published = data.descriptions.filter((d) => d.status === "published");

  if (!input.attribute && !input.primaryWeaponSlug && !input.secondaryWeaponSlug && !input.primaryMode && !input.secondaryMode) {
    return weightedSampleUnique(published, count).map((description) => ({ description }));
  }

  const primaryWeapon = data.weapons.find((w) => w.slug === input.primaryWeaponSlug);
  const secondaryWeapon = data.weapons.find((w) => w.slug === input.secondaryWeaponSlug);

  const primaryPool = filterByWeaponAndInput(
    data.descriptions,
    primaryWeapon,
    input.attribute,
    input.primaryMode,
    input.primaryWeaponSlug
  );

  if (!secondaryWeapon || !input.secondaryWeaponSlug) {
    return weightedSampleUnique(primaryPool, count).map((description) => ({ description, resultSource: "primary" }));
  }

  const secondaryPool = filterByWeaponAndInput(
    data.descriptions,
    secondaryWeapon,
    input.attribute,
    input.secondaryMode,
    input.secondaryWeaponSlug
  );

  const half = Math.ceil(count / 2);
  const primary = weightedSampleUnique(primaryPool, half).map((description) => ({ description, resultSource: "primary" as const }));
  const primaryIds = new Set(primary.map((result) => result.description.id));
  const distinctSecondaryPool = secondaryPool.filter((description) => !primaryIds.has(description.id));
  const secondarySamplePool = distinctSecondaryPool.length > 0 ? distinctSecondaryPool : secondaryPool;
  const secondary = weightedSampleUnique(secondarySamplePool, half).map((description) => ({
    description,
    resultSource: "secondary" as const
  }));

  const combined = interleave(primary, secondary);
  const deduped: RollResult[] = [];
  const seen = new Set<string>();
  for (const result of combined) {
    if (!seen.has(result.description.id)) {
      deduped.push(result);
      seen.add(result.description.id);
    }
    if (deduped.length >= count) break;
  }

  return deduped;
}
