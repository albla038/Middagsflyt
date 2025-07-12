"use client";

import { Button } from "@/components/ui/button";
import H2 from "@/components/ui/typography/h2";
import { Unit } from "@/lib/generated/prisma";
import { cn, formatQuantityDecimal } from "@/lib/utils";
import { CalendarPlus, ForkKnife, ListPlus, Minus, Plus } from "lucide-react";
import { useReducer, useState } from "react";

type IngredientContent = {
  id: string;
  displayOrder: number;
  text: string;
  note: string | null;
  quantity: number | null;
  unit: Unit | null;
};

type InstructionContent = {
  id: string;
  step: number;
  text: string;
  recipeIngredients: string[];
};

type ContentState = {
  ingredients: (IngredientContent & {
    isChecked: boolean;
    isFocused: boolean;
  })[];
  instructions: (InstructionContent & {
    isChecked: boolean;
    isFocused: boolean;
  })[];
  isHovering: boolean;
};

type ContentAction =
  | {
      type: "CHECK_INGREDIENT";
      payload: { id: string };
    }
  | {
      type: "CHECK_INSTRUCTION";
      payload: { id: string; ingredientIds: string[] };
    }
  | {
      type: "HOVER_INSTRUCTION";
      payload: { isHovering: boolean; id: string; ingredientIds: string[] };
    };

function contentReducer(
  state: ContentState,
  action: ContentAction,
): ContentState {
  const { type, payload } = action;

  switch (type) {
    case "CHECK_INGREDIENT":
      return {
        ...state,
        ingredients: state.ingredients.map((ingredient) =>
          ingredient.id === payload.id
            ? { ...ingredient, isChecked: !ingredient.isChecked }
            : ingredient,
        ),
      };
    case "CHECK_INSTRUCTION":
      return {
        ...state,
        instructions: state.instructions.map((instruction) =>
          instruction.id === payload.id
            ? { ...instruction, isChecked: !instruction.isChecked }
            : instruction,
        ),
        ingredients: state.ingredients.map((ingredient) =>
          ingredient.id in payload.ingredientIds
            ? { ...ingredient, isChecked: true }
            : ingredient,
        ),
      };
    case "HOVER_INSTRUCTION":
      return state;
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
      isFocused: false,
    })),
    instructions: instructions.map((instruction) => ({
      ...instruction,
      isChecked: false,
      isFocused: false,
    })),
    isHovering: false,
  };
}

export default function RecipeContent({
  ingredients,
  instructions,
  recipeYield,
}: {
  ingredients: IngredientContent[];
  instructions: InstructionContent[];
  recipeYield?: number | null;
}) {
  const [state, dispatch] = useReducer(
    contentReducer,
    { ingredients, instructions },
    createInitialState,
  );
  const defaultServings = recipeYield ?? 4;
  const [servings, setServings] = useState(defaultServings);
  const servingsScale = servings / defaultServings;

  return (
    <section className="flex flex-col gap-3 rounded-xl bg-zinc-50 p-4">
      {/* Header */}
      <div className="flex justify-between border-b border-border pb-3">
        <H2>Ingredienser</H2>
        {/* Portion control */}
        <div className="flex items-center gap-2">
          <Button
            variant={"ghost"}
            className="h-7"
            onClick={() =>
              setServings((prevState) =>
                prevState - 2 > 0 ? prevState - 2 : prevState,
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
                prevState + 2 > 0 ? prevState + 2 : prevState,
              )
            }
          >
            <Plus className="size-5" />
          </Button>
        </div>
      </div>

      {/* Ingredients list */}
      <ul>
        {state.ingredients.map((ingredient) => {
          const { id, quantity, unit, text, note, isChecked } = ingredient;
          return (
            <li
              key={id}
              className={cn(
                "w-fit hover:cursor-pointer",
                "*:after:content-['_']",
                {
                  "text-muted-foreground line-through": isChecked,
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
              <p className="inline">{text}</p>
              {note && (
                <span className="text-xs text-muted-foreground">({note})</span>
              )}
            </li>
          );
        })}
      </ul>

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
  );
}
