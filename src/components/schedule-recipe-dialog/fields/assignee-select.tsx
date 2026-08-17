"use client";

import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import UserAvatar from "@/components/user-avatar";
import { HouseholdMember } from "@/lib/schemas/household";
import {
  ScheduleRecipeForm,
  ScheduleRecipeFormInput,
} from "@/lib/schemas/scheduled-recipe";
import { Control, Controller } from "react-hook-form";

type AssigneeSelectFieldProps = {
  control: Control<ScheduleRecipeFormInput, unknown, ScheduleRecipeForm>;
  members: HouseholdMember[] | undefined;
  className?: string;
};

export default function AssigneeSelectField({
  control,
  members,
  className,
}: AssigneeSelectFieldProps) {
  return (
    <Controller
      control={control}
      name="assigneeId"
      render={({ field, fieldState }) => {
        const selectedMember = members?.find(
          (member) => member.user.id === field.value,
        );

        return (
          <Field data-invalid={fieldState.invalid} className={className}>
            <FieldLabel htmlFor={field.name}>Ansvarig</FieldLabel>
            <Select {...field} onValueChange={field.onChange}>
              <SelectTrigger
                id={field.name}
                aria-invalid={fieldState.invalid}
                disabled={!members}
              >
                <SelectValue placeholder="Ange ansvarig">
                  {selectedMember && (
                    <div className="flex min-w-0 items-center gap-2">
                      <UserAvatar
                        user={selectedMember.user}
                        className="size-6"
                      />
                      <span className="truncate text-sm">
                        {selectedMember.user.name}
                      </span>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>

              <SelectContent>
                {members?.map((member) => (
                  <SelectItem key={member.user.id} value={member.user.id}>
                    <UserAvatar user={member.user} />
                    <div className="grid text-left text-sm leading-tight">
                      <span className="truncate font-medium">
                        {member.user.name}
                      </span>
                      <span className="truncate text-xs">
                        {member.user.email}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        );
      }}
    />
  );
}
