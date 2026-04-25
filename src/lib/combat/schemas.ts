import { z } from "zod";

export const attributeSchema = z.enum(["STR", "DEX"]);
export const motionSchema = z.enum(["Swing", "Thrust", "Draw", "Load", "Strike"]);
export const attackRangeSchema = z.enum(["Melee", "Ranged", "Throw"]);
export const gripSchema = z.enum(["OneHanded", "TwoHanded", "OptionalTwoHanded"]);
export const weaponModeSchema = z.enum(["melee", "thrown", "ranged", "twoHanded"]);

export const weaponSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  category: z.string().min(1),
  damageTypes: z.array(z.string()),
  canBeMelee: z.boolean(),
  canBeThrown: z.boolean(),
  canBeRanged: z.boolean(),
  twoHandedRequired: z.boolean(),
  versatileTwoHandedOptional: z.boolean(),
  allowedProfiles: z.array(z.string())
});

export const tagProfileSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  attribute: attributeSchema,
  motion: motionSchema,
  range: attackRangeSchema.nullable(),
  grip: gripSchema.nullable(),
  damageType: z.string().nullable(),
  description: z.string().nullable()
});

export const combatDescriptionSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  body: z.string(),
  bodyHtml: z.string().nullable(),
  author: z.string().min(1),
  sourceFile: z.string().nullable(),
  sourceSheet: z.string().nullable(),
  sourceRow: z.number().int().nullable(),
  sourceElements: z.string().nullable(),
  profileIds: z.array(z.string()).min(1),
  attribute: attributeSchema,
  motion: motionSchema,
  range: attackRangeSchema.nullable(),
  grip: gripSchema.nullable(),
  damageTypes: z.array(z.string()),
  weaponSlugs: z.array(z.string()),
  isWeaponSpecific: z.boolean(),
  tags: z.array(z.string()),
  sourceTags: z.array(z.string()),
  status: z.string().min(1),
  weight: z.number().int().positive()
});

export const characterSchema = z.object({
  id: z.string().optional(),
  userId: z.string().nullable().optional(),
  name: z.string().min(1),
  attackAttribute: attributeSchema.optional(),
  primaryWeaponSlug: z.string().optional(),
  primaryMode: weaponModeSchema.optional(),
  secondaryWeaponSlug: z.string().optional(),
  secondaryMode: weaponModeSchema.optional()
});

export const rollInputSchema = z.object({
  attribute: attributeSchema.optional(),
  primaryWeaponSlug: z.string().optional(),
  primaryMode: weaponModeSchema.optional(),
  secondaryWeaponSlug: z.string().optional(),
  secondaryMode: weaponModeSchema.optional(),
  count: z.number().int().min(1).max(20).optional()
});

export const weaponsArraySchema = z.array(weaponSchema);
export const tagProfilesArraySchema = z.array(tagProfileSchema);
export const descriptionsArraySchema = z.array(combatDescriptionSchema);
