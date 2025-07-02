import { CookingPot } from "lucide-react";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-svh flex-col items-center justify-center gap-6 p-2 md:gap-12">
      <h1 className="text-3xl font-semibold">
        <div className="flex gap-3">
          <CookingPot className="size-8" /> Middagsflyt
        </div>
      </h1>
      <div className="max-w-5xl md:w-full">{children}</div>
    </div>
  );
}
