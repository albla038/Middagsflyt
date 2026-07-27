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
import { getActionErrorMessage } from "@/lib/error-messages";
import { ShoppingList } from "@/lib/generated/prisma";
import { getQueryClient } from "@/lib/query-client";
import { shoppingListsQueryOptions } from "@/queries/shopping-list/options";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

const queryClient = getQueryClient();

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
      const response = await saveShoppingListAction({
        name: data.name,
        listId: list?.id,
      });

      if (!response.success) {
        const errorMessage = getActionErrorMessage(response.errorCode);
        toast.error(errorMessage);
        return;
      }

      queryClient.invalidateQueries({
        queryKey: shoppingListsQueryOptions().queryKey,
      });

      onClose();

      toast(`"${data.name}" sparades`, {
        action: {
          label: "Till inköpslista",
          onClick: () => router.push(`/shopping-list/${response.data.listId}`),
        },
        richColors: true,
      });
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

            <Field orientation="responsive-reverse">
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
