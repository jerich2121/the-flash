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
//
// Six frames (97, 99, 101, 103, 105, 107 in the original 108-frame extract)
// alternated to roughly half brightness against their neighbors — a flicker
// artifact in the source. Rather than patch them in place, they were
// deleted outright and the remaining 102 frames renumbered contiguously,
// so FRAME_COUNT/CLIP_DURATION below reflect the shorter, flicker-free cut.

export const CLIP_DURATION = 102 / 30; // 3.4s
export const FRAME_COUNT = 102; // native 30fps, flicker frames removed, libwebp q:v 95
export const FRAME_FPS = 30;

function toProgress(t: number): number {
  return Math.min(1, Math.max(0, t / CLIP_DURATION));
}

export const TITLE_REVEAL_SECONDS = 2.8;
export const TITLE_REVEAL_PROGRESS = toProgress(TITLE_REVEAL_SECONDS);
