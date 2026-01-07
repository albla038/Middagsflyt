"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  ShoppingListCreateForm,
  shoppingListCreateFormSchema,
} from "@/lib/schemas/shopping-list";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

export default function CreateShoppingListForm() {
  const today = new Date();
  const dateString = today.toLocaleDateString("sv-SE", {
    month: "short",
    day: "numeric",
  });
  const defaultName = `Att handla ${dateString}`;

  const form = useForm<ShoppingListCreateForm>({
    resolver: zodResolver(shoppingListCreateFormSchema),
    defaultValues: {
      name: defaultName,
    },
  });

  function onSubmit(data: ShoppingListCreateForm) {}

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Controller
        name="name"
        control={form.control}
        render={({ field, fieldState }) => (
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor={field.name}>Namn</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder={defaultName}
                required
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>

            <Field orientation="responsive">
              <Button type="submit">Spara</Button>
              <Button type="button" variant="outline">
                Avbryt
              </Button>
            </Field>
          </FieldGroup>
        )}
      />
    </form>
  );
}
