import type { Attribute } from "@/lib/combat/types";

interface Props {
  value?: Attribute;
  validAttributes: Attribute[];
  onChange: (value: Attribute) => void;
}

export function AttackAttributeSelector({ value, validAttributes, onChange }: Props) {
  if (validAttributes.length === 0) return null;

  return (
    <fieldset>
      <legend className="mb-2 text-sm">Attack Attribute</legend>
      <div className="flex gap-3">
        {validAttributes.map((attribute) => (
          <label key={attribute} className="inline-flex items-center gap-2 text-sm">
            <input type="radio" name="attribute" checked={value === attribute} onChange={() => onChange(attribute)} />
            {attribute === "STR" ? "Strength" : "Dexterity"}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
