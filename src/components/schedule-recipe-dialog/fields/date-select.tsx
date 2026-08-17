"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  ScheduleRecipeForm,
  ScheduleRecipeFormInput,
} from "@/lib/schemas/scheduled-recipe";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { ChevronDown } from "lucide-react";
import { Control, Controller } from "react-hook-form";

type DateSelectFieldProps = {
  control: Control<ScheduleRecipeFormInput, unknown, ScheduleRecipeForm>;
  className?: string;
};

export default function DateSelectField({
  control,
  className,
}: DateSelectFieldProps) {
  const isMobile = useIsMobile();

  return (
    <Controller
      control={control}
      name="date"
      render={({ field, fieldState }) => (
        <Field
          data-invalid={fieldState.invalid}
          className={cn("w-auto", className)}
        >
          <FieldLabel htmlFor={field.name}>Datum</FieldLabel>

          {isMobile ? (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  data-empty={!field.value}
                  className="justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
                >
                  {field.value ? (
                    <span className="truncate">
                      {format(field.value, "PPP ('v.' w)", { locale: sv })}
                    </span>
                  ) : (
                    <span>Ange ett datum</span>
                  )}
                  <ChevronDown />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  {...field}
                  id={field.name}
                  selected={field.value}
                  onSelect={field.onChange}
                  mode="single"
                  locale={sv}
                  showWeekNumber
                  fixedWeeks
                />
              </PopoverContent>
            </Popover>
          ) : (
            <Calendar
              {...field}
              id={field.name}
              selected={field.value}
              onSelect={field.onChange}
              mode="single"
              locale={sv}
              showWeekNumber
              fixedWeeks
              className="rounded-lg border border-border p-2 shadow-xs"
            />
          )}

          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
