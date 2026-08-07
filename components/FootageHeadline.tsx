import Sparks from "@/components/Sparks";

// Full-bleed statement band where the run footage still shows *through* the
// giant "THE FLASH" letters (see .footage-text in globals.css) and slowly
// pans/zooms so the type reads like moving footage. The video-vignette darkens
// the edges and Sparks drift behind it for depth. The content block carries
// .velocity-skew, so it leans slightly under fast scroll.
export default function FootageHeadline() {
  return (
    <section
      aria-label="The Flash"
      className="relative w-full overflow-hidden bg-black py-[100px] md:py-[150px]"
    >
      <div className="video-vignette" aria-hidden="true" />
      <Sparks />
      <div className="velocity-skew relative flex flex-col items-center gap-6 px-6 text-center">
        <span className="section-kicker justify-center">KRYNTIX STUDIO — THE LEGEND</span>
        <h2 className="footage-text display text-[clamp(3rem,16vw,11rem)] leading-[0.88] tracking-[0.01em]">
          THE FLASH
        </h2>
        <p className="body-muted max-w-md text-sm md:text-base">
          The fastest man alive — rebuilt one frame at a time.
        </p>
      </div>
    </section>
  );
}
