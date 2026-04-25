import { describe, expect, it } from "vitest";
import { filterByWeaponAndInput } from "@/lib/combat/matching";
import { rollDescriptions } from "@/lib/combat/filtering";
import { shouldDisableSecondaryWeapon } from "@/lib/combat/weapon-rules";
import { validateCombatData } from "@/lib/combat/validation";
import { weightedSampleUnique } from "@/lib/combat/randomize";
import type { CombatDescription, LoadedCombatData, Weapon } from "@/lib/combat/types";

const weapon: Weapon = {
  name: "Dagger",
  slug: "dagger",
  category: "simple-melee",
  damageTypes: ["piercing"],
  canBeMelee: true,
  canBeThrown: true,
  canBeRanged: false,
  twoHandedRequired: false,
  versatileTwoHandedOptional: false,
  allowedProfiles: ["str-thrust"]
};

const secondWeapon: Weapon = { ...weapon, name: "Spear", slug: "spear" };

const baseDescription: CombatDescription = {
  id: "d1",
  title: "Hit",
  body: "I strike",
  bodyHtml: null,
  author: "Author",
  sourceFile: null,
  sourceSheet: null,
  sourceRow: null,
  sourceElements: null,
  profileIds: ["str-thrust"],
  attribute: "STR",
  motion: "Thrust",
  range: "Melee",
  grip: null,
  damageTypes: [],
  weaponSlugs: [],
  isWeaponSpecific: false,
  tags: [],
  sourceTags: [],
  status: "published",
  weight: 1
};

const data: LoadedCombatData = {
  weapons: [weapon, secondWeapon],
  tagProfiles: [
    {
      id: "str-thrust",
      label: "STR thrust",
      attribute: "STR",
      motion: "Thrust",
      range: "Melee",
      grip: null,
      damageType: null,
      description: null
    }
  ],
  descriptions: [
    baseDescription,
    { ...baseDescription, id: "d2", title: "Specific", isWeaponSpecific: true, weaponSlugs: ["dagger"] },
    { ...baseDescription, id: "d3", title: "Spear", isWeaponSpecific: true, weaponSlugs: ["spear"] }
  ]
};

describe("combat matching", () => {
  it("matches profile overlap", () => {
    const out = filterByWeaponAndInput(data.descriptions, weapon, "STR", "melee", "dagger");
    expect(out.length).toBe(2);
  });

  it("gracefully handles empty JSON arrays", () => {
    const validated = validateCombatData({ weapons: [], tagProfiles: [], descriptions: [] });
    expect(validated.descriptions).toEqual([]);
  });

  it("applies weapon-specific description matching", () => {
    const out = filterByWeaponAndInput(data.descriptions, weapon, "STR", "melee", "dagger");
    expect(out.map((d) => d.id)).toContain("d2");
    expect(out.map((d) => d.id)).not.toContain("d3");
  });

  it("disables secondary with two-handed weapon", () => {
    expect(shouldDisableSecondaryWeapon({ ...weapon, twoHandedRequired: true })).toBe(true);
  });

  it("interleaves primary and secondary results", () => {
    const results = rollDescriptions(
      { attribute: "STR", primaryWeaponSlug: "dagger", primaryMode: "melee", secondaryWeaponSlug: "spear", secondaryMode: "melee", count: 4 },
      data
    );
    expect(results[0].resultSource).toBe("primary");
    expect(results[1].resultSource).toBe("secondary");
  });

  it("weighted random avoids duplicates", () => {
    const picks = weightedSampleUnique(data.descriptions, 3);
    const ids = picks.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
