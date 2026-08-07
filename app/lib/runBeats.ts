// Timing source-of-truth for TheRun's clip — Part 1 of 2 of the second
// source video (logoremover_1785907397680.mp4), rotated the same way as
// Hero's footage (transpose=2). This file now covers only "Desert Speed"
// and "The Clash" — the clip was split at The Clash's climactic collision
// frame so the rest of the run (the quiet bridge cutaway, "No Hesitation",
// and "Common Ground") plays as its own section after the fan-art gallery
// instead of running straight through. See runBeatsPart2.ts for that half.
//
// Two blocks were cut from the original 17.389s master before this split:
// a ~4.5s duplicate block with a broken picture-in-picture compositing
// glitch at its seam (roughly 8.5s-13.0s of the original), and a separate
// ~0.53s shot of an unsuited runner that didn't belong in the cut (roughly
// 11.17s-11.70s of the once-deduplicated master).
//
// FRAME_COUNT/FRAME_FPS below reflect what `fps=30` extraction actually
// produced (268 frames covering ~8.933s) from this part's own master.
// CLIP_DURATION is derived from the frame count rather than hardcoded so
// progress -> frame-index math stays exact instead of running past the
// last real frame.

export const FRAME_COUNT = 268; // native 30fps, part 1 of 2, libwebp q:v 95
export const FRAME_FPS = 30;
export const CLIP_DURATION = FRAME_COUNT / FRAME_FPS; // ~8.9333s

function toProgress(t: number): number {
  return Math.min(1, Math.max(0, t / CLIP_DURATION));
}

export interface RunBeat {
  id: string;
  title: string;
  line: string;
  startSeconds: number;
  endSeconds: number;
  startProgress: number;
  endProgress: number;
}

const RAW_BEATS: Omit<RunBeat, "startProgress" | "endProgress">[] = [
  {
    id: "desert-speed",
    title: "DESERT SPEED",
    line: "Open desert. A trail of lightning. The horizon already burning behind him.",
    startSeconds: 0,
    endSeconds: 4.5,
  },
  {
    id: "the-clash",
    title: "THE CLASH",
    line: "Two speedsters, one collision — crimson lightning slams into electric blue.",
    startSeconds: 4.5,
    endSeconds: CLIP_DURATION,
  },
];

export const BEATS: RunBeat[] = RAW_BEATS.map((b) => ({
  ...b,
  startProgress: toProgress(b.startSeconds),
  endProgress: toProgress(b.endSeconds),
}));

/** The beat covering a given 0..1 scrub progress value. Always returns a beat. */
export function beatForProgress(progress: number): RunBeat {
  for (const beat of BEATS) {
    if (progress >= beat.startProgress && progress < beat.endProgress) return beat;
  }
  return BEATS[BEATS.length - 1];
}
