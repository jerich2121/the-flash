"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger } from "@/app/lib/gsap";
import { useReducedMotion } from "@/app/lib/useReducedMotion";
import MixedHeadline from "@/components/scroll/MixedHeadline";
import RevealText from "@/components/scroll/RevealText";
import ScrambleReveal from "@/components/scroll/ScrambleReveal";
import { FRAME_COUNT as HERO_FRAME_COUNT, CLIP_DURATION as HERO_DURATION } from "@/app/lib/beats";
import { FRAME_COUNT as RUN_FRAME_COUNT, CLIP_DURATION as RUN_DURATION } from "@/app/lib/runBeats";

// Honest, on-brand facts about the edit itself — not fabricated movie or
// business stats. Combined frame count/runtime derived directly from the
// same constants Hero/TheRun's own timing is built on, not hand-typed
// separately, so this can't silently drift out of sync with the real
// sequences if either clip is ever re-cut.
const TOTAL_FRAMES = HERO_FRAME_COUNT + RUN_FRAME_COUNT;
const TOTAL_SECONDS = HERO_DURATION + RUN_DURATION;

const STATS = [
  { value: "2", label: "Scroll-driven chapters" },
  { value: String(TOTAL_FRAMES), label: "Frames of pure momentum" },
  { value: "30fps", label: "Buttery-smooth motion" },
  { value: `${TOTAL_SECONDS.toFixed(1)}s`, label: "Total scroll runtime" },
] as const;

/**
 * Closing CTA — rebuilt on the eco-power sibling project's ClosingCTA
 * pattern (own dedicated ScrollTrigger per sub-block, not one shared
 * progress value across differently-sized ranges — see that file's own
 * git-history comment for the bug that pattern avoids): a scrub-driven
 * MixedHeadline, a RevealText body paragraph, and a small honest stat row
 * about the edit itself, each with its own ScrollTrigger scoped to its own
 * wrapper. Deliberately lighter than eco-power's full ClosingCTA (no
 * contact form, no partner marquee) — this is a fan-edit sign-off, not a
 * business's contact page.
 */
export default function CTA() {
  const headingWrapRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [headingProgress, setHeadingProgress] = useState(0);
  const [bgFailed, setBgFailed] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const el = headingWrapRef.current;
    if (!el) return;

    const st = ScrollTrigger.create({
      trigger: el,
      start: "top bottom",
      end: "bottom center",
      scrub: true,
      onUpdate: (self) => setHeadingProgress(self.progress),
    });

    return () => st.kill();
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;
    const el = statsRef.current;
    if (!el) return;

    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 88%",
      end: "top 45%",
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;
        Array.from(el.children).forEach((child, i) => {
          const start = i * 0.18;
          const t = gsap.utils.clamp(0, 1, gsap.utils.mapRange(start, start + 0.35, 0, 1, p));
          gsap.set(child, {
            opacity: t,
            y: (1 - t) * 24,
            scale: 0.92 + t * 0.08,
          });
        });
      },
    });

    return () => st.kill();
  }, [reducedMotion]);

  return (
    <section
      id="about"
      className="relative flex flex-col items-center gap-14 overflow-hidden px-6 py-[100px] text-center md:px-12 md:py-[160px]"
    >
      {!bgFailed && (
        <Image
          src="/images/flash-transition-4.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-[0.14]"
          onError={() => setBgFailed(true)}
        />
      )}
      <div
        className="bg-fade-in pointer-events-none absolute inset-0"
        data-fade-to="1"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 20%, rgba(225,29,46,0.14), transparent 60%), radial-gradient(ellipse 60% 50% at 80% 80%, rgba(255,224,102,0.08), transparent 60%), var(--bg-dark)",
        }}
        aria-hidden="true"
      />

      <div ref={headingWrapRef} className="relative flex max-w-3xl flex-col items-center gap-6">
        <ScrambleReveal as="span" className="section-kicker">
          KRYNTIX STUDIO — ABOUT THIS SITE
        </ScrambleReveal>
        <MixedHeadline
          as="h2"
          mode="scrub"
          progress={reducedMotion ? 1 : headingProgress}
          startAt={0.15}
          endAt={0.8}
          className="display text-glow text-[clamp(1.9rem,5.4vw,3.4rem)] text-[var(--white)]"
          segments={[
            { text: "BUILT BY FANS," },
            { text: "FOR FANS", accent: true },
          ]}
        />
        <RevealText
          as="p"
          split="words"
          start="top 82%"
          className="body-muted max-w-xl text-[1.05rem]"
        >
          Kryntix Studio is a small crew building tribute sites for the heroes we grew up
          watching. This one&apos;s for The Flash — no leaks, no spoilers, no plot claims.
          Just craft, motion, and a whole lot of love for the Scarlet Speedster.
        </RevealText>
      </div>

      <div
        ref={statsRef}
        className="relative grid w-full max-w-3xl grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4"
      >
        {STATS.map((stat) => (
          <div key={stat.label} style={reducedMotion ? undefined : { opacity: 0 }} className="flex flex-col gap-1.5">
            <span className="display text-[clamp(1.6rem,3.2vw,2.2rem)] text-[var(--accent-2)]">
              {stat.value}
            </span>
            <span className="mono text-[0.65rem] uppercase leading-snug tracking-[0.12em] text-[var(--muted-strong)]">
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      <div className="reveal-up relative flex flex-col items-center gap-4 sm:flex-row">
        <a
          href="https://kryntixstudio.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="secondary rounded-full px-8 py-3.5 text-sm tracking-[0.08em] text-black transition-transform hover:scale-[1.03]"
          style={{
            background: "linear-gradient(120deg, var(--accent), var(--gold))",
            boxShadow: "0 20px 40px -18px rgba(225,29,46,0.55)",
          }}
        >
          SEE THE FULL STUDIO
        </a>
        <a
          href="https://instagram.com/kryntixstudio"
          target="_blank"
          rel="noopener noreferrer"
          className="mono card-surface rounded-full px-8 py-3.5 text-sm tracking-[0.08em] text-[var(--white)] transition-transform hover:scale-[1.03]"
        >
          @kryntixstudio ON INSTAGRAM
        </a>
      </div>

      <p className="reveal-up relative mono max-w-xl text-[0.68rem] leading-relaxed tracking-[0.05em] text-[var(--muted)]">
        Fan project, not affiliated with Warner Bros., DC, or DC Studios. Made for
        non-commercial fan enjoyment — all Flash-related trademarks belong to their
        respective owners.
      </p>
    </section>
  );
}
