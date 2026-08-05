// Timing source-of-truth for the hero clip. Unlike the reference site this
// pattern is based on (a 26s multi-beat Iron Man reel), this footage is a
// single ~3.6s "THE FLASH" logo-reveal beat — cut from a rotated portrait
// source at the point right before the clip hard-cuts into unrelated
// montage footage (see CLAUDE.md / project notes for the exact frame
// analysis). There's no BEATS array here because there's only one beat: the
// whole clip. Every other file that would normally read a beat's time range
// off that array instead reads TITLE_REVEAL_PROGRESS, the point in the clip
// where "THE FLASH" wordmark has finished forming and holds on a full red/
// gold color grade — verified by sampling frames at 0.5s intervals: the
// wordmark is still an unfilled gold outline at 2.0s and fully colored by
// 2.6-2.9s, so chrome (kicker, tagline, CTA) fades in from that point
// rather than competing with the title animation itself.

export const CLIP_DURATION = 3.6;
export const FRAME_COUNT = 108; // native 30fps, no interpolation, libwebp q:v 95
export const FRAME_FPS = 30;

function toProgress(t: number): number {
  return Math.min(1, Math.max(0, t / CLIP_DURATION));
}

export const TITLE_REVEAL_SECONDS = 2.8;
export const TITLE_REVEAL_PROGRESS = toProgress(TITLE_REVEAL_SECONDS);

export function frameForProgress(progress: number): number {
  const idx = Math.round(progress * (FRAME_COUNT - 1));
  return Math.min(FRAME_COUNT - 1, Math.max(0, idx));
}

export function framePath(index: number): string {
  const n = String(index + 1).padStart(4, "0");
  return `/frames/flash-hero/frame_${n}.webp`;
}
