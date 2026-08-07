"use client";

import { useEffect, useRef } from "react";
import { gsap, SplitText } from "@/app/lib/gsap";
import { useReducedMotion } from "@/app/lib/useReducedMotion";

type TextTag = "h1" | "h2" | "h3" | "p" | "span";

interface RevealTextProps {
  children: string;
  as?: TextTag;
  split?: "chars" | "words";
  stagger?: number;
  delay?: number;
  /** ScrollTrigger start position relative to this element */
  start?: string;
  className?: string;
}

/**
 * One-shot masked blur/scale-up reveal on scroll-into-view — adapted from
 * the eco-power sibling project's RevealText. For body copy/subheads that
 * should animate in once as the user scrolls to them (as opposed to
 * ZoomFlowChars below, which is continuously scrubbed against a pinned
 * section's own progress).
 */
export default function RevealText({
  children,
  as = "span",
  split = "words",
  stagger,
  delay = 0,
  start = "top 85%",
  className = "",
}: RevealTextProps) {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const el = ref.current;
    if (!el) return;

    const splitInstance = SplitText.create(el, {
      // "words,chars" (not just "chars") so each word stays wrapped in its
      // own span — otherwise the browser wraps mid-word between individual
      // masked character spans instead of at real word boundaries.
      type: split === "chars" ? "words,chars" : "words",
      mask: split,
      onSplit: (self) => {
        const targets = split === "chars" ? self.chars : self.words;
        return gsap.from(targets, {
          opacity: 0,
          yPercent: 100,
          filter: "blur(14px)",
          scale: 1.04,
          duration: 1,
          delay,
          ease: "power3.out",
          stagger: stagger ?? (split === "chars" ? 0.022 : 0.07),
          scrollTrigger: {
            trigger: el,
            start,
            once: true,
          },
        });
      },
    });

    return () => splitInstance.revert();
  }, [reducedMotion, split, stagger, delay, start]);

  const Component = as as React.ElementType;

  return (
    <Component ref={ref} className={className}>
      {children}
    </Component>
  );
}
