"use client";

import RecipeSelectionCard from "@/app/(dashboard)/schedule/[id]/create/_components/recipe-selection-card";
import { scheduleRecipe } from "@/app/(dashboard)/schedule/[id]/create/actions";
import OrderByToggle from "@/components/recipe-list/order-by-toggle";
import SearchBar from "@/components/recipe-list/search-bar";
import SortSelect from "@/components/recipe-list/sort-select";
import ServingsControl from "@/components/servings-control";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import UserAvatar from "@/components/user-avatar";
import { RecipeDisplayContent } from "@/lib/schemas/recipe";
import { HouseholdMember } from "@/lib/types";
import { cn } from "@/lib/utils";
import { format, getISOWeek, getISOWeekYear } from "date-fns";
import { ListFilter, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

type ScheduleRecipeFormProps = {
  scheduleId: string;
  selectedDate: Date;
  recipeData: Promise<RecipeDisplayContent[]>;
  searchQuery: string;
  members: HouseholdMember[];
};

export default function ScheduleRecipeForm({
  scheduleId,
  selectedDate,
  recipeData,
  searchQuery,
  members,
}: ScheduleRecipeFormProps) {
  const router = useRouter();

  // STATE for selected recipe and assignee
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const [assigneeId, setAssigneeId] = useState<string | undefined>(undefined);
  const assignee = members.find(
    (member) => member.user.id === assigneeId,
  )?.user;

  // Servings state
  const [defaultServings, setDefaultServings] = useState(4);
  const [servings, setServings] = useState(defaultServings);

  // Get the list of recipes
  const recipes = use(recipeData);

  const selectedRecipe = recipes.find(
    (recipe) => recipe.id === selectedRecipeId,
  );

  const [state, action, isPending] = useActionState(
    scheduleRecipe.bind(
      null,
      scheduleId,
      selectedRecipeId,
      selectedDate,
      servings,
      assigneeId,
    ),
    null,
  );

  // Sync selected recipe's default servings when it changes
  useEffect(() => {
    if (selectedRecipe && selectedRecipe.recipeYield) {
      setDefaultServings(selectedRecipe.recipeYield);
      setServings(selectedRecipe.recipeYield);
    }
  }, [selectedRecipe]);

  // Display toasts based on action state
  useEffect(() => {
    if (state) {
      if (state.success) {
        const year = getISOWeekYear(selectedDate);
        const week = getISOWeek(selectedDate);
        const searchParams = new URLSearchParams();
        searchParams.set("date", format(selectedDate, "yyyy-MM-dd"));

        router.replace(
          `/schedule/${scheduleId}/${year}/${week}?${searchParams.toString()}`,
        );
        toast.success(state.message);
      } else {
        toast.error(state.message);
      }
    }
  }, [state, router, scheduleId, selectedDate]);

  return (
    <section className="relative flex items-start gap-8">
      <div className="flex w-full flex-col gap-4">
        <div className="flex items-center justify-between gap-2">
          <SearchBar
            placeholder="Sök bland sparade recept..."
            className="w-sm"
          />
          <div className="flex items-center gap-2">
            <OrderByToggle />

            <Button variant="outline" disabled>
              <ListFilter />
              <span>Filtrera</span>
            </Button>

            <SortSelect />
          </div>
        </div>

        {recipes.length === 0 ? (
          searchQuery ? (
            <p>
              Inga recept hittades för{" "}
              <strong>&quot;{searchQuery}&quot;</strong>.
            </p>
          ) : (
            <p>Inga recept hittades.</p>
          )
        ) : (
          <RadioGroup
            value={selectedRecipeId}
            onValueChange={setSelectedRecipeId}
          >
            <ul
              className={cn(
                "grid gap-5",
                "min-[40rem]:grid-cols-2 min-[64rem]:grid-cols-3",
              )}
            >
              {recipes.map((recipe) => (
                <li key={recipe.id}>
                  <RecipeSelectionCard recipe={recipe} />
                </li>
              ))}
            </ul>
          </RadioGroup>
        )}
      </div>

      <form action={action} className="sticky top-20">
        <div className="flex w-full flex-col gap-6 rounded-md bg-accent p-3 md:w-xs">
          <div className="grid gap-3">
            <Label>Antal portioner</Label>

            <div className="grid gap-1">
              <div className="flex h-9 items-center justify-center rounded-md border border-border bg-background">
                <ServingsControl
                  servings={servings}
                  setServings={setServings}
                  defaultServings={defaultServings}
                />
              </div>

              {!state?.success &&
                state?.errors?.servings?.map((errorMessage, idx) => (
                  <p key={idx} className="text-xs text-destructive">
                    {errorMessage}
                  </p>
                ))}
            </div>
          </div>

          <div className="grid gap-3">
            <Label htmlFor="assignee-id">Ansvarig</Label>

            <div className="grid gap-1">
              <Select
                value={assigneeId}
                onValueChange={(assigneeId) => setAssigneeId(assigneeId)}
              >
                <SelectTrigger
                  className="w-full bg-background"
                  id="assignee-id"
                >
                  <SelectValue placeholder="Välj en ansvarig person">
                    {assignee && (
                      <div className="flex items-center gap-2">
                        <UserAvatar user={assignee} className="size-6" />
                        <span className="truncate text-sm">
                          {assignee.name}
                        </span>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>

                <SelectContent>
                  {members.map((member) => (
                    <SelectItem key={member.user.id} value={member.user.id}>
                      <div className="flex items-center gap-2">
                        <UserAvatar user={member.user} />
                        <div className="grid text-left text-sm leading-tight">
                          <span className="truncate font-medium">
                            {member.user.name}
                          </span>
                          <span className="truncate text-xs">
                            {member.user.email}
                          </span>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {!state?.success &&
                state?.errors?.assigneeId?.map((errorMessage, idx) => (
                  <p key={idx} className="text-xs text-destructive">
                    {errorMessage}
                  </p>
                ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Label htmlFor="note">Fritext</Label>

            <div className="flex flex-col gap-1">
              <Textarea
                id="note"
                name="note"
                placeholder="Valfri fritext"
                aria-invalid={!state?.success && !!state?.errors?.note}
                className="bg-background"
              />

              {!state?.success &&
                state?.errors?.note?.map((errorMessage, idx) => (
                  <p key={idx} className="text-xs text-destructive">
                    {errorMessage}
                  </p>
                ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Avbryt
            </Button>
            <Button type="submit" disabled={!selectedRecipe || isPending}>
              {isPending ? (
                <>
                  <LoaderCircle className="animate-spin" />
                  <span>Sparar...</span>
                </>
              ) : (
                <span>Spara</span>
              )}
            </Button>
          </div>
        </div>
      </form>
    </section>
  );
}
