"use client";

import IngredientIdsField from "@/app/(dashboard)/my-recipes/_components/recipe-form/instruction/ids-field";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Field, FieldError } from "@/components/ui/field";
import { TableCell, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { RecipeFormInput, RecipeFormOutput } from "@/lib/schemas/recipe";
import { ArrowDown, ArrowUp, MoreHorizontal, Trash2 } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";

type InstructionFieldRowProps = {
  index: number;
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
};

export default function InstructionFieldRow({
  index,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  onRemove,
}: InstructionFieldRowProps) {
  const form = useFormContext<RecipeFormInput, unknown, RecipeFormOutput>();

  return (
    <TableRow>
      <TableCell className="text-end">{index + 1}</TableCell>

      <TableCell className="h-full">
        <Controller
          control={form.control}
          name={`recipe.recipeInstructions.${index}.text`}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Textarea
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Beskriv instruktionen..."
                className="min-h-fit resize-none"
              />
              {fieldState.error && (
                <FieldError errors={[fieldState.error]} className="text-wrap" />
              )}
            </Field>
          )}
        />
      </TableCell>

      <TableCell>
        <IngredientIdsField index={index} />
      </TableCell>

      {/* Action dropdown menu */}
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="ghost" size="icon">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onRemove} variant="destructive">
              <Trash2 /> Ta bort
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onMoveUp} disabled={isFirst}>
              <ArrowUp /> Flytta upp
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onMoveDown} disabled={isLast}>
              <ArrowDown /> Flytta ned
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
