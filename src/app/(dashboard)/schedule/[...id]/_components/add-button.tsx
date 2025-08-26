"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CalendarClock, NotebookPen, Plus } from "lucide-react";

type AddButtonProps = {
  onAddRecipe: () => void;
  onAddNote: () => void;
};

export default function AddButton({ onAddRecipe, onAddNote }: AddButtonProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-lg">
          <Plus />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuItem onSelect={onAddRecipe}>
          <CalendarClock />
          Schemalägg recept
        </DropdownMenuItem>

        <DropdownMenuItem onSelect={() => setTimeout(onAddNote, 0)}>
          <NotebookPen />
          Skapa anteckning
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
