"use client";

interface FakeCursorProps {
  className?: string;
}

export function FakeCursor({ className = "" }: FakeCursorProps) {
  return (
    <span
      className={`absolute pointer-events-none z-10 ${className}`}
      style={{
        animation: "cursorFloat 5s ease-in-out infinite",
        animationDelay: "2s",
      }}
      aria-hidden="true"
    >
      {/* Custom SVG cursor/pointer arrow */}
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]"
      >
        <path
          d="M5.5 1.5L18.5 8.5L11.5 10.5L8.5 17.5L5.5 1.5Z"
          fill="white"
          stroke="#1e90ff"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
