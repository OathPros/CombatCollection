import type { CombatDescription, RollInput, Weapon } from "@/lib/combat/types";

function matchesMode(description: CombatDescription, mode?: RollInput["primaryMode"]): boolean {
  if (!mode) return true;
  if (mode === "melee") return description.range === "Melee" || description.range === null;
  if (mode === "thrown") return description.range === "Throw";
  if (mode === "ranged") return description.range === "Ranged";
  if (mode === "twoHanded") return description.grip === "TwoHanded" || description.grip === "OptionalTwoHanded";
  return true;
}

export function filterByWeaponAndInput(
  descriptions: CombatDescription[],
  weapon: Weapon | undefined,
  attribute: RollInput["attribute"],
  mode?: RollInput["primaryMode"],
  selectedWeaponSlug?: string
): CombatDescription[] {
  let filtered = descriptions.filter((d) => d.status === "published");

  if (weapon) {
    const allowed = new Set(weapon.allowedProfiles);
    filtered = filtered.filter((d) => d.profileIds.some((id) => allowed.has(id)));
  }

  if (attribute) {
    filtered = filtered.filter((d) => d.attribute === attribute);
  }

  filtered = filtered.filter((d) => matchesMode(d, mode));

  if (selectedWeaponSlug) {
    filtered = filtered.filter((d) => !d.isWeaponSpecific || d.weaponSlugs.includes(selectedWeaponSlug));
  }

  return filtered;
}
