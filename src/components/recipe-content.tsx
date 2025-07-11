"use client";

import { Button } from "@/components/ui/button";
import H2 from "@/components/ui/typography/h2";
import { RecipeIngredient, RecipeInstruction } from "@/lib/generated/prisma";
import { formatQuantityDecimal } from "@/lib/utils";
import { CalendarPlus, ForkKnife, ListPlus, Minus, Plus } from "lucide-react";

export default function RecipeContent({
  ingredients,
  instructions,
  recipeYield,
}: {
  ingredients: RecipeIngredient[];
  instructions: RecipeInstruction[];
  recipeYield?: number | null;
}) {


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
            onClick={() => {}} // TODO Add click handler
          >
            <Minus className="size-5" />
          </Button>
          <span className="flex items-center gap-1 font-medium">
            <ForkKnife className="size-5" />
            {recipeYield ?? 4}
          </span>
          <Button
            variant="ghost"
            className="h-7"
            onClick={() => {}} // TODO Add click handler
          >
            <Plus className="size-5" />
          </Button>
        </div>
      </div>

      {/* Ingredients list */}
      <ul>
        {ingredients.map((ingredient) => {
          const { id, quantity, unit, text, note } = ingredient;
          return (
            <li key={id} className="flex gap-1">
              {quantity && (
                <span className="font-medium">
                  {formatQuantityDecimal(quantity)}
                </span>
              )}
              {unit && unit !== "ST" && (
                <span className="font-medium">{unit.toLowerCase()}</span>
              )}
              <p>{text}</p>
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
