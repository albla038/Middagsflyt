import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export default function H1({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h1
      className={cn(
        "inline-flex items-center gap-2 text-center text-3xl font-semibold tracking-tight text-balance",
        className,
      )}
    >
      {children}
    </h1>
  );
}
