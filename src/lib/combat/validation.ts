import { ZodError } from "zod";
import {
  descriptionsArraySchema,
  tagProfilesArraySchema,
  weaponsArraySchema
} from "@/lib/combat/schemas";
import type { LoadedCombatData } from "@/lib/combat/types";

function duplicateValues(values: string[]): string[] {
  const seen = new Set<string>();
  const dupes = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) dupes.add(value);
    seen.add(value);
  }
  return [...dupes];
}

export function formatZodError(error: ZodError, name: string): string {
  const issues = error.issues.map((issue) => `- ${name}${issue.path.length ? `.${issue.path.join(".")}` : ""}: ${issue.message}`);
  return `Invalid ${name} JSON:\n${issues.join("\n")}`;
}

export function validateCombatData(raw: {
  weapons: unknown;
  tagProfiles: unknown;
  descriptions: unknown;
}): LoadedCombatData {
  const weapons = weaponsArraySchema.parse(raw.weapons);
  const tagProfiles = tagProfilesArraySchema.parse(raw.tagProfiles);
  const descriptions = descriptionsArraySchema.parse(raw.descriptions);

  const errors: string[] = [];

  const duplicateWeaponSlugs = duplicateValues(weapons.map((w) => w.slug));
  if (duplicateWeaponSlugs.length) {
    errors.push(`Duplicate weapon slugs: ${duplicateWeaponSlugs.join(", ")}`);
  }

  const duplicateTagProfileIds = duplicateValues(tagProfiles.map((p) => p.id));
  if (duplicateTagProfileIds.length) {
    errors.push(`Duplicate tag profile IDs: ${duplicateTagProfileIds.join(", ")}`);
  }

  const duplicateDescriptionIds = duplicateValues(descriptions.map((d) => d.id));
  if (duplicateDescriptionIds.length) {
    errors.push(`Duplicate description IDs: ${duplicateDescriptionIds.join(", ")}`);
  }

  const profileSet = new Set(tagProfiles.map((profile) => profile.id));
  const weaponSet = new Set(weapons.map((weapon) => weapon.slug));

  for (const weapon of weapons) {
    const missing = weapon.allowedProfiles.filter((profileId) => !profileSet.has(profileId));
    if (missing.length) {
      errors.push(`Weapon '${weapon.slug}' has unknown allowedProfiles: ${missing.join(", ")}`);
    }
  }

  for (const description of descriptions) {
    if (description.profileIds.length === 0) {
      errors.push(`Description '${description.id}' must include at least one profileId`);
    }
    if (description.status === "published" && !description.body.trim()) {
      errors.push(`Published description '${description.id}' must include non-empty body`);
    }

    const missingProfiles = description.profileIds.filter((profileId) => !profileSet.has(profileId));
    if (missingProfiles.length) {
      errors.push(`Description '${description.id}' has unknown profileIds: ${missingProfiles.join(", ")}`);
    }

    const missingWeapons = description.weaponSlugs.filter((slug) => !weaponSet.has(slug));
    if (missingWeapons.length) {
      errors.push(`Description '${description.id}' has unknown weaponSlugs: ${missingWeapons.join(", ")}`);
    }
  }

  if (errors.length) {
    throw new Error(`Combat content validation failed:\n${errors.map((err) => `- ${err}`).join("\n")}`);
  }

  return { weapons, tagProfiles, descriptions };
}
