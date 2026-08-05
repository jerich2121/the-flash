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
    document.documentElement.classList.add("has-lenis");

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
      document.documentElement.classList.remove("has-lenis");
    };
  }, []);

  return <>{children}</>;
}
