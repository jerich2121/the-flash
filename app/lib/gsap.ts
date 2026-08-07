"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin);

  // iOS Safari's collapsing/expanding address bar fires real `resize`
  // events *while the user is mid-scroll* (not just on rotation/load),
  // purely from the toolbar showing/hiding. ScrollTrigger's default
  // behavior treats every resize as a layout change worth a full refresh,
  // which on iOS can happen mid-scrub and recompute trigger start/end
  // positions against a momentarily-wrong viewport height, leaving a
  // pinned sequence stuck. This is GSAP's own documented fix for exactly
  // that failure mode — carried over from the eco-power sibling project,
  // which hit this for real on a live iPhone check.
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export { gsap, ScrollTrigger, SplitText, ScrambleTextPlugin };
