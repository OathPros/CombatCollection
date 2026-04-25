import type { Weapon } from "@/lib/combat/types";

interface Props {
  id: string;
  label: string;
  weapons: Weapon[];
  value?: string;
  onChange: (value: string | undefined) => void;
  disabled?: boolean;
}

export function WeaponSelect({ id, label, weapons, value, onChange, disabled }: Props) {
  return (
    <label className="grid gap-1 text-sm" htmlFor={id}>
      <span>{label}</span>
      <select
        id={id}
        value={value ?? ""}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value || undefined)}
        className="rounded border border-zinc-700 bg-zinc-900 px-3 py-2"
      >
        <option value="">Select weapon</option>
        {weapons.map((weapon) => (
          <option key={weapon.slug} value={weapon.slug}>
            {weapon.name}
          </option>
        ))}
      </select>
    </label>
  );
}
