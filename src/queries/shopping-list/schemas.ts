import z from "zod";

export const shoppingListItemsDeleteSchema = z.object({
  listId: z.cuid2(),
  itemIds: z.array(z.cuid2()),
});

export type ShoppingListItemsDelete = z.infer<
  typeof shoppingListItemsDeleteSchema
>;
