export type Attribute = "STR" | "DEX";
export type Motion = "Swing" | "Thrust" | "Draw" | "Load" | "Strike";
export type AttackRange = "Melee" | "Ranged" | "Throw";
export type Grip = "OneHanded" | "TwoHanded" | "OptionalTwoHanded";

export type WeaponMode = "melee" | "thrown" | "ranged" | "twoHanded";

export interface Weapon {
  name: string;
  slug: string;
  category: string;
  damageTypes: string[];
  canBeMelee: boolean;
  canBeThrown: boolean;
  canBeRanged: boolean;
  twoHandedRequired: boolean;
  versatileTwoHandedOptional: boolean;
  allowedProfiles: string[];
}

export interface TagProfile {
  id: string;
  label: string;
  attribute: Attribute;
  motion: Motion;
  range: AttackRange | null;
  grip: Grip | null;
  damageType: string | null;
  description: string | null;
}

export interface CombatDescription {
  id: string;
  title: string;
  body: string;
  bodyHtml: string | null;
  author: string;
  sourceFile: string | null;
  sourceSheet: string | null;
  sourceRow: number | null;
  sourceElements: string | null;
  profileIds: string[];
  attribute: Attribute;
  motion: Motion;
  range: AttackRange | null;
  grip: Grip | null;
  damageTypes: string[];
  weaponSlugs: string[];
  isWeaponSpecific: boolean;
  tags: string[];
  sourceTags: string[];
  status: "published" | "draft" | "archived" | string;
  weight: number;
}

export interface Character {
  id?: string;
  userId?: string | null;
  name: string;
  attackAttribute?: Attribute;
  primaryWeaponSlug?: string;
  primaryMode?: WeaponMode;
  secondaryWeaponSlug?: string;
  secondaryMode?: WeaponMode;
}

export interface RollInput {
  attribute?: Attribute;
  primaryWeaponSlug?: string;
  primaryMode?: WeaponMode;
  secondaryWeaponSlug?: string;
  secondaryMode?: WeaponMode;
  count?: number;
}

export interface RollResult {
  description: CombatDescription;
  resultSource?: "primary" | "secondary";
  matchingProfileIds?: string[];
}

export interface LoadedCombatData {
  weapons: Weapon[];
  tagProfiles: TagProfile[];
  descriptions: CombatDescription[];
}
