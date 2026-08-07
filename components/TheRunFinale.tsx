"use client";

import { useCallback, useRef, useState } from "react";
import ScrollScrubSequence from "@/components/scroll/ScrollScrubSequence";
import ViewfinderHUD from "@/components/scroll/ViewfinderHUD";
import LetterboxBars from "@/components/scroll/LetterboxBars";
import SpeedLines from "@/components/scroll/SpeedLines";
import BeatFlash from "@/components/scroll/BeatFlash";
import { useReducedMotion } from "@/app/lib/useReducedMotion";
import { CLIP_DURATION, FRAME_COUNT, BEATS, beatForProgress } from "@/app/lib/runBeatsPart2";

// Part 2 of 2 of the run — see TheRun.tsx for Part 1 ("Desert Speed" and
// "The Clash") and app/lib/runBeatsPart2.ts for this half's own beat map.
// Placed after the fan-art gallery rather than running straight on from
// Part 1, so the gallery gets to breathe as its own destination instead of
// being a pit-stop mid-action.
const SCRUB_VH_PER_SECOND = 2200 / 44.84;
const PIN_VH = (CLIP_DURATION * SCRUB_VH_PER_SECOND) / 100;

const CAPTION_FADE_SECONDS = 0.35;
const CAPTION_FADE_PROGRESS = CAPTION_FADE_SECONDS / CLIP_DURATION;

/** Trapezoid opacity: 0 outside [start,end], ramps over CAPTION_FADE_PROGRESS at each edge. */
function captionOpacity(progress: number, start: number, end: number): number {
  if (progress <= start || progress >= end) return 0;
  const fadeIn = (progress - start) / CAPTION_FADE_PROGRESS;
  const fadeOut = (end - progress) / CAPTION_FADE_PROGRESS;
  return Math.max(0, Math.min(1, fadeIn, fadeOut));
}

// The silent "bridge" cutaway (reused close-up mask shot) deliberately
// carries no title/line — see runBeatsPart2.ts — so only beats with a
// title get a caption block in the DOM at all.
const CAPTIONED_BEATS = BEATS.filter((b) => b.title);

export default function TheRunFinale() {
  const reduced = useReducedMotion();
  const [progress, setProgress] = useState(0);

  const velocityRef = useRef(0);
  const lastProgressRef = useRef(0);
  const handleProgress = useCallback((p: number) => {
    velocityRef.current = Math.min(
      1.4,
      velocityRef.current + Math.abs(p - lastProgressRef.current) * 14
    );
    lastProgressRef.current = p;
    setProgress(p);
  }, []);

  const current = beatForProgress(progress);
  const sceneIndex = Math.max(
    0,
    CAPTIONED_BEATS.findIndex((b) => b.id === current.id)
  );
  const boundaries = CAPTIONED_BEATS.map((b) => b.startProgress);

  // Progress-driven colour grade only — saturation lifts through the finale
  // with a touch of contrast. No rack-focus blur: footage stays sharp.
  const canvasFilter = `saturate(${(1.08 + progress * 0.12).toFixed(3)}) contrast(1.04)`;

  if (reduced) {
    const beat = beatForProgress(1);
    return (
      <section id="the-run-finale" className="relative w-full bg-black">
        <ScrollScrubSequence framesPath="flash-run-2" frameCount={FRAME_COUNT} eager>
          <div className="video-vignette" aria-hidden="true" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10" />
          <div className="relative z-40 flex h-full flex-col items-center justify-end gap-4 px-6 pb-16 text-center">
            <span className="section-kicker">KRYNTIX STUDIO — THE RUN, CONTINUED</span>
            <h2 className="display title-gradient title-electric text-[clamp(1.6rem,5vw,2.6rem)]">
              {beat.title}
            </h2>
            <p className="body-muted max-w-md text-sm">
              The run picks back up — reduced-motion mode. The full scroll-driven
              sequence with scene captions is available with motion enabled.
            </p>
          </div>
        </ScrollScrubSequence>
      </section>
    );
  }

  return (
    <section id="the-run-finale" className="relative w-full bg-black">
      <ScrollScrubSequence
        framesPath="flash-run-2"
        frameCount={FRAME_COUNT}
        pinVh={PIN_VH}
        onProgress={handleProgress}
        canvasFilter={canvasFilter}
        parallax
      >
        <div className="video-vignette" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />

        <SpeedLines velocityRef={velocityRef} />
        <LetterboxBars progress={progress} />
        <ViewfinderHUD
          progress={progress}
          durationSeconds={CLIP_DURATION}
          sceneLabel={current.title || "TRANSITION"}
          sceneIndex={sceneIndex}
          sceneTotal={CAPTIONED_BEATS.length}
        />
        <BeatFlash progress={progress} boundaries={boundaries} />

        {CAPTIONED_BEATS.map((beat, i) => (
          <div
            key={beat.id}
            className="pointer-events-none absolute inset-x-0 bottom-16 z-20 flex flex-col items-center gap-3 px-6 text-center md:bottom-20"
            style={{ opacity: captionOpacity(progress, beat.startProgress, beat.endProgress) }}
          >
            <span className="hud-badge">
              <span className="hud-badge-dot" />
              KRYNTIX STUDIO — SCENE {String(i + 1).padStart(2, "0")}/{String(CAPTIONED_BEATS.length).padStart(2, "0")}
            </span>
            <h3 className="display title-gradient title-electric text-[clamp(1.6rem,5.5vw,3rem)]">
              {beat.title}
            </h3>
            <p className="body-muted caption-shadow max-w-md text-sm md:text-base">{beat.line}</p>
          </div>
        ))}
      </ScrollScrubSequence>
    </section>
  );
}
