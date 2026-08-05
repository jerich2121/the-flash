"use client";

import type Lenis from "lenis";

/** Holds the page's single Lenis instance so components outside
 *  SmoothScroll (e.g. Nav's "back to top" logo click) can drive it
 *  directly — calling native scrollTo while Lenis is active gets fought
 *  by Lenis's own animation loop on the next frame. */
export const lenisRef: { current: Lenis | null } = { current: null };
