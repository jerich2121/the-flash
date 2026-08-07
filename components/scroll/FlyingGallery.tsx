"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "@/app/lib/gsap";
import TiltCard from "@/components/scroll/TiltCard";

export interface FlyingGalleryImage {
  src: string;
  alt: string;
  caption: string;
}

interface FlyingGalleryProps {
  images: FlyingGalleryImage[];
  /** Which way this row's track drifts. Rows alternate directions in
   * GalleryWall so the wall reads as many independent lanes, not one row
   * repeated. */
  direction?: "left" | "right";
  /** Seconds per image of loop duration — lower is faster. Varying this
   * slightly per row (see GalleryWall) keeps the lanes from all crossing
   * the same point in sync, which would otherwise read as one row. */
  secondsPerImage?: number;
  /** aria-label for this row's list — distinct per row when several rows
   * share a page, so assistive tech doesn't announce three identically
   * named lists. */
  label?: string;
  /** yPercent scroll-parallax drift for this row (picked up by
   * MotionOrchestrator's [data-parallax] handler). Vary it per row for a
   * layered depth effect. Applied to the inner track container, since the
   * full-bleed outer wrapper already carries a centering transform. */
  parallax?: number;
}

// Full-bleed continuous horizontal image marquee, ported from the
// eco-power sibling project's FlyingGallery and extended with a
// direction prop (for stacking multiple lanes into a wall) and a
// hover-reveal caption (image fills the whole card; the caption slides up
// over it on hover/focus instead of sitting permanently in its own strip).
// A single doubled-track row loops independent of scroll position — one
// lane only, so cards never collide or overlap mid-scroll. Breaks out of
// its parent's centered container to span the true viewport width via the
// standard `left-1/2 w-screen -translate-x-1/2` technique.
export default function FlyingGallery({
  images,
  direction = "left",
  secondsPerImage = 6,
  label = "Fan art images",
  parallax,
}: FlyingGalleryProps) {
  const trackContainerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [reducedMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    if (reducedMotion) return;
    const track = trackRef.current;
    const container = trackContainerRef.current;
    if (!track || !container) return;

    const tween =
      direction === "left"
        ? gsap.to(track, { xPercent: -50, ease: "none", duration: images.length * secondsPerImage, repeat: -1 })
        : gsap.fromTo(
            track,
            { xPercent: -50 },
            { xPercent: 0, ease: "none", duration: images.length * secondsPerImage, repeat: -1 }
          );
    const pause = () => tween.pause();
    const resume = () => tween.play();
    container.addEventListener("mouseenter", pause);
    container.addEventListener("mouseleave", resume);
    container.addEventListener("focusin", pause);
    container.addEventListener("focusout", resume);

    return () => {
      tween.kill();
      container.removeEventListener("mouseenter", pause);
      container.removeEventListener("mouseleave", resume);
      container.removeEventListener("focusin", pause);
      container.removeEventListener("focusout", resume);
    };
  }, [reducedMotion, images.length, direction, secondsPerImage]);

  const renderCard = (img: FlyingGalleryImage, key: string, hidden: boolean) => (
    <div
      key={key}
      role={hidden ? undefined : "listitem"}
      aria-hidden={hidden || undefined}
      className="group w-64 shrink-0 sm:w-72 md:w-80"
    >
      <TiltCard className="overflow-hidden">
        <div className="relative aspect-[3/2] w-full">
          <Image
            src={img.src}
            alt={img.alt}
            fill
            sizes="(min-width: 768px) 320px, (min-width: 640px) 288px, 256px"
            className="object-cover transition-transform duration-500 group-hover:scale-105 group-focus-within:scale-105"
          />
          <div
            className="gallery-caption pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-black/85 via-black/10 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100"
            aria-hidden="true"
          >
            <span className="gallery-caption-label mono block translate-y-2 text-[0.68rem] uppercase tracking-[0.2em] text-[var(--white)] transition-transform duration-300 group-hover:translate-y-0 group-focus-within:translate-y-0">
              {img.caption}
            </span>
          </div>
        </div>
      </TiltCard>
    </div>
  );

  return (
    <div
      className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]"
    >
      <div
        ref={trackContainerRef}
        role="list"
        aria-label={label}
        data-parallax={parallax ? String(parallax) : undefined}
        className={
          reducedMotion
            ? "relative z-10 flex gap-5 overflow-x-auto px-6 pb-2 snap-x snap-mandatory [-webkit-overflow-scrolling:touch]"
            : "relative z-10 overflow-hidden"
        }
      >
        <div ref={trackRef} className={reducedMotion ? "contents" : "flex w-max gap-5"}>
          {(reducedMotion ? images : [...images, ...images]).map((img, i) =>
            renderCard(img, `${img.src}-${i}`, !reducedMotion && i >= images.length)
          )}
        </div>
      </div>
    </div>
  );
}
