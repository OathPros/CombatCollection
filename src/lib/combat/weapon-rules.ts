import type { Weapon } from "@/lib/combat/types";

export function shouldDisableSecondaryWeapon(weapon?: Weapon | null, useTwoHands = false): boolean {
  if (!weapon) return false;
  if (weapon.twoHandedRequired) return true;
  if (weapon.versatileTwoHandedOptional && useTwoHands) return true;
  return false;
}
