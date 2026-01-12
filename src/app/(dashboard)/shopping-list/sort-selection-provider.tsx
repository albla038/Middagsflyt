"use client";

import { useLocalStorage } from "@/hooks/use-local-storage";
import { createContext, ReactNode, useContext, useState } from "react";

type SortSelectionProvider = {
  isGroupedByCategory: boolean;
  setGroupedByCategory: (grouped: boolean) => void;
};

const SortSelectionContext = createContext<SortSelectionProvider | undefined>(
  undefined,
);

export default function SortSelectionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isGroupedByCategory, setGroupedByCategory] = useLocalStorage(
    "shopping-list-isGroupedByCategory",
    false,
  );

  return (
    <SortSelectionContext value={{ isGroupedByCategory, setGroupedByCategory }}>
      {children}
    </SortSelectionContext>
  );
}

export function useSortSelection() {
  const context = useContext(SortSelectionContext);

  if (!context) {
    throw new Error("useSortSelection must be used within a SelectionProvider");
  }

  return context;
}
