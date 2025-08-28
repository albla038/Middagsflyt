import StatValueSmall from "@/components/stat-value-small";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import H3 from "@/components/ui/typography/h3";
import { RecipeDisplayContent } from "@/lib/schemas/recipe";
import { cn } from "@/lib/utils";
import { CalendarClock, ClockFading, Soup, Utensils } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type RecipeSelectionCardProps = {
  recipe: RecipeDisplayContent;
};

export default function RecipeSelectionCard({
  recipe,
}: RecipeSelectionCardProps) {
  const {
    id,
    name,
    slug,
    recipeYield,
    imageUrl,
    recipeType,
    proteinType,
    totalTimeSeconds,
    scheduledDates,
  } = recipe;

  const [isImageLoading, setImageLoading] = useState(true);

  return (
    <article>
      <label htmlFor={`radio-${id}`}>
        <Card
          className={cn(
            "group cursor-pointer gap-0 overflow-hidden border-transparent p-0",
            "transition-all duration-300 hover:border-border hover:bg-subtle",
            "has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary-foreground",
          )}
        >
          <div className="relative aspect-[4/3] overflow-hidden rounded-b-xl bg-accent">
            {imageUrl ? (
              <>
                {isImageLoading && (
                  <Skeleton className="size-full rounded-xl" />
                )}
                <Image
                  src={imageUrl}
                  alt="Receptbild"
                  width={1000}
                  height={750}
                  className={cn(
                    "size-full object-cover transition-opacity duration-500",
                    isImageLoading ? "opacity-0" : "opacity-100",
                  )}
                  onLoad={() => setImageLoading(false)}
                  priority
                />
              </>
            ) : (
              <div className="flex size-full items-center justify-center rounded-xl bg-muted">
                <Soup className="size-8 text-muted-foreground" />
              </div>
            )}

            <RadioGroupItem
              id={`radio-${id}`}
              value={id}
              className="absolute top-2 left-2 bg-background"
            />

            {/* // Show scheduled date if the recipe is scheduled in the future */}
            {scheduledDates && (
              <div className="absolute top-2 right-2">
                {scheduledDates.map((date) => (
                  <li key={date.toISOString()}>
                    <Badge variant="secondary" className="w-full">
                      <CalendarClock />
                      {date.toLocaleDateString("sv-SE", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </Badge>
                  </li>
                ))}
              </div>
            )}
          </div>

          <CardContent className="grid gap-2 px-4 pt-3 pb-4">
            <div className="flex flex-wrap items-center gap-2">
              {proteinType && (
                <Badge variant="secondary">
                  {proteinType.charAt(0) + proteinType.slice(1).toLowerCase()}
                </Badge>
              )}
              <Badge variant="outline">
                {recipeType.charAt(0) + recipeType.slice(1).toLowerCase()}
              </Badge>
            </div>

            <div className="grid gap-1">
              {/* // TODO Replace with schedule link */}
              <Link
                href={`/saved-recipes/${slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                <H3 className="line-clamp-2">{name}</H3>
              </Link>

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
        </Card>
      </label>
    </article>
  );
}
