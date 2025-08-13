"use client";

import { toggleBookmark } from "@/components/recipe/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { BookmarkMinus, BookmarkPlus, Loader2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

type ActionButtonProps = React.ComponentPropsWithRef<"button"> & {
  variant?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost";
  size?: "default" | "sm" | "lg" | "icon" | "icon-lg";
  isBookmarked: boolean;
  recipeId: string;
  slug: string;
};

export default function BookmarkToggle({
  variant = "default",
  size = "default",
  className,
  isBookmarked,
  recipeId,
  slug,
  ...rest
}: ActionButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    console.log("BookmarkToggle clicked");
    startTransition(async () => {
      const result = await toggleBookmark({
        recipeId,
        slug,
        isBookmarked,
      });

      if (result.ok) {
        toast.success(
          result.data.isSaved
            ? "Recept sparat"
            : "Recept borttaget från Sparade recept",
        );
      } else {
        toast.error(
          `Kunde inte ${isBookmarked ? "ta bort receptet från" : "spara receptet i"} Sparade recept. Vänligen försök igen.`,
        );
      }
    });
  }

  const saveContent =
    size === "default" ? (
      <>
        <BookmarkPlus /> <span>Spara recept</span>
      </>
    ) : size === "icon-lg" ? (
      <BookmarkPlus className="size-6" />
    ) : (
      <BookmarkPlus />
    );

  const unsaveContent =
    size === "default" ? (
      <>
        <BookmarkMinus /> <span>Ta bort från Sparade recept</span>
      </>
    ) : size === "icon-lg" ? (
      <BookmarkMinus className="size-6" />
    ) : (
      <BookmarkMinus />
    );

  return (
    <Button
      {...rest}
      variant={variant}
      size={size}
      className={cn(className, "")}
      disabled={isPending}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        handleClick();
      }}
    >
      {isPending ? (
        <Loader2 className="size-4 animate-spin" />
      ) : isBookmarked ? (
        unsaveContent
      ) : (
        saveContent
      )}
    </Button>
  );
}
