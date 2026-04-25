"use client";

import { useState } from "react";
import type { RollResult } from "@/lib/combat/types";
import { getCombatIcon } from "@/lib/combat/icons";

function MetaChip({ label, value }: { label: string; value: string }) {
  return (
    <span className="rounded-full border border-zinc-700/90 bg-zinc-900/80 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-zinc-300">
      <span className="text-zinc-500">{label}</span> {value}
    </span>
  );
}

export function DescriptionCard({ result }: { result: RollResult }) {
  const { description, resultSource } = result;
  const icon = getCombatIcon(description);
  const [iconSrc, setIconSrc] = useState(icon.src);
  const [watermarkSrc, setWatermarkSrc] = useState(icon.src);

  const categoryLabel = `${description.attribute} • ${description.motion}`;

  return (
    <article className="relative overflow-hidden rounded-xl border border-zinc-700/80 bg-zinc-950/95 p-4 text-zinc-100 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_18px_35px_rgba(0,0,0,0.45)]">
      <img
        src={watermarkSrc}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-2 -top-2 h-36 w-36 select-none object-contain opacity-[0.06]"
        onError={() => setWatermarkSrc("/icons/combat/default.png")}
      />

      <header className="relative z-10 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="rounded-lg border border-zinc-700/90 bg-zinc-900/95 p-2 shadow-[0_0_24px_rgba(120,100,255,0.15)]">
            <img
              src={iconSrc}
              alt={`${icon.label} icon`}
              className="h-8 w-8 object-contain"
              onError={() => setIconSrc("/icons/combat/default.png")}
            />
          </div>
          <div>
            <h3 className="font-serif text-lg leading-tight text-zinc-50">{description.title}</h3>
            <p className="mt-1 text-xs uppercase tracking-[0.14em] text-zinc-300">{categoryLabel}</p>
          </div>
        </div>

        <span className="rounded-full border border-zinc-700 bg-zinc-900/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-300">
          {resultSource === "primary" ? "Primary" : resultSource === "secondary" ? "Secondary" : "Result"}
        </span>
      </header>

      {description.bodyHtml ? (
        <p className="relative z-10 mt-3 text-sm leading-relaxed text-zinc-200" dangerouslySetInnerHTML={{ __html: description.bodyHtml }} />
      ) : (
        <p className="relative z-10 mt-3 text-sm leading-relaxed text-zinc-200">{description.body}</p>
      )}

      <div className="relative z-10 mt-4 flex flex-wrap gap-1.5">
        <MetaChip label="Attribute" value={description.attribute} />
        <MetaChip label="Motion" value={description.motion} />
        {description.range ? <MetaChip label="Range" value={description.range} /> : null}
        {resultSource ? <MetaChip label="Slot" value={resultSource} /> : null}
      </div>
    </article>
  );
}
