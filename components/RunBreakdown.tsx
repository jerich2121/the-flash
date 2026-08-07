"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/app/lib/gsap";
import { useReducedMotion } from "@/app/lib/useReducedMotion";
import MixedHeadline from "@/components/scroll/MixedHeadline";
import RevealText from "@/components/scroll/RevealText";

// TheRun's four captioned beats — the silent "bridge" cutaway (the reused
// mask/eyes shot) is left out here deliberately: this grid is a
// plain-language recap of the main narrative beats for a reader skimming
// text rather than scrubbing the section above. Copy mirrors (doesn't
// duplicate verbatim) the lines already burned into TheRun's own scroll
// captions — see app/lib/runBeats.ts.
const BEATS = [
  {
    n: "01",
    title: "Desert Speed",
    line: "A full sprint across open desert — lightning streaming behind him, the horizon already lit with fire.",
  },
  {
    n: "02",
    title: "The Clash",
    line: "A second lightning signature finds his — electric blue against crimson — and they collide in a shockwave you can feel.",
  },
  {
    n: "03",
    title: "No Hesitation",
    line: "Glass shatters, sparks scatter, and there's no time to think — just react, fist first.",
  },
  {
    n: "04",
    title: "Common Ground",
    line: "Through the wreckage, two trails — red and blue — finally reach the same outstretched hand.",
  },
] as const;

// Static explainer/breakdown section after TheRun — mirrors the eco-power
// sibling project's JourneyTransition explainer grid: real plain-language
// text recapping what just scrolled past, so the page reads as having
// actual substantive content rather than being almost entirely video.
export default function RunBreakdown() {
  const listRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const el = listRef.current;
    if (!el) return;

    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 90%",
      end: "bottom 60%",
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;
        Array.from(el.children).forEach((child, i) => {
          const start = i * 0.16;
          const t = gsap.utils.clamp(0, 1, gsap.utils.mapRange(start, start + 0.35, 0, 1, p));
          gsap.set(child, {
            opacity: t,
            y: (1 - t) * 24,
            scale: 0.94 + t * 0.06,
          });
        });
      },
    });

    return () => st.kill();
  }, [reducedMotion]);

  return (
    <section
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

      <div className="velocity-skew relative mx-auto flex max-w-6xl flex-col gap-14">
        <div className="reveal-up flex flex-col items-center gap-5 text-center">
          <span className="section-kicker">KRYNTIX STUDIO — SCENE BREAKDOWN</span>
          <MixedHeadline
            as="h2"
            className="display text-glow max-w-2xl text-[clamp(1.7rem,4.6vw,2.8rem)] text-[var(--white)]"
            segments={[{ text: "FOUR BEATS," }, { text: "ONE RUN", accent: true }]}
          />
          <RevealText
            as="p"
            split="words"
            className="body-muted max-w-2xl text-[1.05rem]"
          >
            The run unfolds in two parts, with a gallery to catch your breath between
            them — but strip it down and it&apos;s four beats, one unbroken sprint.
          </RevealText>
        </div>

        <div
          ref={listRef}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {BEATS.map((beat) => (
            <div
              key={beat.n}
              style={reducedMotion ? undefined : { opacity: 0 }}
              className="card-surface glow-border flex flex-col gap-3 p-6"
            >
              <span className="mono text-[0.7rem] tracking-[0.2em] text-[var(--accent-2)]">
                {beat.n}
              </span>
              <h3 className="display title-gradient title-sheen text-[1.05rem]">{beat.title}</h3>
              <p className="body-muted text-sm leading-relaxed">{beat.line}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
