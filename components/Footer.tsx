"use client";

import { scrollToSection, scrollToTop } from "@/app/lib/lenisStore";
import KryntixMark from "./KryntixMark";

const HASHTAGS = ["#theflash", "#fanfilm", "#webdesigner", "#webdev", "#kryntixstudio"];

const EXPLORE = [
  { label: "The Run", id: "the-run" },
  { label: "Gallery", id: "gallery" },
  { label: "Breakdown", id: "breakdown" },
  { label: "About", id: "about" },
] as const;

export default function Footer() {
  return (
    <footer
      className="reveal-up relative overflow-hidden px-6 py-20 md:px-12"
      style={{ background: "#000" }}
    >
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(225,29,46,0.45), rgba(255,224,102,0.35), transparent)",
        }}
        aria-hidden="true"
      />
      <div
        className="glow-drift pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 15% 0%, rgba(225,29,46,0.06), transparent 60%), radial-gradient(ellipse 50% 40% at 100% 100%, rgba(255,224,102,0.05), transparent 60%)",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-14">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <button
              type="button"
              onClick={scrollToTop}
              className="group flex items-center gap-2.5 self-start"
              aria-label="Kryntix Studio — back to top"
            >
              <KryntixMark className="h-7 w-auto transition-transform duration-300 group-hover:scale-110" />
              <span className="flex items-baseline gap-1.5 leading-none">
                <span className="display text-xl tracking-[0.06em] text-[var(--white)]">
                  KRYNTIX
                </span>
                <span className="mono text-[0.66rem] uppercase tracking-[0.34em] text-[var(--muted-strong)]">
                  Studio
                </span>
              </span>
            </button>
            <p className="body-muted max-w-sm text-sm">
              Part of the Kryntix fan-site series — cinematic scroll experiences that
              show what a browser and a scroll bar can really do.
            </p>
          </div>

          {/* Explore */}
          <div className="flex flex-col gap-3.5">
            <span className="mono text-[0.66rem] uppercase tracking-[0.28em] text-[var(--accent-2)]">
              Explore
            </span>
            {EXPLORE.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => scrollToSection(l.id)}
                className="mono w-fit text-left text-sm tracking-[0.06em] text-[var(--muted-strong)] transition-colors hover:text-[var(--white)]"
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Connect */}
          <div className="flex flex-col gap-3.5">
            <span className="mono text-[0.66rem] uppercase tracking-[0.28em] text-[var(--accent-2)]">
              Connect
            </span>
            <a
              href="https://kryntixstudio.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="mono w-fit text-sm tracking-[0.06em] text-[var(--muted-strong)] underline-offset-4 transition-colors hover:text-[var(--white)] hover:underline"
            >
              kryntixstudio.vercel.app
            </a>
            <a
              href="https://instagram.com/kryntixstudio"
              target="_blank"
              rel="noopener noreferrer"
              className="mono w-fit text-sm tracking-[0.06em] text-[var(--muted-strong)] underline-offset-4 transition-colors hover:text-[var(--white)] hover:underline"
            >
              @kryntixstudio on Instagram
            </a>
          </div>
        </div>

        {/* Hashtags + back to top */}
        <div className="flex flex-col gap-6 border-t border-[var(--surface-border)] pt-8 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {HASHTAGS.map((tag) => (
              <span
                key={tag}
                className="mono rounded-full border border-[var(--surface-border)] px-3 py-1 text-[0.68rem] text-[var(--muted-strong)]"
              >
                {tag}
              </span>
            ))}
          </div>
          <button
            type="button"
            onClick={scrollToTop}
            className="mono group inline-flex w-fit items-center gap-2 rounded-full border border-[var(--surface-border-glow)] px-4 py-2 text-[0.68rem] uppercase tracking-[0.18em] text-[var(--accent-2)] transition-colors hover:border-[var(--accent-2)] hover:bg-[rgba(255,224,102,0.06)]"
          >
            Back to top
            <span className="transition-transform duration-200 group-hover:-translate-y-0.5">↑</span>
          </button>
        </div>

        <div className="flex flex-col gap-1 text-[0.7rem] text-[var(--muted)]">
          <span className="mono">
            © {new Date().getFullYear()} KRYNTIX STUDIO — FAN PROJECT, NOT AFFILIATED WITH WARNER BROS., DC, OR DC STUDIOS
          </span>
          <span className="mono">
            Made for non-commercial fan enjoyment. All Flash-related trademarks belong to their respective owners.
          </span>
        </div>
      </div>
    </footer>
  );
}
