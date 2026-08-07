// Camera-viewfinder chrome for the scrub-video sections: corner brackets plus
// a live mono readout (REC, scrubbed timecode, current scene) that frames the
// footage like it's being shot. Purely presentational + aria-hidden; the real
// scene captions live in a separate, higher layer. Insets clear the fixed nav
// at the top.
interface ViewfinderHUDProps {
  /** 0-1 scrub progress. */
  progress: number;
  /** Clip length in seconds — timecode is progress * this. */
  durationSeconds: number;
  sceneLabel: string;
  sceneIndex: number;
  sceneTotal: number;
  fps?: number;
}

function timecode(sec: number) {
  const s = Math.max(0, sec);
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${String(r).padStart(2, "0")}`;
}

const bracketBase = "pointer-events-none absolute h-6 w-6 border-[var(--accent-2)]/40";

export default function ViewfinderHUD({
  progress,
  durationSeconds,
  sceneLabel,
  sceneIndex,
  sceneTotal,
  fps = 30,
}: ViewfinderHUDProps) {
  const current = timecode(progress * durationSeconds);
  const total = timecode(durationSeconds);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10 font-[family-name:var(--font-jetbrains)]"
    >
      {/* Corner brackets, inset to clear the fixed nav up top. */}
      <span className={`${bracketBase} left-5 top-[72px] border-l border-t`} />
      <span className={`${bracketBase} right-5 top-[72px] border-r border-t`} />
      <span className={`${bracketBase} bottom-16 left-5 border-b border-l`} />
      <span className={`${bracketBase} bottom-16 right-5 border-b border-r`} />

      {/* REC indicator. */}
      <div className="absolute left-6 top-[84px] flex items-center gap-2 text-[0.6rem] uppercase tracking-[0.2em] text-[var(--muted-strong)]">
        <span className="rec-pulse inline-block h-2 w-2 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]" />
        REC
      </div>

      {/* Timecode + fps. */}
      <div className="absolute right-6 top-[84px] text-right text-[0.6rem] uppercase tracking-[0.18em] text-[var(--muted-strong)]">
        {current} / {total} · {fps}FPS
      </div>

      {/* Current scene. */}
      <div className="absolute bottom-[76px] left-6 text-[0.6rem] uppercase tracking-[0.2em] text-[var(--muted-strong)]">
        <span className="text-[var(--accent-2)]">
          SCENE {String(sceneIndex + 1).padStart(2, "0")}/{String(sceneTotal).padStart(2, "0")}
        </span>{" "}
        · {sceneLabel}
      </div>
    </div>
  );
}
