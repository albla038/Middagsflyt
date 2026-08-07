"use client";

import BookmarkToggle from "@/components/recipe/bookmark-toggle";
import CopyLinkButton from "@/components/recipe/copy-link-button";
import {
  IngredientContent,
  InstructionContent,
} from "@/components/recipe/types";
import { useRecipeContentState } from "@/components/recipe/use-recipe-content-state";
import ServingsControl from "@/components/servings-control";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import H2 from "@/components/ui/typography/h2";
import { useQueryParams } from "@/hooks/use-query-params";
import useScreenWakeLock from "@/hooks/use-screen-wake-lock";
import { cn, formatQuantityDecimal } from "@/lib/utils";
import { CalendarPlus, ListPlus } from "lucide-react";
import z from "zod";

const queryParamsSchema = z.object({
  servings: z.coerce.number().positive(),
});

type RecipeContentProps = {
  ingredients: IngredientContent[];
  instructions: InstructionContent[];
  recipeYield?: number | null;
  slug: string;
  recipeId: string;
  isBookmarked?: boolean;
};

export default function RecipeContent({
  ingredients,
  instructions,
  recipeYield,
  slug,
  recipeId,
  isBookmarked,
}: RecipeContentProps) {
  // State
  const { state, dispatch } = useRecipeContentState(ingredients, instructions);

  // Servings state in query params
  const defaultServings = recipeYield ?? 4;
  const [queryState, setQueryState] = useQueryParams(queryParamsSchema, {
    servings: defaultServings,
  });
  const { servings } = queryState;
  const servingsScale = servings / defaultServings;

  const setServings = (newServings: number) => {
    setQueryState({ servings: newServings });
  };

  // Keep screen on hook
  const { isLocked, toggleWakeLock } = useScreenWakeLock();

  return (
    <div
      className={cn(
        "flex min-h-[calc(100svh-32px)] flex-col gap-4",
        "sm:grid sm:grid-cols-2 sm:gap-0",
      )}
    >
      {/* Recipe ingredients */}
      <section className="flex flex-col rounded-xl bg-subtle p-4">
        {/* Header */}
        <div className="flex justify-between border-b border-border pb-3">
          <H2>Ingredienser</H2>

          <ServingsControl
            servings={servings}
            onServingsChange={setServings}
            defaultServings={defaultServings}
          />
        </div>
        {/* Ingredients list */}
        <ScrollArea className="grow sm:max-h-[calc(100svh-150px)]">
          <ul className="flex flex-col py-3 pr-3">
            {state.ingredients.map((ingredient) => {
              const { id, quantity, unit, text, note, isChecked, isMuted } =
                ingredient;
              return (
                <li
                  key={id}
                  className={cn(
                    "w-fit transition duration-300 hover:cursor-pointer",
                    "*:after:content-['_']",
                    {
                      "text-muted-foreground line-through": isChecked,
                      "text-muted-foreground": isMuted,
                    },
                  )}
                  onClick={() =>
                    dispatch({ type: "CHECK_INGREDIENT", payload: { id } })
                  }
                >
                  {quantity && (
                    <span className="font-medium">
                      {formatQuantityDecimal(quantity * servingsScale)}
                    </span>
                  )}
                  {unit && unit !== "ST" && (
                    <span className="font-medium">{unit.toLowerCase()}</span>
                  )}
                  <p
                    className={cn("inline", {
                      "text-muted-foreground line-through": isChecked,
                    })}
                  >
                    {text}{" "}
                    {note && (
                      <span className="text-muted-foreground">{note}</span>
                    )}
                  </p>
                </li>
              );
            })}
          </ul>
        </ScrollArea>
        {/* Action buttons */}
        <div className="flex justify-end gap-2">
          <Button
            variant={"secondary"}
            onClick={() => {}} // TODO Add click handler
          >
            <ListPlus />
            <span>Lägg i inköpslista</span>
          </Button>
          <Button
            onClick={() => {}} // TODO Add click handler
          >
            <CalendarPlus />
            <span>Planera</span>
          </Button>
        </div>
      </section>

      {/* Recipe instructions */}
      <section className={cn("flex flex-col p-4", "sm:px-6")}>
        {/* Header */}
        <div className="flex items-baseline justify-between border-b border-border pb-3">
          <H2>Gör så här</H2>
          <span className="flex items-center gap-2">
            <Label htmlFor="keep-screen-on">Håll skärmen tänd</Label>
            <Switch
              id="keep-screen-on"
              checked={isLocked}
              onCheckedChange={toggleWakeLock}
            />
          </span>
        </div>

        {/* Instructions list */}
        <ScrollArea className="sm:max-h-[calc(100svh-150px)]">
          <ul className="flex flex-col gap-3 py-3 pr-3">
            {state.instructions.map((instruction) => {
              const { id, text, isChecked, recipeIngredients } = instruction;
              return (
                <li key={id}>
                  <Label
                    className={cn(
                      "flex items-start gap-2 rounded-md border border-border p-3 text-base font-normal transition duration-300",
                      "has-[[aria-checked=true]]:text-muted-foreground has-[[aria-checked=true]]:line-through has-[[aria-checked=true]]:[&>p]:line-clamp-1",
                      "hover:bg-accent",
                    )}
                    onMouseEnter={() =>
                      dispatch({
                        type: "HOVER_INSTRUCTION",
                        payload: { ingredientIds: recipeIngredients },
                      })
                    }
                    onMouseLeave={() =>
                      dispatch({
                        type: "CLEAR_HOVER",
                      })
                    }
                  >
                    <span className="flex h-lh items-center">
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={(event) => {
                          if (typeof event !== "boolean") return;
                          dispatch({
                            type: "CHECK_INSTRUCTION",
                            payload: {
                              id,
                              ingredientIds: recipeIngredients,
                              checked: event,
                            },
                          });
                        }}
                      />
                    </span>
                    <p>{text}</p>
                  </Label>
                </li>
              );
            })}
          </ul>
        </ScrollArea>

        {/* Action buttons */}
        <div className="flex flex-wrap justify-end gap-2">
          <CopyLinkButton slug={slug} />

          <BookmarkToggle
            isBookmarked={isBookmarked ?? false}
            recipeId={recipeId}
            slug={slug}
          />
        </div>
      </section>
    </div>
  );
}
