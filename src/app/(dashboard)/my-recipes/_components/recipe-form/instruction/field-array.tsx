"use client";

import InstructionFieldRow from "@/app/(dashboard)/my-recipes/_components/recipe-form/instruction/field-row";
import InstructionInput from "@/app/(dashboard)/my-recipes/_components/recipe-form/instruction/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RecipeFormInput, RecipeFormOutput } from "@/lib/schemas/recipe";
import { createId } from "@paralleldrive/cuid2";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { useCallback } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

export default function InstructionFieldArray() {
  const form = useFormContext<RecipeFormInput, unknown, RecipeFormOutput>();

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "recipe.recipeInstructions",
    // Use a different key name to avoid conflicts with the field from the RecipeFormtype
    keyName: "rhfId",
  });

  const handleAddStep = useCallback(
    (text: string) => {
      if (text.trim() === "") return;

      append(
        {
          id: createId(),
          text,
          ingredientIds: [],
        },
        { shouldFocus: false },
      );
    },
    [append],
  );

  return (
    <FieldSet>
      <FieldLegend>Instruktioner</FieldLegend>
      <FieldDescription>Mata in receptets instruktioner.</FieldDescription>

      <FieldGroup className="gap-3">
        {fields.length > 0 && (
          <ScrollArea>
            <div className="overflow-hidden rounded-md border has-aria-invalid:border-destructive">
              <Table className="min-w-xl table-fixed">
                <TableHeader className="bg-muted">
                  <TableRow>
                    <TableHead className="w-12 text-end">Steg</TableHead>
                    <TableHead>Instruktion*</TableHead>
                    <TableHead className="w-64">Ingredienser</TableHead>

                    <TableHead className="w-13">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => remove()}
                            variant="destructive"
                          >
                            <Trash2 /> Rensa alla
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {fields.map((field, index) => (
                    <InstructionFieldRow
                      key={field.rhfId}
                      index={index}
                      isFirst={index === 0}
                      isLast={index === fields.length - 1}
                      onMoveUp={() => move(index, index - 1)}
                      onMoveDown={() => move(index, index + 1)}
                      onRemove={() => remove(index)}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>

            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        )}

        <InstructionInput onAddStep={handleAddStep} />
      </FieldGroup>
    </FieldSet>
  );
}
