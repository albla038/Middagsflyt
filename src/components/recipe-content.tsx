"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import H2 from "@/components/ui/typography/h2";
import useScreenWakeLock from "@/hooks/use-screen-wake-lock";
import { Unit } from "@/lib/generated/prisma";
import { cn, formatQuantityDecimal } from "@/lib/utils";
import {
  BookmarkPlus,
  CalendarPlus,
  ForkKnife,
  ListPlus,
  LucideLink,
  Minus,
  Plus,
} from "lucide-react";
import { useReducer, useState } from "react";
import { toast } from "sonner";

type IngredientContent = {
  id: string;
  text: string;
  note: string | null;
  quantity: number | null;
  unit: Unit | null;
};

type InstructionContent = {
  id: string;
  text: string;
  recipeIngredients: string[];
};

type ContentState = {
  ingredients: (IngredientContent & {
    isChecked: boolean;
    isMuted: boolean;
  })[];
  instructions: (InstructionContent & {
    isChecked: boolean;
  })[];
};

type ContentAction =
  | {
      type: "CHECK_INGREDIENT";
      payload: { id: string };
    }
  | {
      type: "CHECK_INSTRUCTION";
      payload: {
        id: string;
        ingredientIds: string[];
        checked: boolean;
      };
    }
  | {
      type: "HOVER_INSTRUCTION";
      payload: { ingredientIds: string[] };
    }
  | {
      type: "CLEAR_HOVER";
    };

function contentReducer(
  state: ContentState,
  action: ContentAction,
): ContentState {
  switch (action.type) {
    case "CHECK_INGREDIENT":
      return {
        ...state,
        ingredients: state.ingredients.map((ingredient) =>
          ingredient.id === action.payload.id
            ? { ...ingredient, isChecked: !ingredient.isChecked }
            : ingredient,
        ),
      };

    case "CHECK_INSTRUCTION":
      return {
        ...state,
        instructions: state.instructions.map((instruction) =>
          instruction.id === action.payload.id
            ? { ...instruction, isChecked: !instruction.isChecked }
            : instruction,
        ),
        ingredients: state.ingredients.map((ingredient) =>
          action.payload.ingredientIds.includes(ingredient.id)
            ? { ...ingredient, isChecked: action.payload.checked }
            : ingredient,
        ),
      };

    case "HOVER_INSTRUCTION":
      if (action.payload.ingredientIds.length === 0) return state;

      return {
        ...state,
        ingredients: state.ingredients.map((ingredient) => ({
          ...ingredient,
          isMuted: !action.payload.ingredientIds.includes(ingredient.id),
        })),
      };

    case "CLEAR_HOVER":
      return {
        ...state,
        ingredients: state.ingredients.map((ingredient) => ({
          ...ingredient,
          isMuted: false,
        })),
      };

    default:
      throw new Error("Unknown reducer action!");
  }
}

function createInitialState({
  ingredients,
  instructions,
}: {
  ingredients: IngredientContent[];
  instructions: InstructionContent[];
}): ContentState {
  return {
    ingredients: ingredients.map((ingredient) => ({
      ...ingredient,
      isChecked: false,
      isMuted: false,
    })),
    instructions: instructions.map((instruction) => ({
      ...instruction,
      isChecked: false,
    })),
  };
}

export default function RecipeContent({
  ingredients,
  instructions,
  recipeYield,
  slug,
}: {
  ingredients: IngredientContent[];
  instructions: InstructionContent[];
  recipeYield?: number | null;
  slug: string;
}) {
  // State
  const [state, dispatch] = useReducer(
    contentReducer,
    { ingredients, instructions },
    createInitialState,
  );

  // Servings state
  const defaultServings = recipeYield ?? 4;
  const [servings, setServings] = useState(defaultServings);
  const servingsScale = servings / defaultServings;

  // Keep screen on hook
  const { isLocked, toggleWakeLock } = useScreenWakeLock();

  return (
    <div
      className={cn("flex flex-col gap-4", "sm:grid sm:grid-cols-2 sm:gap-0")}
    >
      <div className="flex flex-col">
        {/* Recipe ingredients */}
        <section className="flex flex-col rounded-xl bg-subtle p-4">
          {/* Header */}
          <div className="flex justify-between border-b border-border pb-3">
            <H2>Ingredienser</H2>
            {/* Portion control */}
            <div className="flex items-center gap-2">
              <Button
                variant={"ghost"}
                className="h-7"
                disabled={servings <= 2}
                onClick={() =>
                  setServings((prevState) =>
                    prevState - defaultServings / 2 > 0
                      ? prevState - defaultServings / 2
                      : prevState,
                  )
                }
              >
                <Minus className="size-5" />
              </Button>
              <span className="flex items-center gap-1 font-medium">
                <ForkKnife className="size-5" />
                {servings}
              </span>
              <Button
                variant="ghost"
                className="h-7"
                onClick={() =>
                  setServings((prevState) =>
                    prevState + defaultServings / 2 > 0
                      ? prevState + defaultServings / 2
                      : prevState,
                  )
                }
              >
                <Plus className="size-5" />
              </Button>
            </div>
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
                      className={cn("inline-flex", {
                        "text-muted-foreground line-through": isChecked,
                      })}
                    >
                      <span>{text}</span>
                      {note && (
                        <span className="text-xs text-muted-foreground no-underline">
                          ({note})
                        </span>
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
      </div>

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
                    <span className="flex h-[1lh] items-center">
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
        <div className="flex justify-end gap-2">
          <Button
            variant={"secondary"}
            onClick={() => {
              navigator.clipboard.writeText(`/recipe/${slug}`);
              toast.success(`Länk kopierad till urklipp`, {
                position: "top-center",
                description: `/recipe/${slug}`, // TODO Add domain to URL
                closeButton: true,
              });
            }}
          >
            <LucideLink />
            <span>Kopiera länk</span>
          </Button>
          <Button
            onClick={() => {}} // TODO Add click handler
          >
            <BookmarkPlus />
            <span>Spara recept</span>
          </Button>
        </div>
      </section>
    </div>
  );
}
