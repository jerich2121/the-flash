"use client";

// Lightweight pub/sub stores used to move scroll-scrub state out of React's
// render cycle. The pinned canvas reads these via refs inside rAF loops
// instead of re-rendering on every ScrollTrigger tick. Simpler than the
// multi-beat version this pattern is based on (see iron-man2's
// scrollStore.ts) — this clip is a single ~3.6s logo-reveal beat, so there's
// no activeBeatIndex to track, just raw scrub progress and preload state.

type Listener<T> = (value: T) => void;

function createStore<T>(initial: T) {
  let value = initial;
  const listeners = new Set<Listener<T>>();

  return {
    get: () => value,
    set: (next: T) => {
      if (next === value) return;
      value = next;
      listeners.forEach((l) => l(value));
    },
    subscribe: (listener: Listener<T>) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}

/** 0..1 progress through the pinned scrub stage only (not the whole document). */
export const scrubProgress = createStore(0);

/** Whether the frame sequence has finished preloading. */
export const framesReady = createStore(false);
