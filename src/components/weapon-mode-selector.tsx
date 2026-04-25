import type { WeaponMode } from "@/lib/combat/types";

interface Props {
  value?: WeaponMode;
  validModes: WeaponMode[];
  onChange: (mode: WeaponMode) => void;
}

export function WeaponModeSelector({ value, validModes, onChange }: Props) {
  if (validModes.length <= 1) return null;

  return (
    <label className="grid gap-1 text-sm">
      <span>Mode</span>
      <select
        value={value ?? validModes[0]}
        onChange={(event) => onChange(event.target.value as WeaponMode)}
        className="rounded border border-zinc-700 bg-zinc-900 px-3 py-2"
      >
        {validModes.map((mode) => (
          <option key={mode} value={mode}>
            {mode}
          </option>
        ))}
      </select>
    </label>
  );
}
