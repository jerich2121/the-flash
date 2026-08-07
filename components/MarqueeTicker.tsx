// Full-bleed looping text band — a slim strip of brand phrases scrolling
// sideways between sections. Purely decorative (aria-hidden), so it's not
// announced to assistive tech; the same phrases already appear as real
// headings elsewhere. Two identical halves inside a -50% CSS loop give a
// seamless scroll with no JS. Respects reduced-motion via the global rule
// that freezes animations.
const ITEMS = [
  "THE FLASH",
  "FASTER THAN THE MOMENT",
  "KRYNTIX STUDIO",
  "SCARLET SPEEDSTER",
] as const;

function Half() {
  return (
    <div className="flex shrink-0 items-center gap-8 pr-8 md:gap-12 md:pr-12">
      {ITEMS.map((item, i) => (
        <div key={i} className="flex items-center gap-8 md:gap-12">
          <span
            className={
              i % 2 === 0
                ? "display title-gradient text-[clamp(1.2rem,3.8vw,2.2rem)] tracking-[0.12em]"
                : "display text-[clamp(1.2rem,3.8vw,2.2rem)] tracking-[0.12em] text-[var(--white)]"
            }
          >
            {item}
          </span>
          <span
            aria-hidden="true"
            className="text-[clamp(0.9rem,2.6vw,1.4rem)] text-[var(--accent)]"
          >
            ✦
          </span>
        </div>
      ))}
    </div>
  );
}

export default function MarqueeTicker() {
  return (
    <div
      aria-hidden="true"
      className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden border-y border-[var(--surface-border)] bg-black py-5 md:py-6"
    >
      <div className="marquee-track flex w-max">
        <Half />
        <Half />
      </div>
    </div>
  );
}
