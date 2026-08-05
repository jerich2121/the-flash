"use client";

import { useEffect, useRef } from "react";
import { lenisRef } from "@/app/lib/lenisStore";
import KryntixMark from "./KryntixMark";

export default function Nav() {
  const navRef = useRef<HTMLElement>(null);

  // Jumping straight to a native #top anchor fights Lenis (it keeps its own
  // scroll-position state and will fully override a raw scrollTo on the
  // next frame). Driving it through Lenis directly is fast, correct, and
  // gets the scrub video back to frame zero as a side effect, since the
  // pinned trigger's progress recomputes off the real scroll position.
  function goToTop(e: React.MouseEvent) {
    if (lenisRef.current) {
      e.preventDefault();
      lenisRef.current.scrollTo(0, { duration: 0.35 });
    }
  }

  // Compacts (tighter padding, slightly more opaque background) once the
  // user has actually scrolled — a fixed bar that never changes reads as
  // static/template-y; a bar with a little weight to it feels considered.
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    let scrolled = false;
    function apply(isScrolled: boolean) {
      if (!nav) return;
      nav.style.paddingTop = isScrolled ? "0.75rem" : "1.25rem";
      nav.style.paddingBottom = isScrolled ? "0.75rem" : "1.25rem";
      nav.style.backgroundColor = isScrolled ? "rgba(5,2,3,0.97)" : "rgba(5,2,3,0.85)";
      nav.style.boxShadow = isScrolled ? "0 12px 30px -12px rgba(0,0,0,0.6)" : "none";
    }

    function onScroll() {
      const next = window.scrollY > 40;
      if (next === scrolled) return;
      scrolled = next;
      apply(scrolled);
    }

    apply(scrolled);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      ref={navRef}
      className="fixed inset-x-0 top-0 z-50 flex items-center justify-between border-b border-[var(--surface-border)] px-6 py-5 transition-[padding,background-color,box-shadow] duration-300 ease-out md:px-10"
      style={{
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
      }}
    >
      <a
        href="#top"
        onClick={goToTop}
        className="secondary flex items-center gap-2.5 text-base tracking-[0.08em] text-[var(--white)] transition-opacity hover:opacity-80"
      >
        <KryntixMark />
        KRYNTIX STUDIO
      </a>
      <a
        href="https://kryntixstudio.vercel.app"
        target="_blank"
        rel="noopener noreferrer"
        className="mono rounded-full border border-[var(--surface-border)] px-5 py-2.5 text-[0.72rem] tracking-[0.12em] text-[var(--accent-2)] transition-[color,background-color,border-color,transform] hover:scale-[1.04] hover:border-[var(--accent-2)] hover:bg-[rgba(255,224,102,0.06)]"
      >
        VISIT STUDIO →
      </a>
    </nav>
  );
}
