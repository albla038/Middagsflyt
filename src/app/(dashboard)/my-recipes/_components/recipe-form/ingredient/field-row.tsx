"use client";

import IngredientIdField from "@/app/(dashboard)/my-recipes/_components/recipe-form/ingredient/id-field";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableCell, TableRow } from "@/components/ui/table";
import { Unit } from "@/lib/generated/prisma/enums";
import { RecipeFormInput, RecipeFormOutput } from "@/lib/schemas/recipe";
import { IngredientWithAlias } from "@/lib/types";
import Fuse from "fuse.js";
import { ArrowDown, ArrowUp, MoreHorizontal, Trash2 } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";

const unitOptions = Object.values(Unit).map((unit) => ({
  value: unit,
  label: unit.toLowerCase(),
}));

type IngredientFieldRowProps = {
  index: number;
  ingredients: IngredientWithAlias[];
  fuse: Fuse<IngredientWithAlias>;
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
};

export default function IngredientFieldRow({
  index,
  ingredients,
  fuse,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  onRemove,
}: IngredientFieldRowProps) {
  const form = useFormContext<RecipeFormInput, unknown, RecipeFormOutput>();

  return (
    <TableRow className="*:align-top">
      {/* Quantity input */}
      <TableCell>
        <Controller
          control={form.control}
          name={`recipe.recipeIngredients.${index}.quantity`}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                className="border-none p-0 text-end shadow-none focus-visible:ring-0"
              />
              {fieldState.error && (
                <FieldError errors={[fieldState.error]} className="text-wrap" />
              )}
            </Field>
          )}
        />
      </TableCell>

      {/* Unit select */}
      <TableCell>
        <Controller
          control={form.control}
          name={`recipe.recipeIngredients.${index}.unit`}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Select {...field} onValueChange={field.onChange}>
                <SelectTrigger
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                >
                  <SelectValue placeholder="Välj enhet" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="">-</SelectItem>
                  {unitOptions.map((option) => (
                    <SelectItem
                      key={`${field.name}-${option.value}`}
                      value={option.value}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </TableCell>

      {/* Text input */}
      <TableCell>
        <Controller
          control={form.control}
          name={`recipe.recipeIngredients.${index}.text`}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                className="border-none p-0 shadow-none focus-visible:ring-0 aria-invalid:border"
              />
              {fieldState.error && (
                <FieldError errors={[fieldState.error]} className="text-wrap" />
              )}
            </Field>
          )}
        />
      </TableCell>

      {/* Note input */}

      <TableCell>
        <Controller
          control={form.control}
          name={`recipe.recipeIngredients.${index}.note`}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                className="border-none p-0 shadow-none focus-visible:ring-0"
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </TableCell>

      {/* Ingredient ID combobox */}
      <TableCell>
        <IngredientIdField
          index={index}
          fuse={fuse}
          ingredients={ingredients}
        />
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
