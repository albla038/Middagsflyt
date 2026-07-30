import { Button } from "@/components/ui/button";
import { ForkKnife, Minus, Plus } from "lucide-react";

type ServingControlProps = {
  servings: number;
  onServingsChange: (value: number) => void;
  defaultServings: number;
};

export default function ServingsControl({
  servings,
  onServingsChange,
  defaultServings,
}: ServingControlProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant={"ghost"}
        className="h-7"
        disabled={servings <= 1}
        onClick={() =>
          onServingsChange(
            servings - defaultServings / 2 > 0
              ? servings - defaultServings / 2
              : servings,
          )
        }
      >
        <Minus className="size-5" />
      </Button>
      <span className="flex items-center gap-1 font-medium">
        <ForkKnife className="size-4" />
        {servings}
      </span>
      <Button
        type="button"
        variant="ghost"
        className="h-7"
        onClick={() =>
          onServingsChange(
            servings + defaultServings / 2 > 0
              ? servings + defaultServings / 2
              : servings,
          )
        }
      >
        <Plus className="size-5" />
      </Button>
    </div>
  );
}
