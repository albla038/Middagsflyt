import RecipeContent from "@/components/recipe-content";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import H1 from "@/components/ui/typography/h1";
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
  const recipe = await fetchRecipeBySlug(slug);

  if (!recipe) notFound();

  return (
    <article className="flex flex-col gap-8">
      {/* Recipe Header */}
      <section className="relative">
        <div
          className={cn(
            "flex flex-col gap-6",
            "justify-center sm:min-h-[504px] sm:w-1/2 sm:gap-8 sm:px-8 sm:py-6",
          )}
        >
          <div className="flex flex-col items-center gap-3">
            <H1>{recipe.name}</H1>
            {/* "Nyckeltal" / Stats */}
            <div className="flex max-w-[225px] flex-wrap justify-center gap-2 lg:max-w-full">
              <StatValue icon={Refrigerator} desc="ingredienser">
                {recipe.recipeIngredients.length}
              </StatValue>
              {recipe.totalTimeSeconds && (
                <StatValue icon={ClockFading} desc="min">
                  {recipe.totalTimeSeconds / 60}
                </StatValue>
              )}
              {recipe.recipeYield && (
                <StatValue icon={ForkKnife}>{recipe.recipeYield}</StatValue>
              )}
              {recipe.oven && (
                <StatValue icon={Microwave}>{recipe.oven}º</StatValue>
              )}
            </div>
          </div>
          {/* Image */}
          <div
            className={cn(
              "flex w-full items-center justify-center overflow-clip rounded-xl",
              "sm:absolute sm:inset-y-0 sm:right-0 sm:h-full sm:w-1/2",
            )}
          >
            {recipe.imageUrl ? (
              <Image
                src={recipe.imageUrl}
                alt={recipe.name}
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
              {recipe.description}
            </p>

            {/* Source and Author */}
            <div
              className={cn(
                "mx-auto flex max-w-[350px] flex-wrap justify-center gap-x-2 text-sm font-medium text-muted-foreground",
                "lg:max-w-full",
              )}
            >
              {recipe.sourceUrl && recipe.originalAuthor ? (
                <>
                  <span>
                    <span>Författare: </span>
                    <Link
                      href={recipe.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "inline-flex text-foreground underline",
                        "lg:border-r lg:border-border lg:pr-2",
                        "hover:gap-0.5 hover:pr-1.5 hover:no-underline",
                      )}
                    >
                      {recipe.originalAuthor}
                      <ArrowUpRight className="size-3" />
                    </Link>
                  </span>
                  <span>
                    <span>Importerad av: </span>
                    <ImporterHoverCard
                      name={recipe.createdBy.name}
                      email={recipe.createdBy.email}
                      imageUrl={recipe.createdBy.image}
                    />
                  </span>
                </>
              ) : (
                <span>
                  <span>Importerad av: </span>
                  <ImporterHoverCard
                    name={recipe.createdBy.name}
                    email={recipe.createdBy.email}
                    imageUrl={recipe.createdBy.image}
                  />
                </span>
              )}
            </div>
          </div>
          {/* Action buttons */}
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
      </section>

      {/* Recipe ingredients */}
      <RecipeContent
        ingredients={recipe.recipeIngredients}
        instructions={recipe.recipeInstructions}
        recipeYield={recipe.recipeYield}
        slug={slug}
      />
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
        "flex h-[1lh] items-center gap-1 text-sm font-medium",
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

function ImporterHoverCard({
  name,
  email,
  imageUrl,
}: {
  name: string;
  email: string;
  imageUrl: string | null;
}) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <button className="cursor-pointer border-none bg-transparent p-0 text-left text-foreground underline hover:no-underline">
          {name}
        </button>
      </HoverCardTrigger>
      <HoverCardContent className="w-fit">
        <div className="flex justify-between gap-4">
          <Avatar>
            {imageUrl ? (
              <AvatarImage src={imageUrl} />
            ) : (
              <AvatarFallback>{nameToInitials(name)}</AvatarFallback>
            )}
          </Avatar>
          <div className="grid gap-0.5">
            <span className="text-sm font-medium">{name}</span>
            <Link
              className={cn(
                "flex gap-0.5 pr-2 text-sm text-muted-foreground underline",
                "hover:gap-1 hover:pr-1.5 hover:no-underline",
              )}
              href={`mailto:${email}`}
            >
              {email}
              <Mail className="size-3" />
            </Link>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
