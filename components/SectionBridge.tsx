"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger } from "@/app/lib/gsap";
import { useReducedMotion } from "@/app/lib/useReducedMotion";
import MixedHeadline, { type MixedHeadlineSegment } from "@/components/scroll/MixedHeadline";
import ScrambleReveal from "@/components/scroll/ScrambleReveal";

interface BridgeSide {
  label: string;
}

interface SectionBridgeProps {
  id: string;
  ariaLabel: string;
  eyebrow: string;
  headline: MixedHeadlineSegment[];
  from: BridgeSide;
  to: BridgeSide;
  /** Full-bleed low-opacity background image path, e.g. a Kling concept
   * still. Falls back to a plain dark section (no broken-image icon) if the
   * file 404s. */
  backgroundSrc?: string;
  backgroundAlt?: string;
}

// Reusable divider between two major sections — adapted from the eco-power
// sibling project's SectionBridge. Carries real bridging copy (badge pair
// sliding in from opposite sides + eyebrow fade + a scrub-driven headline)
// instead of a bare visual seam, driven by the divider's own dedicated
// ScrollTrigger rather than borrowing progress from either neighboring
// section.
export default function SectionBridge({
  id,
  ariaLabel,
  eyebrow,
  headline,
  from,
  to,
  backgroundSrc,
  backgroundAlt = "",
}: SectionBridgeProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const fromBadgeRef = useRef<HTMLSpanElement>(null);
  const toBadgeRef = useRef<HTMLSpanElement>(null);
  const [progress, setProgress] = useState(0);
  const [bgFailed, setBgFailed] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const section = sectionRef.current;
    if (!section) return;

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      end: "bottom center",
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;
        setProgress(p);

        const badgeT = gsap.utils.clamp(0, 1, gsap.utils.mapRange(0, 0.3, 0, 1, p));
        if (fromBadgeRef.current) {
          gsap.set(fromBadgeRef.current, {
            opacity: badgeT,
            x: (1 - badgeT) * -120,
            scale: 0.75 + badgeT * 0.25,
            rotation: (1 - badgeT) * -8,
          });
        }
        if (toBadgeRef.current) {
          gsap.set(toBadgeRef.current, {
            opacity: badgeT,
            x: (1 - badgeT) * 120,
            scale: 0.75 + badgeT * 0.25,
            rotation: (1 - badgeT) * 8,
          });
        }
      },
    });

    return () => st.kill();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id={id}
      aria-label={ariaLabel}
      className="relative flex min-h-[60vh] w-full flex-col justify-center gap-12 overflow-hidden bg-black px-6 py-24 text-[var(--white)] md:px-16"
    >
      {backgroundSrc && !bgFailed && (
        <Image
          src={backgroundSrc}
          alt={backgroundAlt}
          fill
          sizes="100vw"
          className="object-cover opacity-[0.45]"
          onError={() => setBgFailed(true)}
        />
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/90 via-black/40 to-black/90" />

      <div className="relative flex w-full items-center justify-center gap-4 font-mono text-xs uppercase tracking-[0.35em] text-[var(--muted-strong)] md:gap-6 md:text-sm">
        <span ref={fromBadgeRef} style={reducedMotion ? undefined : { opacity: 0 }}>
          {from.label}
        </span>
        <span aria-hidden="true" className="h-px w-10 bg-[var(--surface-border)] md:w-16" />
        <span ref={toBadgeRef} style={reducedMotion ? undefined : { opacity: 0 }}>
          {to.label}
        </span>
      </div>

      <div className="relative mx-auto w-full max-w-4xl text-center">
        <ScrambleReveal as="span" className="section-kicker justify-center">
          {eyebrow}
        </ScrambleReveal>
        <MixedHeadline
          as="p"
          mode="scrub"
          progress={reducedMotion ? 1 : progress}
          startAt={0.35}
          endAt={0.85}
          className="display mt-6 text-balance text-[clamp(1.8rem,5vw,3.2rem)] text-[var(--white)]"
          segments={headline}
        />
      </div>
    </section>
  );
}
