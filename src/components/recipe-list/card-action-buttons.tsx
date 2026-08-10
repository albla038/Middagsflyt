import BookmarkButton from "@/components/recipe/bookmark-button";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MyRecipesDisplay } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CalendarPlus, ListPlus } from "lucide-react";

export default function CardActionButtons({
  displayType,
  isSaved,
  id,
  onClickSchedule,
  onClickAddToList,
}: {
  displayType?: MyRecipesDisplay;
  isSaved: boolean;
  id: string;
  onClickSchedule: () => void;
  onClickAddToList: () => void;
}) {
  return (
    <div className="group absolute top-2 right-2 flex flex-col items-center gap-1">
      {displayType === "created" && (
        <Tooltip delayDuration={200}>
          <TooltipTrigger asChild>
            <BookmarkButton
              isBookmarked={isSaved}
              recipeId={id}
              variant="default"
              size="icon"
              className={cn(
                { "opacity-0": isSaved },
                "group-hover:opacity-100",
                "group-hover:border-none group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-xs hover:bg-primary/90",
              )}
            />
          </TooltipTrigger>
          <TooltipContent side="left">
            {isSaved ? <p>Ta bort från Sparade recept</p> : <p>Spara recept</p>}
          </TooltipContent>
        </Tooltip>
      )}

      <div
        className={cn(
          "flex flex-col items-center gap-1 opacity-0 transition-opacity duration-200",
          "group-hover:opacity-100",
        )}
      >
        {/* Schedule recipe action */}
        <Tooltip delayDuration={200}>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant={displayType === "saved" ? "default" : "outline"}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onClickSchedule();
              }}
            >
              <CalendarPlus />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Planera recept</p>
          </TooltipContent>
        </Tooltip>

        {/* Add to shopping list action */}
        <Tooltip delayDuration={200}>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onClickAddToList();
              }}
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
  );
}
