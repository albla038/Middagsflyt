import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

export default function StatValueSmall({
  children,
  icon: Icon,
  desc,
}: {
  children: ReactNode;
  icon: LucideIcon;
  desc?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-[1lh] items-center gap-0.5 text-xs font-medium",
        "nth-[2n+1]:border-r nth-[2n+1]:border-border nth-[2n+1]:pr-2",
        "last:border-none last:pr-0 lg:border-r lg:border-border lg:pr-2",
      )}
    >
      <Icon className="size-3" />
      <span>{children}</span>
      <span className="text-muted-foreground">{desc}</span>
    </div>
  );
}
