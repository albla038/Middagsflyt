"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useShoppingList } from "@/hooks/queries/shopping-list/queries";
import { Unit } from "@/lib/generated/prisma";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ShoppingListItemEditForm,
  shoppingListItemEditFormSchema,
} from "@/lib/schemas/shopping-list";
import { useUpdateShoppingListItem } from "@/hooks/queries/shopping-list/mutations";
import { Activity, useEffect } from "react";
import { toast } from "sonner";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

type EditItemFormProps = {
  listId: string;
  itemId: string | null;
  categories: { id: string; name: string }[];
  onClose: () => void;
};

const unitList = Object.values(Unit);

export default function EditItemForm({
  listId,
  itemId,
  categories,
  onClose,
}: EditItemFormProps) {
  // Query hook
  const { data: list, isPending, error } = useShoppingList(listId);
  const item = list?.items.find((item) => item.id === itemId);

  // Mutation hooks
  const { mutate: updateItem } = useUpdateShoppingListItem(listId);

  const form = useForm<ShoppingListItemEditForm>({
    resolver: zodResolver(shoppingListItemEditFormSchema),
    defaultValues: item,
  });

  // Sync form values when item is loaded or changes
  useEffect(() => {
    if (item) {
      form.reset(item);
    }
  }, [item, form.reset]);

  if (isPending) {
    return <p>Läser in...</p>; // TODO improve all error and loading states
  }

  if (error) {
    return <p className="text-destructive">{error.message}</p>; // TODO improve
  }

  if (!item) {
    return <p>Kunde inte hitta varan...</p>; // TODO improve
  }

  function onSubmit(data: ShoppingListItemEditForm) {
    // Don't do anything if no changes were made
    if (!form.formState.isDirty) return;

    if (item) {
      updateItem({ itemId: item.id, data });
      onClose();
    } else {
      toast.error("Något gick fel. Vänligen försök igen.");
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <div className="grid grid-cols-2 gap-x-3 gap-y-4">
          {/* Name */}
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Namn</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  type="text"
                  placeholder="Ange namn"
                  autoFocus
                  autoComplete="off"
                  aria-invalid={fieldState.invalid}
                />
                <Activity mode={fieldState.invalid ? "visible" : "hidden"}>
                  <FieldError errors={[fieldState.error]} />
                </Activity>
              </Field>
            )}
          />

          {/* Category */}
          <Controller
            name="categoryId"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Kategori</FieldLabel>
                <Select
                  {...field}
                  value={field.value ?? ""}
                  onValueChange={(value) =>
                    field.onChange(value === "" ? null : value)
                  }
                >
                  <SelectTrigger
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    className="w-full truncate"
                  >
                    <SelectValue placeholder="Övrigt" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Activity mode={fieldState.invalid ? "visible" : "hidden"}>
                  <FieldError errors={[fieldState.error]} />
                </Activity>
              </Field>
            )}
          />

          {/* Quantity */}
          <Controller
            name="quantity"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Mängd</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  type="number"
                  step={0.5}
                  min={0.5}
                  placeholder="Ange mängd"
                  autoComplete="off"
                  value={field.value ?? ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value === "" ? null : Number(value));
                  }}
                  aria-invalid={fieldState.invalid}
                />
                <Activity mode={fieldState.invalid ? "visible" : "hidden"}>
                  <FieldError errors={[fieldState.error]} />
                </Activity>
              </Field>
            )}
          />

          {/* Unit */}
          <Controller
            name="unit"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Enhet</FieldLabel>
                <Select
                  {...field}
                  value={field.value ?? ""}
                  onValueChange={(value) =>
                    field.onChange(value === "" ? null : value)
                  }
                >
                  <SelectTrigger
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    className="w-full truncate"
                  >
                    <SelectValue placeholder="Välj enhet" />
                  </SelectTrigger>

                  <SelectContent>
                    {unitList.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit.toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Activity mode={fieldState.invalid ? "visible" : "hidden"}>
                  <FieldError errors={[fieldState.error]} />
                </Activity>
              </Field>
            )}
          />
        </div>

        <Field orientation="responsive-reverse">
          <Button type="submit" disabled={!form.formState.isDirty}>
            Spara
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Avbryt
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
