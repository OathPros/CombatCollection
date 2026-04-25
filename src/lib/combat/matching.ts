import type { CombatDescription, RollInput, TagProfile, Weapon } from "@/lib/combat/types";

function matchesModeByRange(range: TagProfile["range"] | null, mode?: RollInput["primaryMode"]): boolean {
  if (!mode) return true;
  if (mode === "melee") return range === "Melee" || range === null;
  if (mode === "thrown") return range === "Throw";
  if (mode === "ranged") return range === "Ranged";
  if (mode === "twoHanded") return true;
  return true;
}

function resolveMatchingProfileIds(
  description: CombatDescription,
  tagProfiles: TagProfile[],
  attribute: RollInput["attribute"],
  mode?: RollInput["primaryMode"]
): string[] {
  const profileById = new Map(tagProfiles.map((profile) => [profile.id, profile]));
  const profileIds = description.profileIds.length > 0 ? description.profileIds : [];

  if (profileIds.length === 0) {
    const matchesAttribute = !attribute || description.attribute === attribute;
    const matchesMode = matchesModeByRange(description.range, mode);
    return matchesAttribute && matchesMode ? ["legacy-fallback"] : [];
  }

  return profileIds.filter((id) => {
    const profile = profileById.get(id);
    if (!profile) return false;

    const matchesAttribute = !attribute || profile.attribute === attribute;
    const matchesMode = matchesModeByRange(profile.range, mode);
    return matchesAttribute && matchesMode;
  });
}

export function filterByWeaponAndInput(
  descriptions: CombatDescription[],
  tagProfiles: TagProfile[],
  weapon: Weapon | undefined,
  attribute: RollInput["attribute"],
  mode?: RollInput["primaryMode"],
  selectedWeaponSlug?: string
): CombatDescription[] {
  let filtered = descriptions.filter((d) => d.status === "published");
  const allowed = weapon ? new Set(weapon.allowedProfiles) : undefined;

  filtered = filtered.filter((description) => {
    const matchingProfileIds = resolveMatchingProfileIds(description, tagProfiles, attribute, mode);
    if (matchingProfileIds.length === 0) return false;
    if (!allowed) return true;
    return matchingProfileIds.some((id) => allowed.has(id));
  });

  if (selectedWeaponSlug) {
    filtered = filtered.filter((d) => !d.isWeaponSpecific || d.weaponSlugs.includes(selectedWeaponSlug));
  }

  return filtered;
}
