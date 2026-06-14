import * as React from "react";

export function Logo(props: React.SVGProps<SVGSVGElement>) {
  const id = React.useId();

  const maskA = `${id}-mask-a`;
  const maskB = `${id}-mask-b`;

  return (
    <svg
      viewBox="0 0 200 200"
      width="200"
      height="200"
      aria-label="Vacer Icon Logo"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        <mask id={maskA} maskUnits="userSpaceOnUse">
          <path d="M92.5 37.5L157.452 150H27.5481L92.5 37.5Z" fill="white" />
          <rect x="-12" y="32" width="100" height="125" fill="black" />
          <path d="M89 152L24.0481 39.5L153.952 34.5L89 152Z" fill="black" />
        </mask>

        <mask id={maskB} maskUnits="userSpaceOnUse">
          <path d="M61 150L-3.9519 50.25L125.952 50.25L61 150Z" fill="white" />
          <path d="M35 134L-29.9519 32.75L99.9519 32.75L35 134Z" fill="black" />
        </mask>
      </defs>

      <path
        d="M92.5 37.5L157.452 150H27.5481L92.5 37.5Z"
        fill="currentColor"
        mask={`url(#${maskA})`}
      />

      <path
        d="M61 150L-3.9519 50.25L125.952 50.25L61 150Z"
        fill="currentColor"
        mask={`url(#${maskB})`}
      />
    </svg>
  );
}