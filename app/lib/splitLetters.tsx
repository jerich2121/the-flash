"use client";

const ACCENT: [number, number, number] = [225, 29, 46]; // Flash crimson
const WHITE: [number, number, number] = [245, 239, 232];
const ACCENT_2: [number, number, number] = [255, 224, 102]; // speed-force yellow-white

export function lerpColor(a: [number, number, number], b: [number, number, number], t: number): string {
  const r = Math.round(a[0] + (b[0] - a[0]) * t);
  const g = Math.round(a[1] + (b[1] - a[1]) * t);
  const bl = Math.round(a[2] + (b[2] - a[2]) * t);
  return `rgb(${r}, ${g}, ${bl})`;
}

/** Position `t` (0..1) along a crimson -> white -> speed-force-yellow
 *  gradient — the same two brand accents used across the site, reused here
 *  so every letter-reveal treatment reads as one consistent effect. */
export function gradientColorAt(t: number): string {
  return t <= 0.5 ? lerpColor(ACCENT, WHITE, t / 0.5) : lerpColor(WHITE, ACCENT_2, (t - 0.5) / 0.5);
}

/**
 * Splits text into one <span> per letter (grouped into per-word,
 * non-breaking spans so wrapping still happens at word boundaries), so each
 * letter can be targeted individually by a scroll-driven reveal.
 */
export function SplitLetters({
  text,
  letterClassName,
  colorAt,
}: {
  text: string;
  letterClassName: string;
  colorAt?: (t: number) => string;
}) {
  const words = text.split(" ");
  const totalLetters = text.replace(/\s/g, "").length;
  // Precomputed, not accumulated during render — each word's starting
  // global-letter-index is derived purely from the lengths of the words
  // before it, so no mutable counter gets reassigned while rendering.
  const wordStartIndex = words.reduce<number[]>((acc, word, i) => {
    acc.push(i === 0 ? 0 : acc[i - 1] + words[i - 1].length);
    return acc;
  }, []);

  return (
    <>
      {words.flatMap((word, wi) => {
        const wordSpan = (
          <span key={`w-${wi}`} className="inline-block whitespace-nowrap">
            {word.split("").map((ch, ci) => {
              const globalIndex = wordStartIndex[wi] + ci;
              const t = totalLetters > 1 ? globalIndex / (totalLetters - 1) : 0;
              return (
                <span
                  key={ci}
                  className={`${letterClassName} inline-block`}
                  style={colorAt ? { color: colorAt(t) } : undefined}
                >
                  {ch}
                </span>
              );
            })}
          </span>
        );
        // A plain sibling span, not nested inside the nowrap word box —
        // whitespace at the end of a nowrap inline-block gets trimmed to
        // zero width by the browser, which silently swallowed the space
        // when it lived inside the word span instead of between them.
        if (wi === words.length - 1) return [wordSpan];
        return [wordSpan, <span key={`s-${wi}`}> </span>];
      })}
    </>
  );
}
