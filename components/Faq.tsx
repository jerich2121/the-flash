"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/app/lib/gsap";
import MixedHeadline from "@/components/scroll/MixedHeadline";
import ScrambleReveal from "@/components/scroll/ScrambleReveal";

// Honest, on-brand answers about what this site actually is and how it's built
// — adds scannable, structured content to a site that's otherwise all motion.
const FAQS = [
  {
    q: "Is this an official Flash site?",
    a: "No — it's an independent fan project by Kryntix Studio. It isn't affiliated with, endorsed by, or produced by Warner Bros., DC, or DC Studios, and all Flash-related trademarks belong to their respective owners.",
  },
  {
    q: "How does the scroll-scrubbing work?",
    a: "Each “video” is really a sequence of still frames drawn onto a canvas. As you scroll, a pinned GSAP ScrollTrigger maps your scroll position to a frame — so you're literally scrubbing the footage with the scroll bar, at a smooth 30fps.",
  },
  {
    q: "What's it built with?",
    a: "Next.js and React, animated with GSAP + ScrollTrigger, smoothed by Lenis, and styled with Tailwind. Every reveal, pin, stacked panel, and parallax layer is hand-built — no page builder.",
  },
  {
    q: "Where can I see more from Kryntix Studio?",
    a: "At kryntixstudio.vercel.app, and on Instagram @kryntixstudio — where this and the other fan-site experiments live.",
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const openRef = useRef<number | null>(0);
  const panelsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Initial state: the first answer open, the rest collapsed — set instantly.
  useEffect(() => {
    panelsRef.current.forEach((panel, i) => {
      if (panel) gsap.set(panel, { height: i === openRef.current ? "auto" : 0 });
    });
  }, []);

  function toggle(i: number) {
    const prev = openRef.current;
    const animate = (idx: number, open: boolean) => {
      const panel = panelsRef.current[idx];
      if (panel) {
        gsap.to(panel, { height: open ? "auto" : 0, duration: 0.45, ease: "power2.inOut" });
      }
    };

    if (prev === i) {
      animate(i, false);
      openRef.current = null;
      setOpenIndex(null);
    } else {
      if (prev !== null) animate(prev, false);
      animate(i, true);
      openRef.current = i;
      setOpenIndex(i);
    }
  }

  return (
    <section
      id="faq"
      aria-label="Frequently asked questions"
      className="relative w-full bg-black px-6 py-[100px] md:px-12 md:py-[150px]"
    >
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-col items-center gap-5 text-center">
          <ScrambleReveal as="span" className="section-kicker">
            KRYNTIX STUDIO — THE BUILD
          </ScrambleReveal>
          <MixedHeadline
            as="h2"
            className="display text-glow text-[clamp(1.7rem,4.6vw,2.8rem)] text-[var(--white)]"
            segments={[{ text: "UNDER" }, { text: "THE HOOD", accent: true }]}
          />
        </div>

        <div className="mt-12 border-t border-[var(--surface-border)]">
          {FAQS.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={item.q} className="border-b border-[var(--surface-border)]">
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left"
                >
                  <span className="display text-[clamp(1.05rem,2.6vw,1.45rem)] text-[var(--white)] transition-colors">
                    {item.q}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-lg leading-none transition-[transform,border-color,color] duration-300 ${
                      isOpen
                        ? "rotate-45 border-[var(--accent-2)] text-[var(--accent-2)]"
                        : "border-[var(--surface-border-glow)] text-[var(--muted-strong)]"
                    }`}
                  >
                    +
                  </span>
                </button>
                <div
                  ref={(el) => {
                    panelsRef.current[i] = el;
                  }}
                  className="overflow-hidden"
                  style={{ height: 0 }}
                >
                  <p className="body-muted max-w-2xl pb-6 text-[1.02rem] leading-relaxed">
                    {item.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
