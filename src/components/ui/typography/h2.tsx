import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export default function H2({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2 className={cn("text-xl font-semibold tracking-tight", className)}>
      {children}
    </h2>
  );
}
