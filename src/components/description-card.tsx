"use client";

import { useState } from "react";
import type { RollResult } from "@/lib/combat/types";
import { getCombatIcon, getCombatIconFallbackSrc } from "@/lib/combat/icons";

function MetaChip({ label, value }: { label: string; value: string }) {
  const toneClass =
    label === "Attribute"
      ? "border-steel/45 bg-steel/10 text-steel"
      : label === "Motion"
        ? "border-forest/45 bg-forest/10 text-forest"
        : label === "Range"
          ? "border-amethyst/45 bg-amethyst/12 text-amethyst"
          : "border-brass/45 bg-brass/10 text-brass";

  return (
    <span className={`rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] ${toneClass}`}>
      <span className="text-zinc-400/80">{label}</span>{" "}
      <span className="text-parchment">{value}</span>
    </span>
  );
}

export function DescriptionCard({ result }: { result: RollResult }) {
  const { description, resultSource } = result;
  const effectiveProfileIds = result.matchingProfileIds && result.matchingProfileIds.length > 0 ? result.matchingProfileIds : description.profileIds;
  const icon = getCombatIcon({ ...description, profileIds: effectiveProfileIds });
  const fallbackIconSrc = getCombatIconFallbackSrc();
  const [iconSrc, setIconSrc] = useState(icon.src);
  const [watermarkSrc, setWatermarkSrc] = useState(icon.src);

  const motionTokens = Array.from(
    new Set(
      effectiveProfileIds
        .map((profileId) => profileId.split("-")[1])
        .filter((token): token is string => Boolean(token))
        .map((token) => token.charAt(0).toUpperCase() + token.slice(1))
    )
  );
  const motionLabel = motionTokens.length > 0 ? motionTokens.join(" / ") : description.motion;
  const categoryLabel = `${description.attribute} • ${motionLabel}`;

  return (
    <article className="relative overflow-hidden rounded-xl border border-zinc-700/80 bg-zinc-950/95 p-4 text-zinc-100 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_18px_35px_rgba(0,0,0,0.45)]">
      <img
        src={watermarkSrc}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 select-none object-contain opacity-[0.06]"
        onError={() => setWatermarkSrc(fallbackIconSrc)}
      />

      <header className="relative z-10 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="rounded-lg border border-zinc-700/90 bg-zinc-900/95 p-2 shadow-[0_0_24px_rgba(120,100,255,0.15)]">
            <img
              src={iconSrc}
              alt={`${icon.label} icon`}
              className="h-8 w-8 object-contain"
              onError={() => setIconSrc(fallbackIconSrc)}
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
        <MetaChip label="Motion" value={motionLabel} />
        {description.range ? <MetaChip label="Range" value={description.range} /> : null}
        {resultSource ? <MetaChip label="Slot" value={resultSource} /> : null}
      </div>
    </article>
  );
}
