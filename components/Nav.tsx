"use client";

import { useEffect, useRef, useState } from "react";
import { scrollToSection, scrollToTop } from "@/app/lib/lenisStore";
import KryntixMark from "./KryntixMark";

// In-page section targets for the centre nav. Ids are set on the matching
// sections (see the-run / gallery / breakdown / about).
const LINKS = [
  { label: "The Run", id: "the-run" },
  { label: "Gallery", id: "gallery" },
  { label: "Breakdown", id: "breakdown" },
  { label: "About", id: "about" },
] as const;

export default function Nav() {
  const navRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState<string>("");

  function goToTop(e: React.MouseEvent) {
    e.preventDefault();
    scrollToTop();
  }

  function onLink(e: React.MouseEvent, id: string) {
    e.preventDefault();
    scrollToSection(id);
  }

  // Compact the bar (tighter padding, more opaque) once scrolled — a bar that
  // never changes reads as static/template-y.
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    let scrolled = false;
    function apply(isScrolled: boolean) {
      if (!nav) return;
      nav.style.paddingTop = isScrolled ? "0.7rem" : "1.15rem";
      nav.style.paddingBottom = isScrolled ? "0.7rem" : "1.15rem";
      nav.style.backgroundColor = isScrolled ? "rgba(5,2,3,0.92)" : "rgba(5,2,3,0.55)";
      nav.style.boxShadow = isScrolled ? "0 14px 34px -18px rgba(0,0,0,0.7)" : "none";
    }
    function onScroll() {
      const next = window.scrollY > 40;
      if (next === scrolled) return;
      scrolled = next;
      apply(scrolled);
    }
    apply(false);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Active-section spotlight: mark whichever target section is crossing a thin
  // band just above centre. rootMargin keeps only one section "active" at a time.
  useEffect(() => {
    const sections = LINKS
      .map((l) => document.getElementById(l.id))
      .filter((el): el is HTMLElement => !!el);
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      ref={navRef}
      className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-[1.15rem] transition-[padding,background-color,box-shadow] duration-300 ease-out md:px-10"
      style={{
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      {/* Premium hairline edge along the bottom. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(225,29,46,0.4), rgba(255,224,102,0.35), transparent)",
        }}
      />

      {/* Brand lockup */}
      <a
        href="#top"
        onClick={goToTop}
        className="group flex items-center gap-2.5"
        aria-label="Kryntix Studio — back to top"
      >
        <KryntixMark className="h-6 w-auto transition-transform duration-300 group-hover:scale-110" />
        <span className="flex items-baseline gap-1.5 leading-none">
          <span className="display text-[1.15rem] tracking-[0.06em] text-[var(--white)]">
            KRYNTIX
          </span>
          <span className="mono text-[0.62rem] uppercase tracking-[0.34em] text-[var(--muted-strong)]">
            Studio
          </span>
        </span>
      </a>

      {/* Centre section nav (desktop) */}
      <div className="pointer-events-auto absolute left-1/2 hidden -translate-x-1/2 items-center gap-9 md:flex">
        {LINKS.map((l) => {
          const isActive = active === l.id;
          return (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={(e) => onLink(e, l.id)}
              className={`relative mono text-[0.72rem] uppercase tracking-[0.22em] transition-colors duration-200 ${
                isActive
                  ? "text-[var(--accent-2)]"
                  : "text-[var(--muted-strong)] hover:text-[var(--white)]"
              }`}
            >
              {l.label}
              <span
                aria-hidden="true"
                className={`absolute -bottom-2 left-1/2 h-px -translate-x-1/2 rounded-full bg-[var(--accent-2)] shadow-[0_0_6px_var(--accent-2)] transition-all duration-300 ${
                  isActive ? "w-5 opacity-100" : "w-0 opacity-0"
                }`}
              />
            </a>
          );
        })}
      </div>

      {/* CTA */}
      <a
        href="https://kryntixstudio.vercel.app"
        target="_blank"
        rel="noopener noreferrer"
        className="mono group inline-flex items-center gap-2 rounded-full border border-[var(--surface-border-glow)] px-5 py-2.5 text-[0.7rem] tracking-[0.14em] text-[var(--accent-2)] transition-[color,background-color,border-color] duration-200 hover:border-[var(--accent-2)] hover:bg-[rgba(255,224,102,0.06)]"
      >
        VISIT STUDIO
        <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
      </a>
    </nav>
  );
}
