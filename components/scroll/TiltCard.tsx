"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/app/lib/gsap";

interface TiltCardProps {
  children: React.ReactNode;
  /** Extra layout-only classes on the visual card surface (padding,
   * overflow-hidden, sizing) — layered on top of the site's existing
   * .card-surface look. */
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
  style?: React.CSSProperties;
}

// Subtle pointer-tracked 3D tilt + lift on hover, ported from the eco-power
// sibling project's TiltCard. Desktop/trackpad-only (a tilt tied to the last
// touch coordinate would just stick after a tap on touch devices) and
// skipped entirely under prefers-reduced-motion.
export default function TiltCard({ children, className = "", ref, style }: TiltCardProps) {
  const innerRef = useRef<HTMLDivElement | null>(null);

  const setOuterRef = (el: HTMLDivElement | null) => {
    if (typeof ref === "function") ref(el);
    else if (ref) (ref as React.RefObject<HTMLDivElement | null>).current = el;
  };

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointerFine = window.matchMedia("(pointer: fine)").matches;
    if (reducedMotion || !pointerFine) return;

    const rotateX = gsap.quickTo(el, "rotationX", { duration: 0.5, ease: "power3.out" });
    const rotateY = gsap.quickTo(el, "rotationY", { duration: 0.5, ease: "power3.out" });
    const lift = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });

    const handleMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      rotateY(px * 10);
      rotateX(-py * 10);
      lift(-4);
    };
    const handleLeave = () => {
      rotateX(0);
      rotateY(0);
      lift(0);
    };

    el.addEventListener("pointermove", handleMove);
    el.addEventListener("pointerleave", handleLeave);
    return () => {
      el.removeEventListener("pointermove", handleMove);
      el.removeEventListener("pointerleave", handleLeave);
    };
  }, []);

  return (
    <div ref={setOuterRef} style={{ perspective: "900px", ...style }}>
      <div
        ref={innerRef}
        className={`card-surface transition-[box-shadow,border-color] duration-300 hover:border-[var(--surface-border)] ${className}`}
        style={{ willChange: "transform" }}
      >
        {children}
      </div>
    </div>
  );
}
