"use client";

import DetailsFieldSet from "@/app/(dashboard)/my-recipes/_components/recipe-form/details-field-set";
import GeneralDetailsFieldSet from "@/app/(dashboard)/my-recipes/_components/recipe-form/general-details-field-set";
import IngredientFieldArray from "@/app/(dashboard)/my-recipes/_components/recipe-form/ingredient/field-array";
import InstructionFieldArray from "@/app/(dashboard)/my-recipes/_components/recipe-form/instruction/field-array";
import VisibilityFieldSet from "@/app/(dashboard)/my-recipes/_components/recipe-form/visibility-field-set";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldSeparator } from "@/components/ui/field";
import {
  RecipeFormInput,
  RecipeFormOutput,
  recipeFormSchema,
} from "@/lib/schemas/recipe";
import { IngredientWithAlias } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "better-auth";
import { use } from "react";
import { FieldErrors, FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

const initialFormValues = {
  name: "",
  description: "",
  recipeYield: "4",
  imageUrl: "",
  recipeType: "HUVUDRÄTT",
  proteinType: "",
  totalTimeSeconds: "",
  oven: "",
  originalAuthor: "",
  sourceUrl: "",
  recipeIngredients: [],
  recipeInstructions: [],
  status: "DRAFT",
  isPublic: true,
} satisfies RecipeFormInput["recipe"];

type RecipeFormProps = {
  user: User;
  ingredientsPromise: Promise<IngredientWithAlias[]>;
  defaultValues?: RecipeFormInput;
};

export default function RecipeForm({
  user,
  ingredientsPromise,
  defaultValues,
}: RecipeFormProps) {
  const form = useForm<RecipeFormInput, unknown, RecipeFormOutput>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: defaultValues ?? {
      action: "DRAFT",
      recipe: initialFormValues,
    },
  });

  const ingredients = use(ingredientsPromise);

  function handleSubmit(data: RecipeFormOutput) {
    // TODO: Check if originalAuthor === user.name ? null : originalAuthor
    console.log(data);
  }

  function handleFormError(errors: FieldErrors<RecipeFormInput>) {
    const recipeErrors = errors.recipe;

    const ingredientsError = recipeErrors?.recipeIngredients?.message;
    if (ingredientsError) {
      toast.error(ingredientsError);
    }

    const instructionsError = recipeErrors?.recipeInstructions?.message;
    if (instructionsError) {
      toast.error(instructionsError);
    }
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit, handleFormError)}>
        <FieldGroup>
          <div className="contents grid-rows-2 md:grid md:grid-flow-col md:grid-cols-2 md:grid-rows-[auto_auto] md:content-start md:gap-7">
            <GeneralDetailsFieldSet user={user} />

            <VisibilityFieldSet />

            {/* ImageUploaderField / Attachment */}
            <Field className="h-32 rounded-md bg-secondary" />

            <DetailsFieldSet />
          </div>

          <FieldSeparator />

          <IngredientFieldArray ingredients={ingredients} />

          <FieldSeparator />

          <InstructionFieldArray />

          {/* Form action buttons */}
          <Field orientation="responsive">
            <Button
              type="submit"
              disabled={!form.formState.isDirty}  
              onClick={() => form.setValue("action", "PUBLISH")}
            >
              Publicera recept
            </Button>
            <Button
              variant="outline"
              disabled={!form.formState.isDirty}  
              type="submit"
              onClick={() => form.setValue("action", "DRAFT")}
            >
              Spara som utkast
            </Button>
            <Button variant="ghost" type="button">
              Avbryt
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </FormProvider>
  );
}
