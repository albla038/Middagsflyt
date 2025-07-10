import { MiddagsflytIcon } from "@/components/ui/logo/middagsflyt-icon";
import { CookingPot } from "lucide-react";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-svh flex-col items-center justify-center gap-6 p-2 md:gap-12">
      <h1>
        <div className="flex items-center gap-3">
          <MiddagsflytIcon className="size-8 rounded-sm bg-primary p-1 text-primary-foreground" />

          <span className="text-xl font-medium">Middagsflyt</span>
        </div>
      </h1>
      <div className="max-w-5xl md:w-full">{children}</div>
    </div>
  );
}
