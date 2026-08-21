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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { RecipeFormInput, RecipeFormOutput } from "@/lib/schemas/recipe";
import { User } from "better-auth";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

type GeneralDetailsFieldSetProps = {
  user: User;
};

export default function GeneralDetailsFieldSet({
  user,
}: GeneralDetailsFieldSetProps) {
  const form = useFormContext<RecipeFormInput, unknown, RecipeFormOutput>();

  const [isAuthorSwitchChecked, setIsAuthorSwitchChecked] = useState(false);

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
                placeholder="Ange ett namn"
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
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Receptförfattare</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  {...field}
                  value={field.value}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  disabled={!isAuthorSwitchChecked}
                  placeholder={
                    isAuthorSwitchChecked ? "t.ex. Markus Aujalay" : user.name
                  }
                />
                <InputGroupAddon align="inline-end">
                  {/* // TODO: Can I extend hitbox when input is disabled? */}
                  <Switch
                    checked={isAuthorSwitchChecked}
                    onCheckedChange={(checked) => {
                      setIsAuthorSwitchChecked(checked);
                      if (!checked) {
                        // Clear the values if the user turns the switch off
                        form.setValue("recipe.originalAuthor", "");
                        form.setValue("recipe.sourceUrl", "");
                      }
                    }}
                  />
                </InputGroupAddon>
              </InputGroup>
              <FieldDescription>
                Lägg gärna till den ursprungliga författaren av receptet om du
                hämtar det från någon annan.
              </FieldDescription>
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Source URL */}
        {isAuthorSwitchChecked && (
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
