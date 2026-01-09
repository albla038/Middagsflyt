import z from "zod";

export const shoppingListFormSchema = z.object({
  listId: z.cuid2().optional(),
  name: z
    .string("Ange ett giltigt namn")
    .min(1, "Namnet måste ha minst en bokstav")
    .max(50, "Namnet får ha max 50 bokstäver"),
});

export type ShoppingListForm = z.infer<typeof shoppingListFormSchema>;

export const shoppingListDeleteSchema = z.object({
  listId: z.cuid2(),
});

export type ShoppingListDelete = z.infer<typeof shoppingListDeleteSchema>;
