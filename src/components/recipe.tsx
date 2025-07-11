import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { fetchRecipeBySlug } from "@/data/recipe/queries";
import { cn, nameToInitials } from "@/lib/utils";
import {
  ClockFading,
  ForkKnife,
  LucideIcon,
  Microwave,
  Refrigerator,
  ArrowUpRight,
  Mail,
  Soup,
  CalendarPlus,
  ListPlus,
  BookmarkPlus,
  LucideLink,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ReactNode } from "react";

export default async function Recipe({ slug }: { slug: string }) {
  const data = await fetchRecipeBySlug(slug);

  if (!data) notFound();

  return (
    <article className="flex flex-col gap-8">
      {/* Recipe Header */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-3">
          <h1 className="text-center text-3xl font-semibold">{data.name}</h1>

          {/* "Nyckeltal" / Stats */}
          <div className="flex max-w-[225px] flex-wrap justify-center gap-2 sm:max-w-full">
            <StatValue icon={Refrigerator} desc="ingredienser">
              {data.recipeIngredients.length}
            </StatValue>
            {data.totalTimeSeconds && (
              <StatValue icon={ClockFading} desc="min">
                {data.totalTimeSeconds / 60}
              </StatValue>
            )}
            {data.recipeYield && (
              <StatValue icon={ForkKnife} desc="portioner">
                {data.recipeYield}
              </StatValue>
            )}
            {data.oven && <StatValue icon={Microwave}>{data.oven}º</StatValue>}
          </div>
        </div>

        {/* Image */}
        <div className="flex w-full items-center justify-center overflow-clip rounded-xl">
          {data.imageUrl ? (
            <Image
              src={data.imageUrl}
              alt={data.name}
              width={1000}
              height={1000}
              priority
              className="size-full object-cover"
            />
          ) : (
            <div className="flex h-80 w-full items-center justify-center rounded-xl bg-muted">
              <Soup className="size-16 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Recipe Description */}
        <div className="flex flex-col gap-4">
          <p className="px-4 text-justify text-sm text-muted-foreground">
            {data.description}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-1 text-sm font-medium text-muted-foreground">
            <span className="">Författare: </span>
            {data.sourceUrl && data.originalAuthor && (
              <>
                <Link
                  href={data.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "mr-1 flex border-r border-border pr-2 text-foreground underline",
                    "hover:gap-0.5 hover:pr-1.5 hover:no-underline",
                  )}
                >
                  {data.originalAuthor}
                  <ArrowUpRight className="size-3" />
                </Link>
                <span>Importerad av: </span>
              </>
            )}
            <HoverCard>
              <HoverCardTrigger asChild>
                <button className="cursor-pointer border-none bg-transparent p-0 text-left text-foreground underline hover:no-underline">
                  {data.createdBy.name}
                </button>
              </HoverCardTrigger>
              <HoverCardContent className="w-fit">
                <div className="flex justify-between gap-4">
                  <Avatar>
                    {data.createdBy.image ? (
                      <AvatarImage src={data.createdBy.image} />
                    ) : (
                      <AvatarFallback>
                        {nameToInitials(data.createdBy.name)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="grid gap-0.5">
                    <span className="text-sm font-medium">
                      {data.createdBy.name}
                    </span>
                    <Link
                      className={cn(
                        "flex gap-0.5 pr-2 text-sm text-muted-foreground underline",
                        "hover:gap-1 hover:pr-1.5 hover:no-underline",
                      )}
                      href={`mailto:${data.createdBy.email}`}
                    >
                      {data.createdBy.email}
                      <Mail className="size-3" />
                    </Link>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant={"ghost"}
            size={"icon-lg"}
            className={"grow"}
            // onClick={() => {}} // TODO Add click handler
          >
            <CalendarPlus className="size-6" />
          </Button>
          <Button
            variant={"ghost"}
            size={"icon-lg"}
            className={"grow"}
            // onClick={() => {}} // TODO Add click handler
          >
            <ListPlus className="size-6" />
          </Button>
          <Button
            variant={"ghost"}
            size={"icon-lg"}
            className={"grow"}
            // onClick={() => {}} // TODO Add click handler
          >
            <BookmarkPlus className="size-6" />
          </Button>
          <Button
            variant={"ghost"}
            size={"icon-lg"}
            className={"grow"}
            // onClick={() => {}} // TODO Add click handler
          >
            <LucideLink className="size-6" />
          </Button>
        </div>
      </div>
    </article>
  );
}

function StatValue({
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
        "flex h-[14px] items-center gap-1 text-sm font-medium",
        "nth-[2n+1]:border-r nth-[2n+1]:border-border nth-[2n+1]:pr-2",
        "last:border-none last:pr-0 sm:border-r sm:border-border sm:pr-2",
      )}
    >
      <Icon className="size-[14px]" />
      <span>{children}</span>
      <span className="text-muted-foreground">{desc}</span>
    </div>
  );
}

// •
