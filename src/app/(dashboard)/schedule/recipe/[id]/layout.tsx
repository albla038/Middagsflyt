import { ScrollArea } from "@/components/ui/scroll-area";
import { ReactNode } from "react";

export default function ScheduledRecipeLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ScrollArea className="h-full">
      <div className="relative flex w-full flex-col items-center">
        {children}
      </div>
    </ScrollArea>
  );
}
