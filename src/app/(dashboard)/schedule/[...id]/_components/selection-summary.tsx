"use client";

import { useSelection } from "@/app/(dashboard)/schedule/[...id]/selection-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import H2 from "@/components/ui/typography/h2";
import { X } from "lucide-react";

type SelectionSummaryProps = {
  scheduleId: string;
};

export default function SelectionSummary({
  scheduleId,
}: SelectionSummaryProps) {
  const { selectionState, dispatch } = useSelection();

  const currentSelection = selectionState[scheduleId] ?? [];

  if (currentSelection.length === 0) {
    return null;
  }

  return (
    <Card className="sticky bottom-16 left-2 mt-auto w-full gap-4 bg-primary-foreground/95 md:max-w-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <H2 className="leading-none">Valda recept</H2>
          <Button
            variant="link"
            className="text-foreground"
            onClick={() =>
              dispatch({ type: "CLEAR_ALL", payload: { scheduleId } })
            }
          >
            Rensa alla ({currentSelection.length})
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <ul className="flex flex-wrap gap-2">
          {currentSelection.map((recipe) => (
            <li key={recipe.id}>
              <Badge
                variant="outline"
                className="cursor-pointer"
                onClick={() =>
                  dispatch({
                    type: "TOGGLE_RECIPE",
                    payload: {
                      scheduleId,
                      scheduledRecipe: recipe,
                    },
                  })
                }
              >
                {recipe.name}
                <X />
              </Badge>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
