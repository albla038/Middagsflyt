import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export default function H3({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h3
      className={cn(
        "text-base font-semibold tracking-tight text-pretty",
        className,
      )}
    >
      {children}
    </h3>
  );
}
