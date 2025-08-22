import { Button } from "@/components/ui/button";
import { ForkKnife, Minus, Plus } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

type ServingControlProps = {
  servings: number;
  setServings: Dispatch<SetStateAction<number>>;
  defaultServings: number;
};

export default function ServingsControl({
  servings,
  setServings,
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
          setServings((prevState) =>
            prevState - defaultServings / 2 > 0
              ? prevState - defaultServings / 2
              : prevState,
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
          setServings((prevState) =>
            prevState + defaultServings / 2 > 0
              ? prevState + defaultServings / 2
              : prevState,
          )
        }
      >
        <Plus className="size-5" />
      </Button>
    </div>
  );
}
