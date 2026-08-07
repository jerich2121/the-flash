"use client";

import KryntixMark from "./KryntixMark";

interface SiteLoaderProps {
  /** 0-1 */
  progress: number;
  ready: boolean;
}

/**
 * Full-screen loading overlay shown while Hero's frame sequence preloads,
 * so the first thing a visitor sees is a deliberate loading state instead
 * of a blank/partial canvas streaming in. Adapted from the eco-power
 * sibling project's SiteLoader — mark + progress bar, fades out via opacity
 * once `ready`. Scoped to Hero only (the above-the-fold sequence,
 * eager-loaded) — TheRun's sequence stays lazy-loaded as the user scrolls
 * to it, with just its own small in-place spinner (see
 * ScrollScrubSequence's own `!isLoaded` state), same as before.
 */
export default function SiteLoader({ progress, ready }: SiteLoaderProps) {
  const percent = Math.round(progress * 100);

  return (
    <div
      aria-hidden={ready}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-[var(--bg-dark)] transition-opacity duration-700 ${
        ready ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <KryntixMark className="h-10 w-auto animate-pulse" />
      <div className="h-1 w-48 overflow-hidden rounded-full bg-[rgba(255,255,255,0.08)]">
        <div
          className="h-full rounded-full bg-[var(--accent)] transition-[width] duration-200 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="mono text-xs uppercase tracking-[0.3em] text-[var(--muted-strong)]">
        {percent}%
      </p>
    </div>
  );
}
