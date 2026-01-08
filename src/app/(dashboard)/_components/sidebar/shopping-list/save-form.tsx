"use client";

import { saveShoppingListAction } from "@/app/(dashboard)/actions";
import {
  ShoppingListForm,
  shoppingListFormSchema,
} from "@/app/(dashboard)/schemas";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { ShoppingList } from "@/lib/generated/prisma";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

type SaveShoppingListFormProps = {
  list?: ShoppingList;
  onClose: () => void;
};

export default function SaveShoppingListForm({
  list,
  onClose,
}: SaveShoppingListFormProps) {
  const today = new Date();
  const dateString = today.toLocaleDateString("sv-SE", {
    month: "short",
    day: "numeric",
  });
  const defaultName = `Att handla ${dateString}`;

  const form = useForm<ShoppingListForm>({
    resolver: zodResolver(shoppingListFormSchema),
    defaultValues: {
      name: list?.name ?? defaultName,
    },
  });

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function onSubmit(data: ShoppingListForm) {
    // Trim whitespace
    data.name = data.name.trim();

    startTransition(async () => {
      const result = await saveShoppingListAction({
        name: data.name,
        listId: list?.id,
      });

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      onClose();
      toast.success(result.message);

      if (result.data) {
        // Navigate to the new shopping list
        router.push(`/shopping-list/${result.data.id}`);
      }
    });
  }

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
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>

            <Field orientation="responsive">
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Spinner /> <span>Sparar...</span>
                  </>
                ) : (
                  <span>Spara</span>
                )}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Avbryt
              </Button>
            </Field>
          </FieldGroup>
        )}
      />
    </form>
  );
}
