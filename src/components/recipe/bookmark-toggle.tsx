"use client";

import { toggleBookmark } from "@/app/recipe/[slug]/actions";
import { Button } from "@/components/ui/button";

import { BookmarkMinus, BookmarkPlus, Loader2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

type ActionButtonProps = React.ComponentPropsWithRef<"button"> & {
  isBookmarked: boolean;
  recipeId: string;
  slug: string;
};

export default function BookmarkToggle({
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
            ? "Recept sparat i Mina Recept"
            : "Recept borttaget från Mina Recept",
        );
      } else {
        toast.error(
          `Kunde inte ${isBookmarked ? "ta bort" : "spara"} receptet i Mina Recept. Vänligen försök igen.`,
        );
      }
    });
  }

  return (
    <Button
      {...rest}
      variant={"ghost"}
      size={"icon-lg"}
      className={"grow"}
      disabled={isPending}
      onClick={handleClick}
    >
      {isPending ? (
        <Loader2 className="size-4 animate-spin" />
      ) : isBookmarked ? (
        <BookmarkMinus className="size-6" />
      ) : (
        <BookmarkPlus className="size-6" />
      )}
    </Button>
  );
}
