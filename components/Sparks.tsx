import type { CSSProperties } from "react";

// Floating speed-force embers for the text panels. A fixed, hand-picked set
// (not Math.random) so server and client render identically — random values
// would cause a React hydration mismatch. Purely decorative, so the wrapper
// is aria-hidden and pointer-events-none.
interface Spark {
  left: string;
  size: number;
  dur: number;
  delay: number;
  rise: number;
  gold?: boolean;
}

const SPARKS: Spark[] = [
  { left: "6%", size: 3, dur: 7.5, delay: 0, rise: 120 },
  { left: "14%", size: 2, dur: 9, delay: 1.6, rise: 90, gold: true },
  { left: "23%", size: 4, dur: 8, delay: 3.1, rise: 150 },
  { left: "32%", size: 2, dur: 10, delay: 0.8, rise: 110, gold: true },
  { left: "41%", size: 3, dur: 7, delay: 2.4, rise: 130 },
  { left: "52%", size: 2, dur: 9.5, delay: 4.2, rise: 100 },
  { left: "61%", size: 4, dur: 8.5, delay: 1.1, rise: 160, gold: true },
  { left: "70%", size: 3, dur: 7.8, delay: 3.6, rise: 120 },
  { left: "79%", size: 2, dur: 10.5, delay: 0.4, rise: 95, gold: true },
  { left: "88%", size: 3, dur: 8.2, delay: 2.9, rise: 140 },
  { left: "95%", size: 2, dur: 9.2, delay: 5, rise: 105 },
];

export default function Sparks({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {SPARKS.map((s, i) => (
        <span
          key={i}
          className="spark"
          style={
            {
              left: s.left,
              bottom: "-8px",
              width: s.size,
              height: s.size,
              background: `radial-gradient(circle, ${
                s.gold ? "var(--gold)" : "var(--accent-2)"
              }, transparent 70%)`,
              "--spark-dur": `${s.dur}s`,
              "--spark-delay": `${s.delay}s`,
              "--spark-rise": `${s.rise}px`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
