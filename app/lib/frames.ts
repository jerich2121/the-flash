"use client";

import { FRAME_COUNT, framePath } from "./beats";

export interface PreloadResult {
  images: HTMLImageElement[];
}

/**
 * Preloads the full WebP frame sequence, reporting progress as it goes.
 * Loads with limited concurrency so we don't blow the browser's connection
 * pool on lots of simultaneous requests.
 */
export function preloadFrames(
  onProgress: (loaded: number, total: number) => void,
  concurrency = 12
): { promise: Promise<PreloadResult>; cancel: () => void } {
  const total = FRAME_COUNT;
  const images: HTMLImageElement[] = new Array(total);
  let loaded = 0;
  let cancelled = false;
  let nextIndex = 0;

  const promise = new Promise<PreloadResult>((resolve) => {
    function loadOne() {
      if (cancelled) return;
      const i = nextIndex++;
      if (i >= total) {
        if (loaded >= total) resolve({ images });
        return;
      }
      const img = new Image();
      img.decoding = "async";
      img.onload = img.onerror = () => {
        loaded++;
        onProgress(loaded, total);
        if (!cancelled) {
          if (loaded >= total) resolve({ images });
          loadOne();
        }
      };
      img.src = framePath(i);
      images[i] = img;
    }

    const workers = Math.min(concurrency, total);
    for (let w = 0; w < workers; w++) loadOne();
  });

  return {
    promise,
    cancel: () => {
      cancelled = true;
    },
  };
}

/** Draws `img` into the canvas context with CSS `object-fit: cover` behavior. */
export function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  cw: number,
  ch: number
) {
  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;
  if (!iw || !ih) return;
  const scale = Math.max(cw / iw, ch / ih);
  const dw = iw * scale;
  const dh = ih * scale;
  const dx = (cw - dw) / 2;
  const dy = (ch - dh) / 2;
  ctx.clearRect(0, 0, cw, ch);
  ctx.drawImage(img, dx, dy, dw, dh);
}
