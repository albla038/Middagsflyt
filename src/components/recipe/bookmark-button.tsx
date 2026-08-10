"use client";

import { toggleBookmarkAction } from "@/components/recipe/actions";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { Bookmark } from "lucide-react";
import { usePathname } from "next/navigation";
import { ComponentProps, useTransition } from "react";
import { toast } from "sonner";

type ActionButtonProps = ComponentProps<typeof Button> & {
  isBookmarked: boolean;
  recipeId: string;
};

export default function BookmarkButton({
  variant = "default",
  size = "default",
  className,
  isBookmarked,
  recipeId,
  ...props
}: ActionButtonProps) {
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      const response = await toggleBookmarkAction({
        recipeId,
        isBookmarked,
        pathname,
      });

      if (!response.success) {
        toast.error(
          `Kunde inte ${isBookmarked ? "ta bort receptet från" : "spara receptet i"} Sparade recept. Vänligen försök igen.`,
        );
        return;
      }

      toast.success(
        response.data.isSaved
          ? "Receptet sparades"
          : "Receptet togs bort från Sparade recept",
      );
    });
  }

  const isIconOnly = size?.includes("icon") ?? false;

  return (
    <Button
      {...props}
      variant={variant}
      size={size}
      className={className}
      disabled={isPending}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        handleToggle();
      }}
    >
      {isPending ? (
        <Spinner />
      ) : (
        <Bookmark className={cn({ "fill-current": isBookmarked })} />
      )}
      {isIconOnly
        ? null
        : isBookmarked
          ? "Ta bort från Sparade recept"
          : "Spara recept"}
    </Button>
  );
}
