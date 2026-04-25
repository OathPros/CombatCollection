import type { Weapon, WeaponMode } from "@/lib/combat/types";

interface Props {
  weapon?: Weapon;
  value?: WeaponMode;
  onChange: (mode: WeaponMode) => void;
}

export function WeaponModeSelector({ weapon, value, onChange }: Props) {
  if (!weapon) return null;

  const modes: WeaponMode[] = [];
  if (weapon.canBeMelee) modes.push("melee");
  if (weapon.canBeThrown) modes.push("thrown");
  if (weapon.canBeRanged) modes.push("ranged");
  if (weapon.twoHandedRequired || weapon.versatileTwoHandedOptional) modes.push("twoHanded");

  if (modes.length === 0) return null;

  return (
    <label className="grid gap-1 text-sm">
      <span>Mode</span>
      <select
        value={value ?? (weapon.canBeRanged ? "ranged" : modes[0])}
        onChange={(event) => onChange(event.target.value as WeaponMode)}
        className="rounded border border-zinc-700 bg-zinc-900 px-3 py-2"
      >
        {modes.map((mode) => (
          <option key={mode} value={mode}>
            {mode}
          </option>
        ))}
      </select>
    </label>
  );
}
