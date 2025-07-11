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
    <h1
      className={cn(
        className,
        "text-xl font-semibold tracking-tight",
      )}
    >
      {children}
    </h1>
  );
}
