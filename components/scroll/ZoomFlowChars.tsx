"use client";

import { useEffect, useRef } from "react";
import { gsap, SplitText } from "@/app/lib/gsap";

type TextTag = "h1" | "h2" | "h3" | "p" | "span";

interface ZoomFlowCharsProps {
  children: string;
  as?: TextTag;
  className?: string;
  /** 0-1 scrub progress from the parent section's ScrollTrigger */
  progress: number;
  /** Progress window (relative to the parent's own 0-1 range) this text animates across */
  startAt?: number;
  endAt?: number;
  /** Exposes the underlying element — e.g. so a parent can animate a
   * gradient-text background-position alongside the character reveal. */
  ref?: React.Ref<HTMLElement>;
}

/**
 * Characters zoom up from a small scale and flow in from the left, staggered
 * across a scroll-progress window — driven continuously by scroll position,
 * not a one-shot enter-viewport trigger like RevealText. Adapted verbatim
 * from the eco-power sibling project's ZoomFlowChars (no project-specific
 * tokens to swap here — the styling lives entirely in the className the
 * caller passes in).
 */
export default function ZoomFlowChars({
  children,
  as = "span",
  className = "",
  progress,
  startAt = 0.2,
  endAt = 0.6,
  ref,
}: ZoomFlowCharsProps) {
  const innerRef = useRef<HTMLElement | null>(null);
  const charsRef = useRef<Element[]>([]);

  const setRefs = (el: HTMLElement | null) => {
    innerRef.current = el;
    if (typeof ref === "function") ref(el);
    else if (ref) (ref as React.RefObject<HTMLElement | null>).current = el;
  };

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    // words,chars (not chars alone) keeps real word-wrap boundaries. No
    // mask here — characters need to move/scale beyond their own tight
    // bounding box, which a mask's overflow:clip wrapper would cut off.
    const split = SplitText.create(el, { type: "words,chars" });
    charsRef.current = split.chars;
    gsap.set(split.chars, { opacity: 0, scale: 0.25, x: -50 });
    return () => split.revert();
  }, [children]);

  useEffect(() => {
    const chars = charsRef.current;
    if (!chars.length) return;
    chars.forEach((char, i) => {
      const charStart =
        startAt + (i / chars.length) * (endAt - startAt) * 0.7;
      const charEnd = charStart + (endAt - startAt) * 0.3;
      const t = gsap.utils.clamp(
        0,
        1,
        gsap.utils.mapRange(charStart, charEnd, 0, 1, progress)
      );
      gsap.set(char, { opacity: t, scale: 0.25 + t * 0.75, x: (1 - t) * -50 });
    });
  }, [progress, startAt, endAt]);

  const Component = as as React.ElementType;

  return (
    <Component ref={setRefs} className={className}>
      {children}
    </Component>
  );
}
