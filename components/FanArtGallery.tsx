"use client";

import FlyingGallery, { type FlyingGalleryImage } from "@/components/scroll/FlyingGallery";
import MixedHeadline from "@/components/scroll/MixedHeadline";
import ScrambleReveal from "@/components/scroll/ScrambleReveal";

// Three lanes, round-robin distributed across a flat 19-image list so each
// row mixes wide action shots, portraits, and macro detail rather than
// clustering by type. Each row alternates scroll direction and runs at a
// slightly different speed (see FlyingGallery's secondsPerImage) so the
// wall reads as independent lanes drifting past each other, not one row
// tiled three times.
const ROW_1: FlyingGalleryImage[] = [
  { src: "/images/flash-gallery-1.webp", alt: "Fan art of The Flash sprinting through a rain-lit city street at night", caption: "City Nightrun" },
  { src: "/images/flash-gallery-4.webp", alt: "Abstract fan art of a red and gold speed-force vortex", caption: "Speed Force Vortex" },
  { src: "/images/flash-transition-1.webp", alt: "Abstract fan art of red and gold desert speed lightning", caption: "Desert Speed" },
  { src: "/images/flash-gallery-subway.webp", alt: "Fan art of The Flash blurring through a subway tunnel", caption: "Subway Speed" },
  { src: "/images/flash-gallery-fist.webp", alt: "Macro fan art of a lightning-charged gloved fist", caption: "Lightning Fist" },
  { src: "/images/flash-gallery-storm.webp", alt: "Fan art of The Flash running through a desert lightning storm", caption: "Storm Chase" },
  { src: "/images/flash-gallery-dawn.webp", alt: "Fan art of The Flash running toward camera through golden dawn light", caption: "Dawn Run" },
];

const ROW_2: FlyingGalleryImage[] = [
  { src: "/images/flash-gallery-2.webp", alt: "Fan art of two speedsters facing off, red and blue lightning arcing between them", caption: "The Standoff" },
  { src: "/images/flash-gallery-5.webp", alt: "Full-body fan art suit study of The Flash on a rooftop at dusk", caption: "Suit Study" },
  { src: "/images/flash-transition-2.webp", alt: "Abstract fan art of a cyan-blue lightning impact", caption: "The Impact" },
  { src: "/images/flash-gallery-alley.webp", alt: "Fan art of The Flash crouched in a rain-soaked alley at night", caption: "Rain-Soaked Alley" },
  { src: "/images/flash-gallery-bridge.webp", alt: "Fan art of two speedsters running side by side across a bridge at dusk", caption: "The Bridge Run" },
  { src: "/images/flash-gallery-emblem.webp", alt: "Macro fan art of The Flash's lightning-bolt chest emblem", caption: "Emblem Macro" },
];

const ROW_3: FlyingGalleryImage[] = [
  { src: "/images/flash-gallery-3.webp", alt: "Close-up fan art portrait of The Flash's mask", caption: "Hero Portrait" },
  { src: "/images/flash-gallery-6.webp", alt: "Fan art of The Flash leaping through urban wreckage at night", caption: "Through The Wreckage" },
  { src: "/images/flash-gallery-rooftop.webp", alt: "Fan art of The Flash silhouetted on a rooftop ledge at sunset", caption: "Rooftop Silhouette" },
  { src: "/images/flash-gallery-comic.webp", alt: "Stylized comic-book fan art of The Flash at the center of a speed burst", caption: "Comic Burst" },
  { src: "/images/flash-gallery-museum.webp", alt: "Fan art of The Flash racing past museum columns in daylight", caption: "Museum Chase" },
  { src: "/images/flash-gallery-hands.webp", alt: "Fan art of two gloved hands, red and blue, reaching toward each other", caption: "Common Ground" },
];

// Full-bleed fan-art gallery wall, adapted from the eco-power sibling
// project's FlyingGallery pattern — three stacked lanes drifting
// horizontally in alternating directions rather than a static grid, so a
// large image set reads as a living wall instead of a long scroll of
// cards. Captions are hidden until hover/focus (see FlyingGallery) so the
// wall itself stays visually clean.
export default function FanArtGallery() {
  return (
    <section aria-label="Fan art gallery" className="relative w-full overflow-hidden bg-black py-[100px] md:py-[150px]">
      <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-5 px-6 text-center">
        <ScrambleReveal as="span" className="section-kicker">
          KRYNTIX STUDIO — FAN ART
        </ScrambleReveal>
        <MixedHeadline
          as="h2"
          className="display text-glow max-w-2xl text-[clamp(1.7rem,4.6vw,2.8rem)] text-[var(--white)]"
          segments={[{ text: "A GALLERY BUILT AT" }, { text: "LIGHTNING SPEED", accent: true }]}
        />
        <p className="body-muted max-w-xl text-[1.05rem]">Every still, hand-crafted. Hover any frame to name the shot.</p>
      </div>

      <div className="mt-14 flex flex-col gap-5">
        <FlyingGallery images={ROW_1} direction="left" secondsPerImage={6} label="Fan art, row 1" />
        <FlyingGallery images={ROW_2} direction="right" secondsPerImage={7} label="Fan art, row 2" />
        <FlyingGallery images={ROW_3} direction="left" secondsPerImage={5.5} label="Fan art, row 3" />
      </div>
    </section>
  );
}
