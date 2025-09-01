"use client";

import { useShoppingList } from "@/hooks/queries/shopping-list/queries";

type ShoppingListProps = {
  listId: string;
};

export default function ShoppingList({ listId }: ShoppingListProps) {
  const { data: list, isPending, error } = useShoppingList(listId);

  if (isPending) return <div>Loading...</div>; // TODO improve
  if (error) return <p className="text-destructive">{error.message}</p>; // TODO improve

  const { items } = list;

  return (
    <div>
      <pre>{JSON.stringify(items, null, 2)}</pre>
    </div>
  );
}
