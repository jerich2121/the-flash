"use client";

import { useEffect, useRef } from "react";
import { SplitLetters, gradientColorAt } from "@/app/lib/splitLetters";

const HEADING = "BUILT FOR THE SCROLL BAR, NOT THE PLAY BUTTON";

export default function CTA() {
  const headingRef = useRef<HTMLHeadingElement>(null);

  // A one-shot letter cascade on scroll-into-view, rather than the
  // scrub-tied per-frame reveal Hero's chrome uses — this section sits
  // below the pinned stage on normal document scroll, so a standard
  // ScrollTrigger-triggered stagger (not a progress-store subscription) is
  // the right tool here.
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const heading = headingRef.current;
    if (!heading) return;
    const letters = Array.from(heading.querySelectorAll<HTMLElement>(".letter-cta"));
    if (letters.length === 0) return;

    if (prefersReduced) {
      letters.forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      return;
    }

    let ctx: { revert: () => void } | undefined;
    import("@/app/lib/gsap").then(({ gsap }) => {
      ctx = gsap.context(() => {
        gsap.fromTo(
          letters,
          { opacity: 0.06, y: 14 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.014,
            ease: "power2.out",
            scrollTrigger: {
              trigger: heading,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    });
    return () => ctx?.revert();
  }, []);

  return (
    <section
      id="about"
      className="relative flex flex-col items-center gap-10 overflow-hidden px-6 py-[100px] text-center md:px-12 md:py-[160px]"
    >
      <div
        className="bg-fade-in pointer-events-none absolute inset-0"
        data-fade-to="1"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 20%, rgba(225,29,46,0.1), transparent 60%), radial-gradient(ellipse 60% 50% at 80% 80%, rgba(255,224,102,0.06), transparent 60%)",
        }}
        aria-hidden="true"
      />

      <div className="reveal-up relative flex max-w-3xl flex-col items-center gap-6">
        <span className="section-kicker">KRYNTIX STUDIO — ABOUT THIS EDIT</span>
        <h2
          ref={headingRef}
          className="display text-glow text-[clamp(1.9rem,5.4vw,3.4rem)] text-[var(--white)]"
        >
          <SplitLetters text={HEADING} letterClassName="letter-cta" colorAt={gradientColorAt} />
        </h2>
        <p className="body-muted max-w-xl text-[1.05rem]">
          This site is a fan-made craft piece, not an official release — a title-card
          reveal treated the way Kryntix Studio treats every clip in this series: cut
          tight, color-graded, and re-timed to a scroll bar instead of a play button.
          No plot claims, no leaked footage — just an edit.
        </p>
      </div>

      <div className="reveal-up relative flex flex-col items-center gap-4 sm:flex-row">
        <a
          href="https://kryntixstudio.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="secondary rounded-full px-8 py-3.5 text-sm tracking-[0.08em] text-black transition-transform hover:scale-[1.03]"
          style={{
            background: "linear-gradient(120deg, var(--accent), var(--gold))",
            boxShadow: "0 20px 40px -18px rgba(225,29,46,0.55)",
          }}
        >
          SEE THE FULL STUDIO
        </a>
        <a
          href="https://instagram.com/kryntixstudio"
          target="_blank"
          rel="noopener noreferrer"
          className="mono card-surface rounded-full px-8 py-3.5 text-sm tracking-[0.08em] text-[var(--white)] transition-transform hover:scale-[1.03]"
        >
          @kryntixstudio ON INSTAGRAM
        </a>
      </div>
    </section>
  );
}
