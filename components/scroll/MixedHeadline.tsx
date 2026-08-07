"use client";

import RevealText from "@/components/scroll/RevealText";
import ZoomFlowChars from "@/components/scroll/ZoomFlowChars";

type TextTag = "h1" | "h2" | "h3" | "p";

export interface MixedHeadlineSegment {
  text: string;
  /** Emphasis-word treatment — fills the segment with the site's crimson ->
   * gold -> speed-force-yellow gradient (see .gradient-text in globals.css)
   * instead of solid white. */
  accent?: boolean;
}

interface MixedHeadlineBaseProps {
  as?: TextTag;
  segments: MixedHeadlineSegment[];
  /** Applied to the wrapping element — base type size/weight/tracking etc.
   * Accent segments layer the gradient fill on top. */
  className?: string;
  accentClassName?: string;
}

interface RevealModeProps extends MixedHeadlineBaseProps {
  mode?: "reveal";
  delay?: number;
  start?: string;
}

interface ScrubModeProps extends MixedHeadlineBaseProps {
  mode: "scrub";
  /** 0-1 scrub progress from the parent section's ScrollTrigger. */
  progress: number;
  startAt?: number;
  endAt?: number;
}

type MixedHeadlineProps = RevealModeProps | ScrubModeProps;

// Pure helper (no in-render mutation) — slices [startAt, endAt] proportionally
// by each segment's character count, running-sum style.
function segmentWindows(
  segments: MixedHeadlineSegment[],
  startAt: number,
  endAt: number
): { start: number; end: number }[] {
  const totalChars = segments.reduce((n, s) => n + s.text.length, 0) || 1;
  const windows: { start: number; end: number }[] = [];
  let charsSoFar = 0;
  for (const seg of segments) {
    const start = startAt + (endAt - startAt) * (charsSoFar / totalChars);
    charsSoFar += seg.text.length;
    const end = startAt + (endAt - startAt) * (charsSoFar / totalChars);
    windows.push({ start, end });
  }
  return windows;
}

// Composes RevealText + ZoomFlowChars (adapted from the eco-power sibling
// project's MixedHeadline) — emphasis words within a headline get their own
// reveal-component instance rather than one split run of mixed spans, so
// this reuses those two proven primitives verbatim instead of inventing
// per-character styling logic. Use this for section headlines generally
// instead of a bare <h2>.
export default function MixedHeadline(props: MixedHeadlineProps) {
  const { as = "h2", segments, className = "", accentClassName = "" } = props;
  const Component = as as React.ElementType;

  // gradient-text (see globals.css) forces every descendant char/word span
  // GSAP's SplitText creates to re-inherit the clipped-gradient properties —
  // required because promoting a descendant to its own GPU compositing
  // layer (which SplitText's per-char inline `transform` always does, even
  // at rest) otherwise breaks Chromium's background-clip:text painting.
  // Same documented fix the eco-power sibling project verified for its own
  // gradient headlines.
  const accentClasses = `gradient-text bg-gradient-to-r from-[var(--accent)] via-[var(--gold)] to-[var(--accent-2)] bg-clip-text text-transparent [text-shadow:none] ${accentClassName}`;

  if (props.mode === "scrub") {
    const { progress, startAt = 0, endAt = 1 } = props;
    const windows = segmentWindows(segments, startAt, endAt);

    return (
      <Component className={className}>
        {segments.map((seg, i) => (
          <ZoomFlowChars
            key={i}
            as="span"
            progress={progress}
            startAt={windows[i].start}
            endAt={windows[i].end}
            className={seg.accent ? accentClasses : ""}
          >
            {i < segments.length - 1 ? `${seg.text} ` : seg.text}
          </ZoomFlowChars>
        ))}
      </Component>
    );
  }

  const { delay = 0, start = "top 85%" } = props;

  return (
    <Component className={className}>
      {segments.map((seg, i) => (
        <RevealText
          key={i}
          as="span"
          split="chars"
          delay={delay + i * 0.08}
          start={start}
          className={seg.accent ? accentClasses : ""}
        >
          {i < segments.length - 1 ? `${seg.text} ` : seg.text}
        </RevealText>
      ))}
    </Component>
  );
}
