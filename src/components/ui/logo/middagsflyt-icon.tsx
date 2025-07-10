import { cn } from "@/lib/utils";

export function MiddagsflytIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("group", className)}
    >
      <g transform="translate(4, 4)">
        <path d="M2 12h20" />
        <path d="M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8" />
        <g className="group-hover:-rotate transition delay-100 ease-in-out group-hover:-translate-x-[1.5px] group-hover:-translate-y-[1.5px] group-hover:-rotate-12">
          <path d="m4 8 16-4" />
          <path d="m8.86 6.78-.45-1.81a2 2 0 0 1 1.45-2.43l1.94-.48a2 2 0 0 1 2.43 1.46l.45 1.8" />
        </g>
      </g>
    </svg>
  );
}
