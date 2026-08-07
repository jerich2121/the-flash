"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/app/lib/gsap";

/**
 * Owns the page's generic scroll-reveal animations — the ".reveal-up" and
 * ".bg-fade-in" utility classes used by the static sections (HeroTransition,
 * CTA, Footer). Renders nothing.
 *
 * Used to also own both pinned canvas scrubs (Hero's logo reveal and
 * TheRun's action montage), hand-rolled with a custom playback-speed cap
 * and a manual Lenis lead-clamp. Replaced by ScrollScrubSequence (see
 * components/scroll/), adapted from the eco-power sibling project: each
 * pinned sequence now owns its own real GSAP `pin: true` ScrollTrigger
 * directly, rather than routing progress through this component and a
 * shared pub/sub store. Simpler, and sidesteps a real bug the old
 * hand-rolled version had — with two independent hand-tuned clamp loops
 * fighting the same Lenis instance, the second stage's displayed progress
 * could get stuck pinned near 0 (verified live: scrollY kept snapping back
 * to the exact same pixel value no matter how much further the user
 * scrolled) since each clamp's "allowed lead" correction assumed it was the
 * only one adjusting the real scroll position. GSAP's own pin mechanism
 * doesn't have that failure mode.
 */
export default function MotionOrchestrator() {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const revealCtx = gsap.context(() => {
      const bgTargets = gsap.utils.toArray<HTMLElement>(".bg-fade-in");

      if (prefersReduced) {
        // No scroll-jacking or animation for reduced-motion users — just
        // make sure the background layers this class hides by default
        // (see globals.css) actually become visible.
        bgTargets.forEach((el) => {
          const to = el.dataset.fadeTo ? parseFloat(el.dataset.fadeTo) : 1;
          gsap.set(el, { opacity: to });
        });
        return;
      }

      bgTargets.forEach((el) => {
        const to = el.dataset.fadeTo ? parseFloat(el.dataset.fadeTo) : 1;
        gsap.fromTo(
          el,
          { opacity: 0 },
          {
            opacity: to,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "top 50%",
              scrub: true,
            },
          }
        );
      });

      const targets = gsap.utils.toArray<HTMLElement>(".reveal-up");
      targets.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 36 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // Depth parallax — background-image layers and a few decorative blocks
      // drift at a different rate than the page as they cross the viewport.
      // data-parallax holds the yPercent travel (of the element's own height);
      // background layers live in wrappers sized taller than their section so
      // the drift never exposes an edge. Only elements NOT already running a
      // transform animation (velocity-skew, glow-drift, sparks, reveal) carry
      // this, so nothing fights over `transform`.
      const parallaxTargets = gsap.utils.toArray<HTMLElement>("[data-parallax]");
      parallaxTargets.forEach((el) => {
        const speed = parseFloat(el.dataset.parallax || "0");
        if (!speed) return;
        gsap.fromTo(
          el,
          { yPercent: -speed },
          {
            yPercent: speed,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });
    });

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);

    return () => {
      revealCtx.revert();
      window.removeEventListener("load", refresh);
    };
  }, []);

  return null;
}
