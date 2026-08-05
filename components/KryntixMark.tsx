// Small inline lightning-bolt mark standing in for the Kryntix Studio
// wordmark logo — no raster logo asset was supplied for this project (the
// sibling sites reference a /kryntix-logo.png that wasn't part of this
// build's source material), so this renders as a self-contained SVG
// instead of risking a broken <Image> reference in production.
export default function KryntixMark({ className = "h-6 w-auto" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M13.2 1.5 4.8 13.4h5.6L9.6 22.5l9.6-12.6h-6.1L13.2 1.5Z"
        fill="var(--accent)"
        stroke="var(--gold)"
        strokeWidth="0.9"
        strokeLinejoin="round"
      />
    </svg>
  );
}
