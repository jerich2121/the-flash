"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/app/lib/gsap";
import { useReducedMotion } from "@/app/lib/useReducedMotion";

type TextTag = "h1" | "h2" | "h3" | "p" | "span";

interface ScrambleRevealProps {
  children: string;
  as?: TextTag;
  className?: string;
  duration?: number;
  delay?: number;
  /** ScrollTrigger start position relative to this element */
  start?: string;
}

/**
 * A HUD-style label that scrambles into its final text as it scrolls into
 * view — a tasteful, on-theme touch for a speed-themed site (borrowed from
 * the eco-power sibling project's ScrambleReveal, which uses it for small
 * eyebrow labels). Kept to short, all-caps eyebrow/badge text — a scramble
 * effect on a full paragraph would read as noisy rather than deliberate.
 */
export default function ScrambleReveal({
  children,
  as = "span",
  className = "",
  duration = 1,
  delay = 0,
  start = "top 75%",
}: ScrambleRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const el = ref.current;
    if (!el) return;

    gsap.set(el, { opacity: 0, y: 16 });

    const tween = gsap.to(el, {
      opacity: 1,
      y: 0,
      duration,
      delay,
      scrambleText: {
        text: children,
        chars: "upperCase",
        speed: 0.4,
      },
      scrollTrigger: {
        trigger: el,
        start,
        once: true,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [reducedMotion, children, duration, delay, start]);

  const Component = as as React.ElementType;

  return (
    <Component ref={ref} className={className}>
      {children}
    </Component>
  );
}
