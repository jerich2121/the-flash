// Timing source-of-truth for TheRun's clip — Part 2 of 2 (see runBeats.ts
// for Part 1 and the full history of what was cut from the source video).
// This half opens on the quiet close-up "bridge" cutaway, then "No
// Hesitation" and "Common Ground" — placed after the fan-art gallery
// rather than running straight on from Part 1.
//
// FRAME_COUNT/FRAME_FPS below reflect what `fps=30` extraction actually
// produced (99 frames covering ~3.3s) from this part's own master, split
// from the once-deduplicated, twice-trimmed 367-frame master at the same
// point Part 1 ends (8.9333s in). CLIP_DURATION is derived from the frame
// count so progress -> frame-index math stays exact.

export const FRAME_COUNT = 99; // native 30fps, part 2 of 2, libwebp q:v 95
export const FRAME_FPS = 30;
export const CLIP_DURATION = FRAME_COUNT / FRAME_FPS; // ~3.3s

function toProgress(t: number): number {
  return Math.min(1, Math.max(0, t / CLIP_DURATION));
}

export interface RunBeat {
  id: string;
  /** Empty for the silent "bridge" cutaway — no caption is rendered for it. */
  title: string;
  line: string;
  startSeconds: number;
  endSeconds: number;
  startProgress: number;
  endProgress: number;
}

const RAW_BEATS: Omit<RunBeat, "startProgress" | "endProgress">[] = [
  {
    id: "bridge",
    title: "",
    line: "",
    startSeconds: 0,
    endSeconds: 0.63667,
  },
  {
    id: "the-break",
    title: "NO HESITATION",
    line: "Shattered glass, raw static, a fist through the moment — too fast to second-guess.",
    startSeconds: 0.63667,
    endSeconds: 2.23333,
  },
  {
    id: "common-ground",
    title: "COMMON GROUND",
    line: "Out of the wreckage, two rival lightning trails reach for the same hand.",
    startSeconds: 2.23333,
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
