"use client";

import { useCallback, useRef, useState } from "react";
import ScrollScrubSequence from "@/components/scroll/ScrollScrubSequence";
import ViewfinderHUD from "@/components/scroll/ViewfinderHUD";
import LetterboxBars from "@/components/scroll/LetterboxBars";
import SpeedLines from "@/components/scroll/SpeedLines";
import ChromaticImpact from "@/components/scroll/ChromaticImpact";
import { useReducedMotion } from "@/app/lib/useReducedMotion";
import { CLIP_DURATION, FRAME_COUNT, BEATS, beatForProgress } from "@/app/lib/runBeats";

// Same tuned-feel constant Hero derives its pin height from (see that
// file's comment for where 2200/44.84 comes from). This is Part 1 of 2 of
// the run — "Desert Speed" and "The Clash" — split off from the rest (which
// now plays after the fan-art gallery as TheRunFinale) so each half gets
// real scroll room instead of the whole run flashing past in one long pin.
const SCRUB_VH_PER_SECOND = 2200 / 44.84;
const PIN_VH = (CLIP_DURATION * SCRUB_VH_PER_SECOND) / 100;

// Caption cross-fade window at each beat's edges, in seconds of clip time,
// converted to a progress fraction — gives every caption a soft in/out
// instead of a hard cut.
const CAPTION_FADE_SECONDS = 0.35;
const CAPTION_FADE_PROGRESS = CAPTION_FADE_SECONDS / CLIP_DURATION;

/** Trapezoid opacity: 0 outside [start,end], ramps over CAPTION_FADE_PROGRESS at each edge. */
function captionOpacity(progress: number, start: number, end: number): number {
  if (progress <= start || progress >= end) return 0;
  const fadeIn = (progress - start) / CAPTION_FADE_PROGRESS;
  const fadeOut = (end - progress) / CAPTION_FADE_PROGRESS;
  return Math.max(0, Math.min(1, fadeIn, fadeOut));
}

// Both of this part's beats carry a title; the filter exists mainly so this
// component's caption logic stays identical to TheRunFinale's, which does
// have a silent (title-less) bridge beat between its two captioned ones.
const CAPTIONED_BEATS = BEATS.filter((b) => b.title);

export default function TheRun() {
  const reduced = useReducedMotion();
  const [progress, setProgress] = useState(0);

  // Track scrub velocity for the speed-lines overlay: bump on each frame by
  // how far progress jumped; SpeedLines decays it back down when scrolling stops.
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
  const clashAt = CAPTIONED_BEATS[1]?.startProgress ?? 0.5;

  // Progress-driven colour grade only — saturation lifts toward the clash with
  // a touch of contrast. No rack-focus blur: the footage stays sharp throughout.
  const canvasFilter = `saturate(${(1.08 + progress * 0.12).toFixed(3)}) contrast(1.04)`;

  if (reduced) {
    const beat = beatForProgress(1);
    return (
      <section id="the-run" className="relative w-full bg-black">
        <ScrollScrubSequence framesPath="flash-run" frameCount={FRAME_COUNT} eager>
          <div className="video-vignette" aria-hidden="true" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10" />
          <div className="relative z-40 flex h-full flex-col items-center justify-end gap-4 px-6 pb-16 text-center">
            <span className="section-kicker">KRYNTIX STUDIO — THE RUN</span>
            <h2 className="display title-gradient title-electric text-[clamp(1.6rem,5vw,2.6rem)]">
              {beat.title}
            </h2>
            <p className="body-muted max-w-md text-sm">
              The Flash, at a dead sprint — reduced-motion mode. The full scroll-driven
              sequence with scene captions is available with motion enabled.
            </p>
          </div>
        </ScrollScrubSequence>
      </section>
    );
  }

  return (
    <section id="the-run" className="relative w-full bg-black">
      <ScrollScrubSequence
        framesPath="flash-run"
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
          sceneLabel={current.title || "—"}
          sceneIndex={sceneIndex}
          sceneTotal={CAPTIONED_BEATS.length}
        />
        <ChromaticImpact progress={progress} at={clashAt} />

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

        {/* Deliberately no per-frame scroll cue here the way Hero has one —
            this stage is long enough (~8.5 viewport-heights of scroll) that
            a static "SCROLL ↓" would sit stale on screen for most of it.
            The captions cycling in and out already read as clear
            scroll-driven motion on their own. */}
      </ScrollScrubSequence>
    </section>
  );
}
