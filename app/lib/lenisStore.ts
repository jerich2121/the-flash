"use client";

import type Lenis from "lenis";

/** Holds the page's single Lenis instance so components outside
 *  SmoothScroll (e.g. Nav's "back to top" logo click) can drive it
 *  directly — calling native scrollTo while Lenis is active gets fought
 *  by Lenis's own animation loop on the next frame. */
export const lenisRef: { current: Lenis | null } = { current: null };

/** Smooth-scroll to an in-page section by id, leaving room under the fixed nav.
 *  Routes through Lenis when active (a raw jump gets fought by its loop),
 *  falling back to native scroll otherwise. */
export function scrollToSection(id: string, offset = -72) {
  if (typeof document === "undefined") return;
  const el = document.getElementById(id);
  if (!el) return;
  if (lenisRef.current) lenisRef.current.scrollTo(el, { offset, duration: 1.1 });
  else el.scrollIntoView();
}

/** Smooth-scroll back to the top of the page. */
export function scrollToTop() {
  if (lenisRef.current) lenisRef.current.scrollTo(0, { duration: 0.6 });
  else if (typeof window !== "undefined") window.scrollTo(0, 0);
}
