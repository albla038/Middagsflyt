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
import { Unit } from "@/lib/generated/prisma";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ShoppingListItemEditForm,
  shoppingListItemEditFormSchema,
  ShoppingListItemResponse,
} from "@/lib/schemas/shopping-list";
import { useUpdateShoppingListItem } from "@/queries/shopping-list/use-update-shopping-list-item";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

type EditItemFormProps = {
  listId: string;
  item: ShoppingListItemResponse;
  categories: { id: string; name: string }[];
  onClose: () => void;
};

const unitList = Object.values(Unit);

export default function EditItemForm({
  listId,
  item,
  categories,
  onClose,
}: EditItemFormProps) {
  // Shopping list item mutation
  const { mutate: updateItem } = useUpdateShoppingListItem(listId);

  const form = useForm<ShoppingListItemEditForm>({
    resolver: zodResolver(shoppingListItemEditFormSchema),
    defaultValues: item,
  });

  function onSubmit(data: ShoppingListItemEditForm) {
    // Don't do anything if no changes were made
    if (!form.formState.isDirty) return;

    updateItem({ itemId: item.id, data });
    onClose();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="mt-2">
      <FieldGroup className="gap-4">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          {/* Name */}
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="h-[87.25px]">
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
                <FieldError
                  errors={[fieldState.error]}
                  className="-mt-2 text-xs"
                />
              </Field>
            )}
          />

          {/* Category */}
          <Controller
            name="categoryId"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="h-[87.25px]">
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
                <FieldError
                  errors={[fieldState.error]}
                  className="-mt-2 text-xs"
                />
              </Field>
            )}
          />

          {/* Quantity */}
          <Controller
            name="quantity"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="h-[87.25px]">
                <FieldLabel htmlFor={field.name}>Mängd</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  type="number"
                  step={0.5}
                  placeholder="Ange mängd"
                  autoComplete="off"
                  value={field.value ?? ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value === "" ? null : Number(value));
                  }}
                  aria-invalid={fieldState.invalid}
                />
                <FieldError
                  errors={[fieldState.error]}
                  className="-mt-2 text-xs"
                />
              </Field>
            )}
          />

          {/* Unit */}
          <Controller
            name="unit"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="h-[87.25px]">
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
                <FieldError
                  errors={[fieldState.error]}
                  className="-mt-2 text-xs"
                />
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
