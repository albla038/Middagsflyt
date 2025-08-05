"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ArrowDown } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export default function OrderByToggle() {
  const params = useSearchParams();
  const pathname = usePathname();

  const searchParams = new URLSearchParams(params);
  const order = searchParams.get("order");
  if (order === "asc") {
    searchParams.delete("order");
  } else {
    searchParams.set("order", "asc");
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon" asChild>
          <Link href={`${pathname}/?${searchParams.toString()}`} replace>
            <ArrowDown
              className={cn("rotate-0 transition-transform duration-200", {
                "rotate-180": order === "asc",
              })}
            />
          </Link>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Vänd sorteringsordning</p>
      </TooltipContent>
    </Tooltip>
  );
}
