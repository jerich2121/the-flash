import KryntixMark from "./KryntixMark";

const HASHTAGS = [
  "#theflash",
  "#fanfilm",
  "#webdesigner",
  "#webdev",
  "#kryntixstudio",
];

export default function Footer() {
  return (
    <footer
      className="reveal-up relative overflow-hidden px-6 py-16 md:px-12"
      style={{ background: "#000" }}
    >
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(225,29,46,0.45), transparent)",
        }}
        aria-hidden="true"
      />
      {/* Faint ambient glow, low-key echo of the CTA's — keeps the closing
          section from reading as a flat, plain afterthought without
          competing with the CTA's own moment. */}
      <div
        className="glow-drift pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 15% 0%, rgba(225,29,46,0.06), transparent 60%), radial-gradient(ellipse 50% 40% at 100% 100%, rgba(255,224,102,0.05), transparent 60%)",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-10">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-start">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <KryntixMark className="h-7 w-auto" />
              <span className="display text-lg tracking-[0.1em] text-[var(--white)]">
                KRYNTIX STUDIO
              </span>
            </div>
            <p className="body-muted max-w-sm text-sm">
              Part of the Kryntix fan-site series — cinematic scroll experiences that
              show what a browser and a scroll bar can really do.
            </p>
          </div>

          <div className="flex flex-col gap-3 md:items-end">
            <a
              href="https://kryntixstudio.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="mono text-sm text-[var(--accent-2)] underline-offset-4 hover:underline"
            >
              kryntixstudio.vercel.app
            </a>
            <a
              href="https://instagram.com/kryntixstudio"
              target="_blank"
              rel="noopener noreferrer"
              className="mono text-sm text-[var(--muted-strong)] underline-offset-4 hover:text-[var(--accent-2)] hover:underline"
            >
              @kryntixstudio on Instagram
            </a>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 border-t border-[var(--surface-border)] pt-6">
          {HASHTAGS.map((tag) => (
            <span
              key={tag}
              className="mono rounded-full border border-[var(--surface-border)] px-3 py-1 text-[0.68rem] text-[var(--muted-strong)]"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex flex-col gap-1 text-[0.7rem] text-[var(--muted)]">
          <span className="mono">© {new Date().getFullYear()} KRYNTIX STUDIO — FAN PROJECT, NOT AFFILIATED WITH WARNER BROS., DC, OR DC STUDIOS</span>
          <span className="mono">Made for non-commercial fan enjoyment. All Flash-related trademarks belong to their respective owners.</span>
        </div>
      </div>
    </footer>
  );
}
