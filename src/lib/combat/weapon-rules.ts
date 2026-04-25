import type { Attribute, LoadedCombatData, TagProfile, Weapon, WeaponMode } from "@/lib/combat/types";

const ATTRIBUTE_ORDER: Attribute[] = ["STR", "DEX"];
const MODE_ORDER: WeaponMode[] = ["melee", "thrown", "ranged", "twoHanded"];

function getProfilesForWeapon(weapon: Weapon | undefined, tagProfiles: TagProfile[]): TagProfile[] {
  if (!weapon) return [];
  const allowed = new Set(weapon.allowedProfiles);
  return tagProfiles.filter((profile) => allowed.has(profile.id));
}

function toUniqueSorted<T extends string>(values: T[], order: T[]): T[] {
  const unique = new Set(values);
  return order.filter((value) => unique.has(value));
}

export function getValidAttributesForWeapon(weapon: Weapon | undefined, tagProfiles: TagProfile[]): Attribute[] {
  const profiles = getProfilesForWeapon(weapon, tagProfiles);
  if (profiles.length === 0) {
    return [...ATTRIBUTE_ORDER];
  }

  return toUniqueSorted(
    profiles.map((profile) => profile.attribute),
    ATTRIBUTE_ORDER
  );
}

export function getValidModesForWeapon(weapon: Weapon | undefined, tagProfiles: TagProfile[]): WeaponMode[] {
  const profiles = getProfilesForWeapon(weapon, tagProfiles);
  if (profiles.length === 0) {
    return [];
  }

  const modes: WeaponMode[] = [];

  if (profiles.some((profile) => profile.range === "Melee" || profile.range === null)) {
    modes.push("melee");
  }
  if (profiles.some((profile) => profile.range === "Throw")) {
    modes.push("thrown");
  }
  if (profiles.some((profile) => profile.range === "Ranged")) {
    modes.push("ranged");
  }
  if (
    profiles.some((profile) => profile.grip === "TwoHanded" || profile.grip === "OptionalTwoHanded") &&
    profiles.some((profile) => profile.grip === "OneHanded")
  ) {
    modes.push("twoHanded");
  }

  return toUniqueSorted(modes, MODE_ORDER);
}

export function ensureValidSelection<T extends string>(value: T | undefined, validValues: T[]): T | undefined {
  if (validValues.length === 0) return undefined;
  if (!value) return validValues[0];
  return validValues.includes(value) ? value : validValues[0];
}

export function shouldDisableSecondaryWeapon(weapon?: Weapon | null, useTwoHands = false): boolean {
  if (!weapon) return false;
  if (weapon.twoHandedRequired) return true;
  if (weapon.versatileTwoHandedOptional && useTwoHands) return true;
  return false;
}

export function getWeaponBySlug(data: LoadedCombatData, weaponSlug?: string): Weapon | undefined {
  if (!weaponSlug) return undefined;
  return data.weapons.find((weapon) => weapon.slug === weaponSlug);
}
