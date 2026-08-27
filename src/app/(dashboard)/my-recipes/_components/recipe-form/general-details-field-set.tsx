"use client";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { RecipeFormInput, RecipeFormOutput } from "@/lib/schemas/recipe";
import { User } from "better-auth";
import { useCallback, useRef, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

type GeneralDetailsFieldSetProps = {
  user: User;
};

export default function GeneralDetailsFieldSet({
  user,
}: GeneralDetailsFieldSetProps) {
  const form = useFormContext<RecipeFormInput, unknown, RecipeFormOutput>();

  const [isAuthorToggled, setIsAuthorToggled] = useState(
    // Initialize based on whether the originalAuthor field has a value
    () => form.getValues("recipe.originalAuthor") !== "",
  );

  const authorBackup = useRef("");
  const sourceUrlBackup = useRef("");

  const handleAuthorToggle = useCallback(
    (checked: boolean) => {
      setIsAuthorToggled(checked);

      if (!checked) {
        // Save backup and clear form
        authorBackup.current = form.getValues("recipe.originalAuthor");
        sourceUrlBackup.current = form.getValues("recipe.sourceUrl");

        form.setValue("recipe.originalAuthor", "", { shouldDirty: true });
        form.setValue("recipe.sourceUrl", "", { shouldDirty: true });
      } else {
        // Restore from backup
        form.setValue("recipe.originalAuthor", authorBackup.current, {
          shouldDirty: true,
        });
        form.setValue("recipe.sourceUrl", sourceUrlBackup.current, {
          shouldDirty: true,
        });
      }
    },
    [form],
  );

  return (
    <FieldSet>
      <FieldGroup className="gap-4">
        {/* Name input */}
        <Controller
          control={form.control}
          name="recipe.name"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Namn*</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Ange ett namn/titel på receptet"
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Description textarea */}
        <Controller
          control={form.control}
          name="recipe.description"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Beskrivning</FieldLabel>
              <Textarea
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Ange en beskrivning"
                className="min-h-20 resize-none"
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Author */}
        <Controller
          control={form.control}
          name="recipe.originalAuthor"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="relative">
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor={field.name}>Receptförfattare</FieldLabel>
                <Switch
                  checked={isAuthorToggled}
                  size="sm"
                  onCheckedChange={handleAuthorToggle}
                />
              </div>

              <Input
                {...field}
                value={field.value}
                id={field.name}
                aria-invalid={fieldState.invalid}
                disabled={!isAuthorToggled}
                placeholder={
                  isAuthorToggled ? "t.ex. Markus Aujalay" : user.name
                }
              />

              <FieldDescription>
                Lägg gärna till den ursprungliga författaren av receptet om du
                hämtar det från någon annan.
              </FieldDescription>
              {fieldState.error && <FieldError errors={[fieldState.error]} />}

              {/* Hidden clickable div to enable click anywhere to toggle input */}
              {!isAuthorToggled && (
                <div
                  className="absolute inset-0"
                  role="button"
                  onClick={() => handleAuthorToggle(true)}
                />
              )}
            </Field>
          )}
        />

        {/* Source URL */}
        {isAuthorToggled && (
          <Controller
            control={form.control}
            name="recipe.sourceUrl"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Länk</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="https://recept.se/... (valfritt)"
                />
                <FieldDescription>
                  Länka till receptets källa om du vet var det kommer ifrån.
                </FieldDescription>
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        )}
      </FieldGroup>
    </FieldSet>
  );
}
