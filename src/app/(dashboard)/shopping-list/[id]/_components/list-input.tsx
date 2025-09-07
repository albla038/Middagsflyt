"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Plus, X } from "lucide-react";
import { FormEvent, useState } from "react";

type ListInputProps = {
  onCreateItem: (value: string) => void;
};

export default function ListInput({ onCreateItem }: ListInputProps) {
  const [value, setValue] = useState("");
  const [placeholder, setPlaceholder] = useState("Lägg till vara");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (value.trim() !== "") {
      onCreateItem(value.trim());
      setValue("");
    }
  }

  return (
    <div
      className={cn(
        "sticky bottom-0 border-t border-border bg-background p-3",
        "sm:border-none sm:bg-transparent sm:px-2 sm:pb-6",
      )}
    >
      <form className="relative" onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="bg-background px-9"
          // onKeyDown={(e) => handleSubmit(e.key)}
          onFocus={() => setPlaceholder("Sök")}
          onBlur={() => setPlaceholder("Lägg till vara")}
        />
        <Plus className="absolute top-1/2 left-3 size-4 -translate-y-1/2" />

        {value && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="right- absolute top-1/2 right-1 size-7 -translate-y-1/2 text-muted-foreground"
            onClick={() => setValue("")}
          >
            <X className="size-4" />
          </Button>
        )}
      </form>
    </div>
  );
}
