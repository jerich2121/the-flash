"use client";

import MixedHeadline from "@/components/scroll/MixedHeadline";
import RevealText from "@/components/scroll/RevealText";
import ScrambleReveal from "@/components/scroll/ScrambleReveal";

// Static, normal-document-flow section — same intent as eco-power's sibling
// HeroTransition.tsx: real prose about what this site actually is, placed
// after the fan-art gallery so the site reads as considered and built, not
// just a stack of scroll-jacked videos back to back. The images that used
// to live in this section's own 2-up grid now live in FanArtGallery's
// full-bleed marquee, which sits directly above this one — so this section
// is text-only, closing out the tribute with the disclaimer.
export default function HeroTransition() {
  return (
    <section
      aria-label="About this fan site"
      className="relative w-full overflow-hidden px-6 py-[100px] md:px-12 md:py-[140px]"
    >
      <div
        className="bg-fade-in pointer-events-none absolute inset-0"
        data-fade-to="1"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 10% 10%, rgba(255,224,102,0.05), transparent 60%), radial-gradient(ellipse 60% 50% at 90% 90%, rgba(225,29,46,0.07), transparent 60%)",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto flex max-w-5xl flex-col gap-12">
        <div className="reveal-up flex flex-col gap-5">
          <ScrambleReveal as="span" className="section-kicker">
            KRYNTIX STUDIO — FOR THE FANS
          </ScrambleReveal>
          <MixedHeadline
            as="h2"
            className="display text-glow max-w-2xl text-[clamp(1.7rem,4.6vw,2.8rem)] text-[var(--white)]"
            segments={[
              { text: "A TRIBUTE TO" },
              { text: "THE FASTEST MAN ALIVE", accent: true },
            ]}
          />
          <RevealText
            as="p"
            split="words"
            className="body-muted max-w-2xl text-[1.05rem]"
          >
            Kryntix Studio built this site out of pure love for the Scarlet Speedster —
            the lightning, the heart, the guy who&rsquo;s always running out of time to save
            everyone but himself. Every reveal, every run, every still in the gallery
            above is one tribute, told in scroll instead of a single video.
          </RevealText>
          <p className="body-muted max-w-2xl text-[1.05rem]">
            This is an independent fan project celebrating The Flash. It isn&rsquo;t
            affiliated with, endorsed by, or produced by Warner Bros., DC, or any
            official rights holder — just fans, for fans.
          </p>
        </div>
      </div>
    </section>
  );
}
