"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "@/app/lib/useReducedMotion";
import { preloadFrames, drawImageCover } from "@/app/lib/frames";
import { frameForProgress, framePath, CLIP_DURATION, TITLE_REVEAL_PROGRESS } from "@/app/lib/beats";
import { scrubProgress, framesReady } from "@/app/lib/scrollStore";

// Pinned-scroll-distance-per-second-of-clip, inherited from the reference
// site's tuned feel (2200vh over a 44.84s clip). Deriving it from
// CLIP_DURATION instead of hardcoding keeps the scroll pacing calibrated to
// this clip's actual length — this footage is a single ~3.6s logo-reveal
// beat rather than a multi-beat action reel, so the pinned stage comes out
// to roughly 175vh instead of iron-man2's 2200vh.
const SCRUB_VH_PER_SECOND = 2200 / 44.84;
const SCRUB_STAGE_HEIGHT_VH = Math.round(CLIP_DURATION * SCRUB_VH_PER_SECOND);

// Fade the whole stage (canvas + chrome alike) to solid black over the
// final stretch of the clip, so the cut into the section below reads as an
// intentional beat rather than a seam. Starts a moment after the wordmark
// has fully formed (TITLE_REVEAL_PROGRESS) so there's a brief hold on the
// finished title before it fades.
const OUTRO_FADE_SECONDS = 0.5;
const OUTRO_FADE_START_PROGRESS = 1 - OUTRO_FADE_SECONDS / CLIP_DURATION;

export default function Hero() {
  const reduced = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const chromeRef = useRef<HTMLDivElement>(null);
  const outroFadeRef = useRef<HTMLDivElement>(null);
  const [loadProgress, setLoadProgress] = useState(0);
  const [ready, setReady] = useState(false);

  // Preload the WebP sequence (skipped entirely for reduced-motion users —
  // they get a single static frame instead, see below).
  useEffect(() => {
    if (reduced) return;
    let cancelled = false;
    const { promise, cancel } = preloadFrames((loaded, total) => {
      if (!cancelled) setLoadProgress(loaded / total);
    });
    promise.then(({ images }) => {
      if (cancelled) return;
      imagesRef.current = images;
      setReady(true);
      framesReady.set(true);
    });
    return () => {
      cancelled = true;
      cancel();
    };
  }, [reduced]);

  // Imperative draw loop, driven by the scrubProgress store rather than
  // React state, so a scroll tick never triggers a React re-render.
  useEffect(() => {
    if (reduced || !ready) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      if (!canvas) return;
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      draw(scrubProgress.get());
    }

    function draw(p: number) {
      if (!canvas || !ctx) return;
      const idx = frameForProgress(p);
      const img = imagesRef.current[idx];
      if (img && img.complete && img.naturalWidth) {
        drawImageCover(ctx, img, canvas.width, canvas.height);
      }
    }

    resize();
    const unsub = scrubProgress.subscribe(draw);
    window.addEventListener("resize", resize);
    return () => {
      unsub();
      window.removeEventListener("resize", resize);
    };
  }, [reduced, ready]);

  // Chrome (kicker, tagline, scroll cue, speed-streak) only appears once
  // the wordmark has fully formed and colored in — showing it earlier would
  // compete with the letter-by-letter title reveal that's burned into the
  // footage itself.
  useEffect(() => {
    if (reduced) return;
    const chrome = chromeRef.current;
    if (!chrome) return;
    const apply = (p: number) => {
      chrome.style.opacity = p >= TITLE_REVEAL_PROGRESS ? "1" : "0";
    };
    apply(scrubProgress.get());
    return scrubProgress.subscribe(apply);
  }, [reduced]);

  // Fade the entire stage to solid black over the final OUTRO_FADE_SECONDS.
  useEffect(() => {
    if (reduced) return;
    const el = outroFadeRef.current;
    if (!el) return;
    const apply = (p: number) => {
      const t = Math.min(1, Math.max(0, (p - OUTRO_FADE_START_PROGRESS) / (1 - OUTRO_FADE_START_PROGRESS)));
      el.style.opacity = String(t);
    };
    apply(scrubProgress.get());
    return scrubProgress.subscribe(apply);
  }, [reduced]);

  if (reduced) {
    return (
      <section className="relative flex h-[100svh] w-full flex-col items-center justify-end overflow-hidden bg-black px-6 pb-16 text-center">
        <Image
          src={framePath(frameForProgress(TITLE_REVEAL_PROGRESS))}
          alt="THE FLASH — title card, close on the mask, fan-edit logo reveal"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10" />
        <div className="relative z-40 flex flex-col items-center gap-4">
          <span className="section-kicker">KRYNTIX STUDIO — FAN FILM</span>
          <p className="body-muted max-w-md text-sm">
            A cinematic scroll experience — reduced-motion mode. The full scroll-scrubbed
            title reveal is available with motion enabled.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      data-scrub-root
      className="relative w-full bg-black"
      style={{ height: `${SCRUB_STAGE_HEIGHT_VH}vh` }}
    >
      <div className="sticky top-0 z-0 h-[100svh] w-full overflow-hidden bg-black">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

        <div ref={chromeRef} className="opacity-0 transition-opacity duration-700">
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/85" />
          <div className="speed-streak" aria-hidden="true" />

          {/* Kicker sits in the clear strip just below the nav bar — the
              burned-in "THE FLASH" wordmark occupies roughly the middle-to-
              lower half of this close-crop footage, so chrome text is kept
              out of that band entirely rather than laid over it. */}
          <div className="pointer-events-none absolute inset-x-0 top-24 z-20 flex justify-center px-6 md:top-28">
            <span className="hud-badge">
              <span className="hud-badge-dot" />
              KRYNTIX STUDIO — FAN FILM
            </span>
          </div>

          {/* Deliberately just the scroll cue here, not a tagline — the
              wordmark's own letterforms run close to the bottom edge of the
              frame, leaving very little clear vertical space below it on
              shorter viewports. The descriptive copy lives in the CTA
              section instead of getting cramped into this strip. */}
          <div className="pointer-events-none absolute inset-x-0 bottom-5 z-20 flex justify-center px-6 text-center md:bottom-8">
            <div className="mono caption-shadow flex items-center gap-2 text-[0.65rem] tracking-[0.3em] text-[var(--muted-strong)]">
              <span>SCROLL</span>
              <span className="flicker">↓</span>
            </div>
          </div>
        </div>

        <div
          ref={outroFadeRef}
          className="pointer-events-none absolute inset-0 z-40 bg-black opacity-0"
          aria-hidden="true"
        />

        {!ready && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-[var(--bg-dark)]">
            <span className="mono flicker text-xs text-[var(--accent-2)]">
              KRYNTIX STUDIO — PREPARING REEL
            </span>
            <div className="display text-[clamp(1.6rem,5vw,2.6rem)] text-glow">
              LOADING SEQUENCE
            </div>
            <div className="h-[2px] w-56 overflow-hidden bg-[rgba(255,255,255,0.08)] md:w-80">
              <div
                className="h-full bg-[var(--accent)] transition-[width] duration-150 ease-out"
                style={{ width: `${Math.round(loadProgress * 100)}%` }}
              />
            </div>
            <span className="mono text-[0.7rem] text-[var(--muted-strong)]">
              {String(Math.round(loadProgress * 100)).padStart(3, "0")}%
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
