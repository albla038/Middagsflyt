"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { RecipeFormInput, RecipeFormOutput } from "@/lib/schemas/recipe";
import { CornerDownLeft } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

type InstructionInputProps = {
  onAddStep: (stepText: string) => void;
};

export default function InstructionInput({ onAddStep }: InstructionInputProps) {
  const form = useFormContext<RecipeFormInput, unknown, RecipeFormOutput>();
  const [nextStepText, setNextStepText] = useState("");

  const recipeInstructions = form.watch("recipe.recipeInstructions");

  return (
    <InputGroup>
      <InputGroupTextarea
        value={nextStepText}
        onChange={(e) => setNextStepText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            e.stopPropagation();
            onAddStep(nextStepText);
            setNextStepText("");
          }
        }}
        autoComplete="off"
        placeholder={`Beskriv steg ${recipeInstructions.length + 1}...`}
        className="min-h-lh"
      />
      <InputGroupAddon align="block-end">
        <InputGroupButton
          variant="default"
          type="button"
          size="sm"
          className="ml-auto"
          onClick={() => {
            onAddStep(nextStepText);
            setNextStepText("");
          }}
        >
          Lägg till <CornerDownLeft />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
}
