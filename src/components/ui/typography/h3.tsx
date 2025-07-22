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
    <h3 className={cn(className, "text-base font-semibold tracking-tight")}>
      {children}
    </h3>
  );
}
