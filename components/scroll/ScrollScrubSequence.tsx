"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/app/lib/gsap";
import { useReducedMotion } from "@/app/lib/useReducedMotion";

interface ScrollScrubSequenceProps {
  /** Folder under /public/frames/, e.g. "flash-hero" */
  framesPath: string;
  /** Total frames in the sequence (frame_0001.webp .. frame_00NN.webp) */
  frameCount: number;
  /** Viewport-heights of scroll this beat pins for. Ignored when
   * externalProgress is provided — the parent owns the pin instead. */
  pinVh?: number;
  className?: string;
  children?: React.ReactNode;
  /** Reports 0-1 scrub progress each frame, e.g. to drive caption overlays. */
  onProgress?: (progress: number) => void;
  /** Reports 0-1 frame-preload progress (loadedCount/frameCount) as images
   * finish loading — for a site loading screen to track, distinct from
   * onProgress above (which reports scroll/scrub position, not load state). */
  onLoadProgress?: (progress: number) => void;
  /** When provided, this component doesn't create its own ScrollTrigger pin —
   * it just draws whichever frame this 0-1 value maps to. Used for layouts
   * where a parent owns a single pin and computes local progress itself.
   * Also switches the root element to fill its parent instead of forcing
   * h-screen. */
  externalProgress?: number;
  /** Skip the lazy IntersectionObserver and start loading frames as soon as
   * this becomes true. Above-the-fold sequences (Hero) need this — their
   * on-screen position at mount IS the viewport, so waiting for an
   * intersection callback just adds a pointless delay before loading starts. */
  eager?: boolean;
}

// Adapted from the eco-power sibling project's ScrollScrubSequence. Two
// deliberate deviations from that original, both noted where they apply:
// frame filenames here use an underscore (frame_0001.webp, matching how
// this project's ffmpeg extraction was already run) rather than eco-power's
// hyphen convention; and reduced-motion detection reuses this project's own
// reactive useReducedMotion hook (useSyncExternalStore-backed, updates live
// if the OS setting changes mid-session) instead of eco-power's one-time
// matchMedia check at mount.
function frameUrl(framesPath: string, index: number) {
  const num = String(index + 1).padStart(4, "0");
  return `/frames/${framesPath}/frame_${num}.webp`;
}

export default function ScrollScrubSequence({
  framesPath,
  frameCount,
  pinVh = 2.5,
  className = "",
  children,
  onProgress,
  onLoadProgress,
  externalProgress,
  eager = false,
}: ScrollScrubSequenceProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const reducedMotion = useReducedMotion();
  // Initialized straight from `eager` (a static prop, never toggled after
  // mount) rather than set inside an effect — an effect that unconditionally
  // calls setState on every run is a synchronous-setState-in-effect
  // anti-pattern (and an ESLint error under this project's react-hooks
  // config) for a value that's really just this component's true initial
  // state.
  const [inView, setInView] = useState(eager);
  const isExternal = externalProgress !== undefined;

  // Start preloading once the section is roughly approaching the viewport.
  // Skipped entirely when `eager` — inView already started true for
  // above-the-fold sequences whose on-screen position at mount already IS
  // the viewport, so there's nothing for an observer to watch for.
  useEffect(() => {
    if (eager) return;
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "50% 0px 50% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [eager]);

  useEffect(() => {
    if (!inView) return;
    let cancelled = false;
    let loadedCount = 0;
    const images: HTMLImageElement[] = [];

    for (let i = 0; i < frameCount; i++) {
      const img = new window.Image();
      img.src = frameUrl(framesPath, i);
      img.onload = img.onerror = () => {
        loadedCount++;
        if (!cancelled) onLoadProgress?.(loadedCount / frameCount);
        if (loadedCount === frameCount && !cancelled) {
          setIsLoaded(true);
        }
      };
      images.push(img);
    }
    imagesRef.current = images;

    return () => {
      cancelled = true;
    };
    // onLoadProgress is a parent-supplied callback (typically a stable
    // setState reference), not something that should retrigger/restart the
    // whole preload loop if it happened to change identity — same treatment
    // as onProgress elsewhere in this file.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, framesPath, frameCount]);

  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[index];
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    const targetWidth = Math.round(rect.width * dpr);
    const targetHeight = Math.round(rect.height * dpr);

    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
    }

    const canvasAspect = canvas.width / canvas.height;
    const imgAspect = img.naturalWidth / img.naturalHeight;
    let drawWidth = canvas.width;
    let drawHeight = canvas.height;
    let offsetX = 0;
    let offsetY = 0;

    if (imgAspect > canvasAspect) {
      drawHeight = canvas.height;
      drawWidth = drawHeight * imgAspect;
      offsetX = (canvas.width - drawWidth) / 2;
    } else {
      drawWidth = canvas.width;
      drawHeight = drawWidth / imgAspect;
      offsetY = (canvas.height - drawHeight) / 2;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  };

  // Reduced motion: skip the scrub entirely, show the static end-state frame.
  useEffect(() => {
    if (reducedMotion && isLoaded) {
      drawFrame(frameCount - 1);
    }
  }, [reducedMotion, isLoaded, frameCount]);

  // Externally-driven mode: a parent owns a single ScrollTrigger and hands
  // us a plain 0-1 number instead — just paint whatever frame it maps to.
  useEffect(() => {
    if (externalProgress === undefined) return;
    const clamped = gsap.utils.clamp(0, 1, externalProgress);
    const index = Math.floor(clamped * (frameCount - 1));
    currentFrameRef.current = index;
    drawFrame(index);
    onProgress?.(clamped);
    // drawFrame is a stable-enough closure over refs; only the actual
    // progress input should retrigger a redraw.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalProgress, frameCount]);

  // Pin/scrub is wired up on mount, independent of asset load state — the
  // pinned scroll distance must be stable before the user reaches this
  // section, otherwise frames finishing loading mid-scroll shifts document
  // height and jumps the user's scroll position. drawFrame() itself already
  // no-ops until each specific frame image is ready.
  useEffect(() => {
    if (reducedMotion || isExternal) return;
    const section = sectionRef.current;
    if (!section) return;

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: () => `+=${window.innerHeight * pinVh}`,
      pin: true,
      anticipatePin: 1,
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const index = Math.floor(self.progress * (frameCount - 1));
        currentFrameRef.current = index;
        drawFrame(index);
        onProgress?.(self.progress);
      },
    });

    const onResize = () => {
      drawFrame(currentFrameRef.current);
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", onResize);

    return () => {
      st.kill();
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion, isExternal, frameCount, pinVh]);

  // Once frames finish loading, paint whatever frame the current progress
  // maps to (covers the case where loading completes mid-scroll).
  useEffect(() => {
    if (reducedMotion || !isLoaded) return;
    drawFrame(currentFrameRef.current);
  }, [reducedMotion, isLoaded]);

  return (
    <div
      ref={sectionRef}
      className={`relative overflow-hidden bg-black ${
        isExternal ? "h-full w-full" : "h-screen w-full"
      } ${className}`}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-dark)]/60">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent-2)] border-t-transparent" />
        </div>
      )}
      {children}
    </div>
  );
}
