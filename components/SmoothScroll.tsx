"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/app/lib/gsap";
import { lenisRef } from "@/app/lib/lenisStore";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      // No scroll-jacking, no smoothing — native document scroll for
      // reduced-motion users. ScrollTrigger still works fine off native scroll.
      return;
    }

    const lenis = new Lenis({
      duration: 1.9,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      wheelMultiplier: 0.4,
      touchMultiplier: 0.5,
    });
    lenisRef.current = lenis;
    (window as unknown as { __lenis?: Lenis; __gsap?: typeof gsap }).__lenis = lenis;
    (window as unknown as { __lenis?: Lenis; __gsap?: typeof gsap }).__gsap = gsap;
    document.documentElement.classList.add("has-lenis");

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Scroll-velocity skew: lean the ".velocity-skew" text blocks in the
    // direction of travel proportional to Lenis's current velocity, then let
    // them settle back to flat when scrolling slows. quickSetter writes skewY
    // to all matching elements each frame; the lerp smooths the response so it
    // eases rather than snapping. Targets have no other transform, so writing
    // skewY here can't clobber anything.
    const skewSetter = gsap.quickSetter(".velocity-skew", "skewY", "deg");
    let skew = 0;
    const skewTick = () => {
      const velocity = (lenis as unknown as { velocity?: number }).velocity ?? 0;
      const target = gsap.utils.clamp(-2.2, 2.2, velocity * 0.05);
      skew += (target - skew) * 0.12;
      if (Math.abs(skew) < 0.001) skew = 0;
      skewSetter(skew);
    };
    gsap.ticker.add(skewTick);

    return () => {
      gsap.ticker.remove(tick);
      gsap.ticker.remove(skewTick);
      lenis.destroy();
      lenisRef.current = null;
      document.documentElement.classList.remove("has-lenis");
    };
  }, []);

  return <>{children}</>;
}
