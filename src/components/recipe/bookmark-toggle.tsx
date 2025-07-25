"use client";

import { toggleBookmark } from "@/components/recipe/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { BookmarkMinus, BookmarkPlus, Loader2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

type ActionButtonProps = React.ComponentPropsWithRef<"button"> & {
  variant?: "primary" | "icon-lg";
  className?: string;
  isBookmarked: boolean;
  recipeId: string;
  slug: string;
};

export default function BookmarkToggle({
  variant = "primary",
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
            ? "Recept sparat i Mina recept"
            : "Recept borttaget från Mina recept",
        );
      } else {
        toast.error(
          `Kunde inte ${isBookmarked ? "ta bort" : "spara"} receptet i Mina recept. Vänligen försök igen.`,
        );
      }
    });
  }

  const saveContent =
    variant === "primary" ? (
      <>
        <BookmarkPlus /> <span>Spara i Mina recept</span>
      </>
    ) : (
      <BookmarkPlus className="size-6" />
    );

  const unsaveContent =
    variant === "primary" ? (
      <>
        <BookmarkMinus /> <span>Ta bort från Mina recept</span>
      </>
    ) : (
      <BookmarkMinus className="size-6" />
    );

  return (
    <Button
      {...rest}
      variant={variant === "primary" ? "default" : "ghost"}
      size={variant === "primary" ? "default" : "icon-lg"}
      className={cn(className, "")}
      disabled={isPending}
      onClick={handleClick}
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
