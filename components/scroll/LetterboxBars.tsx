// Cinematic letterbox bars for the scrub-video sections — black widescreen
// bars that slide in from the top and bottom edges while the clip is being
// scrubbed and retract at the very start/end, so entering a video section
// feels like cutting to footage. Purely presentational + aria-hidden.
interface LetterboxBarsProps {
  /** 0-1 scrub progress; bars are open through the middle of the scrub. */
  progress: number;
}

export default function LetterboxBars({ progress }: LetterboxBarsProps) {
  const open = progress > 0.015 && progress < 0.985;
  const height = open ? "5vh" : "0vh";
  const bar =
    "pointer-events-none absolute inset-x-0 z-[15] bg-black transition-[height] duration-500 ease-out";

  return (
    <>
      <div className={`${bar} top-0`} style={{ height }} aria-hidden="true" />
      <div className={`${bar} bottom-0`} style={{ height }} aria-hidden="true" />
    </>
  );
}
