"use client";

import { useEffect, useState } from "react";
import ScrollScrubSequence from "@/components/scroll/ScrollScrubSequence";
import ViewfinderHUD from "@/components/scroll/ViewfinderHUD";
import LetterboxBars from "@/components/scroll/LetterboxBars";
import SiteLoader from "@/components/SiteLoader";
import { useReducedMotion } from "@/app/lib/useReducedMotion";
import { CLIP_DURATION, FRAME_COUNT, TITLE_REVEAL_PROGRESS } from "@/app/lib/beats";

// Pinned-scroll-distance-per-second-of-clip, inherited from the reference
// site's tuned feel (2200vh over a 44.84s clip). Deriving it from
// CLIP_DURATION instead of hardcoding keeps the scroll pacing calibrated to
// this clip's actual length — this footage is a single ~3.6s logo-reveal
// beat rather than a multi-beat action reel, so the pinned stage comes out
// to roughly 175vh instead of iron-man2's 2200vh. ScrollScrubSequence takes
// its pin distance in viewport-heights (a multiplier of window.innerHeight,
// not a raw vh CSS value), hence the /100.
const SCRUB_VH_PER_SECOND = 2200 / 44.84;
const PIN_VH = (CLIP_DURATION * SCRUB_VH_PER_SECOND) / 100;

export default function Hero() {
  const reduced = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const [loadProgress, setLoadProgress] = useState(0);
  const heroReady = reduced || loadProgress >= 1;

  // Block scroll (and Lenis, via the same overflow/touch-action lock) until
  // Hero's own eager-loaded frame sequence has fully downloaded, so a user
  // can't scroll into a half-loaded scrub. Skipped entirely for
  // reduced-motion visitors — heroReady starts true for them.
  useEffect(() => {
    if (heroReady) return;
    const html = document.documentElement;
    const body = document.body;
    html.style.overflow = "hidden";
    html.style.touchAction = "none";
    body.style.overflow = "hidden";
    body.style.touchAction = "none";
    return () => {
      html.style.overflow = "";
      html.style.touchAction = "";
      body.style.overflow = "";
      body.style.touchAction = "";
    };
  }, [heroReady]);

  // Chrome (kicker, scroll cue) only appears once the wordmark has fully
  // formed and colored in — showing it earlier would compete with the
  // letter-by-letter title reveal that's burned into the footage itself.
  // Always shown (no gating) for reduced-motion visitors, since there's no
  // scrub progress driving it for them.
  const chromeVisible = reduced || progress >= TITLE_REVEAL_PROGRESS;

  return (
    <section id="hero" className="relative w-full bg-black">
      {/* The visible title is burned into the hero footage (an image), so the
          document needs a real top-level heading for SEO and screen readers.
          Kept off-screen with sr-only rather than duplicated on-screen. */}
      <h1 className="sr-only">The Flash — a Kryntix Studio fan film</h1>
      <ScrollScrubSequence
        framesPath="flash-hero"
        frameCount={FRAME_COUNT}
        pinVh={PIN_VH}
        eager
        motionEcho={false}
        onProgress={setProgress}
        onLoadProgress={setLoadProgress}
      >
        <div className="video-vignette" aria-hidden="true" />
        {!reduced && (
          <>
            <LetterboxBars progress={progress} />
            <ViewfinderHUD
              progress={progress}
              durationSeconds={CLIP_DURATION}
              sceneLabel="TITLE REVEAL"
              sceneIndex={0}
              sceneTotal={1}
            />
          </>
        )}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/85 transition-opacity duration-700"
          style={{ opacity: chromeVisible ? 1 : 0 }}
          aria-hidden="true"
        />
        <div
          className="speed-streak transition-opacity duration-700"
          style={{ opacity: chromeVisible ? 1 : 0 }}
          aria-hidden="true"
        />

        {/* Kicker sits in the clear strip just below the nav bar — the
            burned-in "THE FLASH" wordmark occupies roughly the middle-to-
            lower half of this close-crop footage, so chrome text is kept
            out of that band entirely rather than laid over it. */}
        <div
          className="pointer-events-none absolute inset-x-0 top-24 z-20 flex flex-col items-center gap-4 px-6 transition-opacity duration-700 md:top-28"
          style={{ opacity: chromeVisible ? 1 : 0 }}
        >
          <span className="hud-badge">
            <span className="hud-badge-dot" />
            KRYNTIX STUDIO — A FLASH FAN FILM
          </span>
          <p
            className="display title-gradient title-sheen text-center text-[clamp(0.95rem,2.6vw,1.35rem)] tracking-[0.2em]"
            style={{
              transform: chromeVisible ? "translateY(0)" : "translateY(10px)",
              transition: "transform 700ms var(--ease-out)",
            }}
          >
            FASTER THAN THE MOMENT
          </p>
        </div>

        {reduced ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-10 z-20 flex justify-center px-6 text-center">
            <p className="body-muted caption-shadow max-w-md text-sm">
              A cinematic scroll experience — reduced-motion mode. The full
              scroll-scrubbed title reveal is available with motion enabled.
            </p>
          </div>
        ) : (
          // Deliberately just the scroll cue here, not a tagline — the
          // wordmark's own letterforms run close to the bottom edge of the
          // frame, leaving very little clear vertical space below it on
          // shorter viewports. The descriptive copy lives in the CTA
          // section instead of getting cramped into this strip.
          <div
            className="pointer-events-none absolute inset-x-0 bottom-5 z-20 flex justify-center px-6 text-center transition-opacity duration-700 md:bottom-8"
            style={{ opacity: chromeVisible ? 1 : 0 }}
          >
            <div className="mono caption-shadow flex items-center gap-2 text-[0.65rem] tracking-[0.3em] text-[var(--muted-strong)]">
              <span>SCROLL</span>
              <span className="flicker">↓</span>
            </div>
          </div>
        )}
      </ScrollScrubSequence>

      {!reduced && <SiteLoader progress={loadProgress} ready={heroReady} />}
    </section>
  );
}
