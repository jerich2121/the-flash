"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "@/app/lib/gsap";
import { useReducedMotion } from "@/app/lib/useReducedMotion";
import MixedHeadline from "@/components/scroll/MixedHeadline";
import RevealText from "@/components/scroll/RevealText";

// TheRun's four captioned beats as a plain-language recap for a reader
// skimming text rather than scrubbing the sections above. Each carries a
// matching gallery still so the stacked panels read as more than text cards.
const BEATS = [
  {
    n: "01",
    title: "Desert Speed",
    line: "A full sprint across open desert — lightning streaming behind him, the horizon already lit with fire.",
    img: "/images/flash-transition-1.webp",
  },
  {
    n: "02",
    title: "The Clash",
    line: "A second lightning signature finds his — electric blue against crimson — and they collide in a shockwave you can feel.",
    img: "/images/flash-gallery-2.webp",
  },
  {
    n: "03",
    title: "No Hesitation",
    line: "Glass shatters, sparks scatter, and there's no time to think — just react, fist first.",
    img: "/images/flash-gallery-fist.webp",
  },
  {
    n: "04",
    title: "Common Ground",
    line: "Through the wreckage, two trails — red and blue — finally reach the same outstretched hand.",
    img: "/images/flash-gallery-hands.webp",
  },
] as const;

// Stacked-panels scrollytelling recap (a GSAP/CSS panel-stacking effect): each
// beat is a full-width sticky panel that pins to the top as you scroll; the
// next beat scrolls up and stacks over it while the covered panel scales back
// and dims for depth. Sticky handles the stacking (works because Lenis scrolls
// the window rather than transforming a wrapper); GSAP scrubs the recede. No
// transform on any sticky ancestor — that would break position: sticky.
export default function RunBreakdown() {
  const stackRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const root = stackRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".stack-card");
      cards.forEach((card, i) => {
        // The last panel is the resting state — nothing stacks over it.
        if (i === cards.length - 1) return;
        const inner = card.querySelector<HTMLElement>(".stack-inner");
        if (!inner) return;
        // Recede from the top edge so the visible sliver of each card stays put
        // as the one above it shrinks back behind the incoming panel. Scale
        // only — no opacity or brightness change, so the picture never dims or
        // flashes to black; depth comes purely from the shrink plus the overlap.
        gsap.set(inner, { transformOrigin: "50% 0%" });
        gsap.to(inner, {
          scale: 0.95,
          ease: "none",
          scrollTrigger: {
            trigger: card,
            start: "top 14%",
            end: "bottom 14%",
            scrub: 0.6,
          },
        });
      });
    }, root);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      id="breakdown"
      aria-label="TheRun scene breakdown"
      className="relative w-full bg-black px-6 py-[100px] md:px-12 md:py-[150px]"
    >
      <div
        className="bg-fade-in glow-drift pointer-events-none absolute inset-0"
        data-fade-to="1"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 90% 10%, rgba(255,224,102,0.05), transparent 60%), radial-gradient(ellipse 60% 50% at 5% 90%, rgba(225,29,46,0.07), transparent 60%)",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-5xl">
        <div className="reveal-up flex flex-col items-center gap-5 text-center">
          <span className="section-kicker">KRYNTIX STUDIO — SCENE BREAKDOWN</span>
          <MixedHeadline
            as="h2"
            className="display text-glow max-w-2xl text-[clamp(1.7rem,4.6vw,2.8rem)] text-[var(--white)]"
            segments={[{ text: "FOUR BEATS," }, { text: "ONE RUN", accent: true }]}
          />
          <RevealText as="p" split="words" className="body-muted max-w-2xl text-[1.05rem]">
            The run unfolds in two parts, with a gallery to catch your breath between
            them — but strip it down and it&apos;s four beats, one unbroken sprint.
          </RevealText>
        </div>

        <div ref={stackRef} className="mt-16 flex flex-col gap-6">
          {BEATS.map((beat, i) => (
            <div
              key={beat.n}
              className="stack-card sticky"
              style={{ top: `calc(14vh + ${i * 1.5}rem)` }}
            >
              <div className="stack-inner glow-border relative flex min-h-[44vh] flex-col justify-between overflow-hidden rounded-2xl border border-[var(--surface-border-glow)] p-8 shadow-[0_28px_70px_-30px_rgba(0,0,0,0.9)] will-change-transform md:p-10">
                {/* Opaque base so a stacked panel fully hides the one behind it
                    — card-surface's glass is translucent and would let it bleed
                    through. */}
                <div className="pointer-events-none absolute inset-0 bg-[#0a0504]" aria-hidden="true" />
                <Image
                  src={beat.img}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  className="object-cover opacity-[0.55]"
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-black/15"
                  aria-hidden="true"
                />

                <div className="relative flex items-center justify-between">
                  <span className="mono text-[0.75rem] tracking-[0.3em] text-[var(--accent-2)]">
                    SCENE {beat.n}
                  </span>
                  <span className="mono text-[0.7rem] tracking-[0.2em] text-[var(--muted)]">
                    {beat.n} / 04
                  </span>
                </div>

                <div className="relative">
                  <h3 className="display title-gradient title-sheen text-[clamp(2rem,6vw,3.4rem)]">
                    {beat.title}
                  </h3>
                  <p className="body-muted mt-3 max-w-xl text-[1.05rem] leading-relaxed">
                    {beat.line}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
