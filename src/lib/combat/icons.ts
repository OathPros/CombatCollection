import type { CombatDescription } from "@/lib/combat/types";

export type CombatIconKey =
  | "str-swing"
  | "str-thrust"
  | "str-strike"
  | "str-swing-throw"
  | "str-thrust-throw"
  | "dex-swing"
  | "dex-thrust"
  | "dex-strike"
  | "dex-draw"
  | "dex-load"
  | "dex-swing-throw"
  | "dex-thrust-throw"
  | "default";

export interface CombatIconMeta {
  key: CombatIconKey;
  src: string;
  label: string;
}

export const combatIconMap: Record<Exclude<CombatIconKey, "default">, CombatIconMeta> = {
  "str-swing": { key: "str-swing", src: "/icons/combat/str-swing.png", label: "Strength Swing" },
  "str-thrust": { key: "str-thrust", src: "/icons/combat/str-thrust.png", label: "Strength Thrust" },
  "str-strike": { key: "str-strike", src: "/icons/combat/str-strike.png", label: "Strength Strike" },
  "str-swing-throw": { key: "str-swing-throw", src: "/icons/combat/str-swing-throw.png", label: "Strength Swing Throw" },
  "str-thrust-throw": { key: "str-thrust-throw", src: "/icons/combat/str-thrust-throw.png", label: "Strength Thrust Throw" },
  "dex-swing": { key: "dex-swing", src: "/icons/combat/dex-swing.png", label: "Dexterity Swing" },
  "dex-thrust": { key: "dex-thrust", src: "/icons/combat/dex-thrust.png", label: "Dexterity Thrust" },
  "dex-strike": { key: "dex-strike", src: "/icons/combat/dex-strike.png", label: "Dexterity Strike" },
  "dex-draw": { key: "dex-draw", src: "/icons/combat/dex-draw.png", label: "Dexterity Draw" },
  "dex-load": { key: "dex-load", src: "/icons/combat/dex-load.png", label: "Dexterity Load" },
  "dex-swing-throw": {
    key: "dex-swing-throw",
    src: "/icons/combat/dex-swing-throw.png",
    label: "Dexterity Swing Throw"
  },
  "dex-thrust-throw": {
    key: "dex-thrust-throw",
    src: "/icons/combat/dex-thrust-throw.png",
    label: "Dexterity Thrust Throw"
  }
};

type IconDescription = Pick<CombatDescription, "profileIds" | "attribute" | "motion" | "range">;

const FALLBACK_ICON_KEY: Exclude<CombatIconKey, "default"> = "str-swing";

const profileIconMap: Record<string, Exclude<CombatIconKey, "default">> = {
  "dex-draw": "dex-draw",
  "dex-load": "dex-load",
  "dex-strike": "dex-strike",
  "dex-swing": "dex-swing",
  "dex-swing-throw": "dex-swing-throw",
  "dex-thrust": "dex-thrust",
  "dex-thrust-throw": "dex-thrust-throw",
  "str-strike": "str-strike",
  "str-swing": "str-swing",
  "str-swing-throw": "str-swing-throw",
  "str-thrust": "str-thrust",
  "str-thrust-throw": "str-thrust-throw"
};

function isCombatIconKey(value: string): value is Exclude<CombatIconKey, "default"> {
  return value in combatIconMap;
}

export function getCombatIconKey(description: IconDescription): CombatIconKey {
  const profileKey = description.profileIds.map((profileId) => profileIconMap[profileId]).find(Boolean);

  if (profileKey) {
    return profileKey;
  }

  const attribute = description.attribute.toLowerCase();
  const motion = description.motion.toLowerCase();
  const baseKey = `${attribute}-${motion}`;
  const rangeKey = description.range === "Throw" ? `${baseKey}-throw` : baseKey;

  return isCombatIconKey(rangeKey) ? rangeKey : "default";
}

export function getCombatIcon(description: IconDescription): CombatIconMeta {
  const iconKey = getCombatIconKey(description);

  if (iconKey !== "default") {
    return combatIconMap[iconKey];
  }

  return {
    key: "default",
    src: combatIconMap[FALLBACK_ICON_KEY].src,
    label: "Combat Action"
  };
}

export function getCombatIconFallbackSrc(): string {
  return combatIconMap[FALLBACK_ICON_KEY].src;
}
