"use client";

import { ProteinType } from "@/lib/generated/prisma";
import { cn } from "@/lib/utils";
import {
  CalendarClock,
  CalendarPlus,
  ClockFading,
  ListPlus,
  LucideIcon,
  Soup,
  Utensils,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ReactNode, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import H3 from "@/components/ui/typography/h3";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";

type RecipeListCardProps = {
  recipe: {
    name: string;
    slug: string;
    recipeYield: number | null;
    imageUrl: string | null;
    proteinType: ProteinType | null;
    totalTimeSeconds: number | null;
  };
  isImported?: boolean;
  createdByUser?: boolean;
  scheduledDate?: Date;
};

export default function RecipeListCard({
  recipe,
  isImported,
  createdByUser,
  scheduledDate,
}: RecipeListCardProps) {
  const [isLoading, setIsLoading] = useState(true);

  const { name, slug, recipeYield, imageUrl, proteinType, totalTimeSeconds } =
    recipe;

  return (
    <article className="h-full">
      <Card
        className={cn(
          "group gap-0 overflow-hidden border-transparent p-0",
          "transition-all duration-300 hover:border-border hover:bg-subtle", // TODO Image res glitches when scaling
        )}
      >
        <Link href={`/my-recipes/${slug}`}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-b-xl bg-accent">
            {imageUrl ? (
              <>
                {isLoading && <Skeleton className="size-full rounded-xl" />}
                <Image
                  src={imageUrl}
                  alt="Receptbild"
                  width={1000}
                  height={750}
                  className={cn(
                    "size-full object-cover transition-opacity duration-500",
                    isLoading ? "opacity-0" : "opacity-100",
                  )}
                  onLoad={() => setIsLoading(false)}
                  priority
                />
              </>
            ) : (
              <div className="flex size-full items-center justify-center rounded-xl bg-muted">
                <Soup className="size-8 text-muted-foreground" />
              </div>
            )}

            {scheduledDate && (
              <div className="absolute top-2 left-2">
                <Badge variant="secondary">
                  <CalendarClock />
                  {scheduledDate.toLocaleDateString("sv-SE", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </Badge>
              </div>
            )}

            <div
              className={cn(
                "absolute top-2 right-2 hidden flex-col items-center gap-1",
                "group-hover:flex",
                "transition-all duration-300 ease-in-out",
              )}
            >
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    // TODO add onclick
                  >
                    <CalendarPlus />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>Planera recept</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="outline"
                    // TODO add onclick
                  >
                    <ListPlus />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>Lägg i inköpslista</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          <CardContent className="grid gap-2 pt-3 pb-6">
            <div className="flex items-center gap-2">
              {proteinType && (
                <>
                  <Badge variant="secondary">
                    {proteinType.charAt(0) + proteinType.slice(1).toLowerCase()}
                    {/* {proteinType} */}
                  </Badge>
                  {isImported && createdByUser ? (
                    <Badge variant="outline">Importerat av dig</Badge>
                  ) : (
                    createdByUser && (
                      <Badge variant="outline">Skapat av dig</Badge>
                    )
                  )}
                </>
              )}
            </div>
            <div className="grid gap-1">
              <H3>{name}</H3>
              <div className="flex flex-wrap items-center gap-2">
                {totalTimeSeconds && (
                  <StatValueSmall icon={ClockFading} desc="min">
                    {totalTimeSeconds / 60}
                  </StatValueSmall>
                )}
                {recipeYield && (
                  <StatValueSmall icon={Utensils}>{recipeYield}</StatValueSmall>
                )}
              </div>
            </div>
          </CardContent>
        </Link>
      </Card>
    </article>
  );
}

function StatValueSmall({
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
        "flex h-[1lh] items-center gap-1 text-xs font-medium",
        "nth-[2n+1]:border-r nth-[2n+1]:border-border nth-[2n+1]:pr-2",
        "last:border-none last:pr-0 lg:border-r lg:border-border lg:pr-2",
      )}
    >
      <Icon className="size-[14px]" />
      <span>{children}</span>
      <span className="text-muted-foreground">{desc}</span>
    </div>
  );
}
