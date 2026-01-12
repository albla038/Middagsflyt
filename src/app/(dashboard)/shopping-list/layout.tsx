import SortSelectionProvider from "@/app/(dashboard)/shopping-list/sort-selection-provider";
import { ReactNode } from "react";

export default function ShoppingListLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <SortSelectionProvider>{children}</SortSelectionProvider>;
}
