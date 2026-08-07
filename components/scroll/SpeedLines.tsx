"use client";

import { useEffect, useRef, type MutableRefObject } from "react";

// Diagonal speed streaks over the run footage whose intensity tracks scrub
// velocity. The parent bumps `velocityRef` up on each scrub frame; this
// component runs its own rAF that decays that value and eases the streak
// opacity toward it — so the lines flare when you scrub fast and fade out
// when you stop, with no per-frame React re-render.
export default function SpeedLines({
  velocityRef,
  maxOpacity = 0.5,
}: {
  velocityRef: MutableRefObject<number>;
  maxOpacity?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    let shown = 0;
    const loop = () => {
      velocityRef.current *= 0.92;
      const target = Math.min(1, velocityRef.current);
      shown += (target - shown) * 0.15;
      if (ref.current) ref.current.style.opacity = String(shown * maxOpacity);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [velocityRef, maxOpacity]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="speed-lines pointer-events-none absolute inset-0 z-[5]"
      style={{ opacity: 0 }}
    />
  );
}
