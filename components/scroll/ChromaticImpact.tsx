"use client";

import { useEffect, useRef } from "react";

// Chromatic-aberration impact hit for the collision beat ("The Clash"). When
// the scrub crosses `at`, two offset colored layers — crimson pushed left,
// cyan pushed right — flash and slide apart, then fade, for a comic-book
// RGB-split punch. Screen blend so the colors add to the footage as light.
export default function ChromaticImpact({
  progress,
  at,
}: {
  progress: number;
  at: number;
}) {
  const redRef = useRef<HTMLDivElement>(null);
  const cyanRef = useRef<HTMLDivElement>(null);
  const last = useRef(progress);

  useEffect(() => {
    const p = progress;
    const lp = last.current;
    const crossed = (lp < at && p >= at) || (lp > at && p <= at);
    last.current = p;
    if (!crossed) return;

    const hit = (el: HTMLDivElement | null, dir: number) => {
      if (!el) return;
      el.style.transition = "none";
      el.style.opacity = "0.6";
      el.style.transform = `translateX(${dir * 14}px)`;
      void el.offsetWidth;
      el.style.transition = "opacity 520ms ease-out, transform 520ms ease-out";
      el.style.opacity = "0";
      el.style.transform = "translateX(0px)";
    };
    hit(redRef.current, -1);
    hit(cyanRef.current, 1);
  }, [progress, at]);

  const layer =
    "pointer-events-none absolute inset-0 z-30 mix-blend-screen";

  return (
    <>
      <div
        ref={redRef}
        aria-hidden="true"
        className={layer}
        style={{
          opacity: 0,
          background:
            "linear-gradient(90deg, rgba(225,29,46,0.55), transparent 45%)",
        }}
      />
      <div
        ref={cyanRef}
        aria-hidden="true"
        className={layer}
        style={{
          opacity: 0,
          background:
            "linear-gradient(270deg, rgba(34,211,238,0.5), transparent 45%)",
        }}
      />
    </>
  );
}
