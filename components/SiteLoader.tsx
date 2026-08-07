"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/app/lib/gsap";

interface SiteLoaderProps {
  /** 0-1 */
  progress: number;
  ready: boolean;
}

const BOLT = "M58 4 L26 76 L48 76 L40 136 L80 56 L54 56 Z";

/**
 * Cinematic intro / loading overlay shown while Hero's frame sequence preloads.
 * A GSAP title sequence: the bolt outline draws itself in (stroke-dashoffset
 * animated off getTotalLength), the fill "charges up" from the bottom as frames
 * load, the wordmark + progress stagger in — then, once ready, a choreographed
 * flash-and-wipe exit timeline hands off to the hero. Rendered only in motion
 * mode (Hero gates it), so the animation always runs.
 */
export default function SiteLoader({ progress, ready }: SiteLoaderProps) {
  const percent = Math.round(progress * 100);
  const rootRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const boltRef = useRef<SVGSVGElement>(null);
  const outlineRef = useRef<SVGPathElement>(null);

  // Entrance: draw the bolt outline, then stagger in the chrome.
  useEffect(() => {
    const outline = outlineRef.current;
    const content = contentRef.current;
    const tl = gsap.timeline();
    if (outline) {
      const len = outline.getTotalLength();
      gsap.set(outline, { strokeDasharray: len, strokeDashoffset: len });
      tl.to(outline, { strokeDashoffset: 0, duration: 1.1, ease: "power2.inOut" }, 0);
    }
    if (content) {
      tl.from(
        content.querySelectorAll(".loader-reveal"),
        { y: 14, opacity: 0, duration: 0.55, stagger: 0.12, ease: "power3.out" },
        0.35
      );
    }
    return () => {
      tl.kill();
    };
  }, []);

  // Exit: once the hero frames are ready, flash the charged bolt and wipe away.
  useEffect(() => {
    if (!ready) return;
    const root = rootRef.current;
    const tl = gsap.timeline();
    tl.to(boltRef.current, {
      scale: 1.18,
      duration: 0.28,
      ease: "power2.in",
      transformOrigin: "50% 50%",
      filter: "drop-shadow(0 0 26px rgba(255,224,102,0.9))",
    })
      .to(
        contentRef.current,
        { opacity: 0, scale: 1.08, duration: 0.4, ease: "power2.in" },
        ">-0.06"
      )
      .to(root, { opacity: 0, duration: 0.5, ease: "power2.inOut" }, "<0.12")
      .set(root, { display: "none", pointerEvents: "none" });
    return () => {
      tl.kill();
    };
  }, [ready]);

  const clamped = Math.min(1, Math.max(0, progress));
  const fillY = 140 * (1 - clamped);
  const fillH = 140 - fillY;

  return (
    <div
      ref={rootRef}
      aria-hidden={ready}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-7 overflow-hidden bg-[var(--bg-dark)]"
    >
      <div ref={contentRef} className="flex flex-col items-center gap-7">
        <span className="loader-reveal mono text-[0.62rem] uppercase tracking-[0.4em] text-[var(--muted-strong)]">
          Kryntix Studio Presents
        </span>

        <svg ref={boltRef} viewBox="0 0 100 140" className="h-28 w-auto" aria-hidden="true">
          <defs>
            <linearGradient id="loaderBolt" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent-2)" />
              <stop offset="55%" stopColor="var(--gold)" />
              <stop offset="100%" stopColor="var(--accent)" />
            </linearGradient>
            <clipPath id="loaderFill">
              <rect x="0" y={fillY} width="100" height={fillH} />
            </clipPath>
          </defs>
          {/* Charged fill rising with load progress */}
          <path d={BOLT} fill="url(#loaderBolt)" clipPath="url(#loaderFill)" />
          {/* Outline that draws itself in */}
          <path
            ref={outlineRef}
            d={BOLT}
            fill="none"
            stroke="var(--accent-2)"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>

        <div className="loader-reveal flex items-baseline gap-1.5 leading-none">
          <span className="display text-2xl tracking-[0.06em] text-[var(--white)]">KRYNTIX</span>
          <span className="mono text-[0.7rem] uppercase tracking-[0.34em] text-[var(--muted-strong)]">
            Studio
          </span>
        </div>

        <div className="loader-reveal flex flex-col items-center gap-2.5">
          <div className="h-[3px] w-52 overflow-hidden rounded-full bg-[rgba(255,255,255,0.09)]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] transition-[width] duration-200 ease-out"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="mono text-[0.7rem] uppercase tracking-[0.3em] text-[var(--muted-strong)]">
            {percent}% — Charging Speed Force
          </p>
        </div>
      </div>
    </div>
  );
}
