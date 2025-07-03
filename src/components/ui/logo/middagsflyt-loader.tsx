import { cn } from "@/lib/utils";

export function MiddagsflytLoader({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("", className)}
    >
      <line x1={18} y1={6} x2={17} y2={12} z="-10">
        <animate
          attributeName="x1"
          values="18; 9; 18"
          begin="0.5s"
          dur="3s"
          repeatCount="indefinite"
          calcMode="spline"
          keyTimes="0; 0.5; 1"
          keySplines="0.42 0 0.58 1; 0.42 0 0.58 1"
        />

        <animate
          attributeName="x2"
          values="17; 7; 17"
          begin="0.5s"
          dur="3s"
          repeatCount="indefinite"
          calcMode="spline"
          keyTimes="0; 0.5; 1"
          keySplines="0.45 0 0.55 1; 0.45 0 0.55 1"
        />
      </line>

      <path d="M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8" />
      <path d="M2 12 h20" />
    </svg>
  );
}
