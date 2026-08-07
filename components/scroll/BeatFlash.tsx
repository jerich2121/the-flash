"use client";

import { useEffect, useRef } from "react";

// Quick white flash cut fired whenever the scrub crosses a beat boundary — a
// lightning-strike edit between scenes. Tracks the previous progress value and
// triggers on any boundary crossing (either scroll direction), then fades via
// a CSS transition. Screen blend keeps it reading as a bright flash over the
// footage rather than a grey wash.
export default function BeatFlash({
  progress,
  boundaries,
}: {
  progress: number;
  boundaries: number[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const last = useRef(progress);

  useEffect(() => {
    const p = progress;
    const lp = last.current;
    const crossed = boundaries.some(
      (b) => (lp < b && p >= b) || (lp > b && p <= b)
    );
    last.current = p;
    if (!crossed) return;

    const el = ref.current;
    if (!el) return;
    el.style.transition = "none";
    el.style.opacity = "0.85";
    // Force a reflow so the next opacity change animates from 0.85.
    void el.offsetWidth;
    el.style.transition = "opacity 450ms ease-out";
    el.style.opacity = "0";
  }, [progress, boundaries]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-30 bg-white"
      style={{ opacity: 0, mixBlendMode: "screen" }}
    />
  );
}
