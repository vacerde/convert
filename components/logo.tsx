import * as React from "react";

export default function Logo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 200 200"
      width="200"
      height="200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        {/* FIRST triangle mask */}
        <mask id="mask-a" maskUnits="userSpaceOnUse">
          <path d="M92.5 37.5L157.452 150H27.5481L92.5 37.5Z" fill="white" />
          <rect x="-12" y="32" width="100" height="125" fill="black" />
          <path d="M89 152L24.0481 39.5L153.952 34.5L89 152Z" fill="black" />
        </mask>

        {/* SECOND triangle mask */}
        <mask id="mask-b" maskUnits="userSpaceOnUse">
          <path d="M61 150L-3.9519 50.25L125.952 50.25L61 150Z" fill="white" />
          <path d="M35 134L-29.9519 32.75L99.9519 32.75L35 134Z" fill="black" />
        </mask>
      </defs>

      <path
        d="M92.5 37.5L157.452 150H27.5481L92.5 37.5Z"
        fill="white"
        mask="url(#mask-a)"
      />

      <path
        d="M61 150L-3.9519 50.25L125.952 50.25L61 150Z"
        fill="white"
        mask="url(#mask-b)"
      />
    </svg>
  );
}
