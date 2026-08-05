"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/app/lib/gsap";
import { CLIP_DURATION } from "@/app/lib/beats";
import { scrubProgress, framesReady } from "@/app/lib/scrollStore";
import { lenisRef } from "@/app/lib/lenisStore";

/**
 * Owns the page's ScrollTrigger timeline: the pinned canvas scrub (progress
 * -> scrubProgress store, consumed imperatively by Hero) plus the
 * lightweight reveal-on-scroll animations used by the sections that come
 * after it. Renders nothing.
 */
export default function MotionOrchestrator() {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let scrubTrigger: ScrollTrigger | undefined;
    let rafId = 0;
    const scrubRoot = document.querySelector("[data-scrub-root]");

    if (scrubRoot && !prefersReduced) {
      // Caps how fast the video can play, and actually *gates real scroll
      // progress* to that pace — not just a cosmetic display cap. A hard
      // fling or huge trackpad swipe still moves the scrollbar/page, but the
      // pinned stage physically can't be scrolled past faster than the
      // reveal plays: displayedProgress tracks the real scroll-derived
      // progress at up to MAX_PLAYBACK_MULTIPLIER×, and if the raw scroll
      // gets more than ALLOWED_LEAD_SECONDS ahead of it, we pull the actual
      // scroll position back.
      const MAX_PLAYBACK_MULTIPLIER = 1.4;
      const ALLOWED_LEAD_SECONDS = 0.2;
      const maxProgressPerSecond = MAX_PLAYBACK_MULTIPLIER / CLIP_DURATION;
      const allowedLeadProgress = ALLOWED_LEAD_SECONDS / CLIP_DURATION;

      let displayedProgress = 0;
      let lastTime = performance.now();

      scrubTrigger = ScrollTrigger.create({
        trigger: scrubRoot,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
      });
      const trigger = scrubTrigger;

      function tick(now: number) {
        const dt = Math.min((now - lastTime) / 1000, 0.1);
        lastTime = now;

        const rawProgress = trigger.progress;
        const diff = rawProgress - displayedProgress;
        // Cap only applies going forward — going backward (e.g. a "back to
        // top" jump) syncs the displayed frame immediately instead of
        // slowly rewinding at the same capped rate.
        if (diff <= 0) {
          displayedProgress = rawProgress;
        } else {
          const maxStep = maxProgressPerSecond * dt;
          displayedProgress = diff <= maxStep ? rawProgress : displayedProgress + maxStep;
        }

        scrubProgress.set(displayedProgress);

        const lead = rawProgress - displayedProgress;
        if (lead > allowedLeadProgress && lenisRef.current) {
          const clampedProgress = displayedProgress + allowedLeadProgress;
          const clampedScrollY = trigger.start + clampedProgress * (trigger.end - trigger.start);
          lenisRef.current.scrollTo(clampedScrollY, { immediate: true });
        }

        rafId = requestAnimationFrame(tick);
      }
      rafId = requestAnimationFrame(tick);
    }

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
    });

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    const unsubReady = framesReady.subscribe(() => {
      requestAnimationFrame(refresh);
    });

    return () => {
      cancelAnimationFrame(rafId);
      scrubTrigger?.kill();
      revealCtx.revert();
      window.removeEventListener("load", refresh);
      unsubReady();
    };
  }, []);

  return null;
}
