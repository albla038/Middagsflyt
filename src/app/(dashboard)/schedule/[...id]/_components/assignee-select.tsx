"use client";

import { updateAssignee } from "@/app/(dashboard)/schedule/[...id]/actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import UserAvatar from "@/components/user-avatar";
import { HouseholdMember } from "@/lib/types";
import { User } from "better-auth";
import { LoaderCircle } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

type AssigneeSelectProps = {
  assignee: User | null;
  members: HouseholdMember[];
  scheduledRecipeId: string;
  scheduleId: string;
};

export default function AssigneeSelect({
  assignee,
  members,
  scheduledRecipeId,
  scheduleId,
}: AssigneeSelectProps) {
  const [isPending, startTransition] = useTransition();

  function handleAssigneeChange(assigneeId: string) {
    startTransition(async () => {
      const state = await updateAssignee({
        scheduledRecipeId,
        assigneeId: assigneeId,
        scheduleId,
      });

      if (state) {
        if (state.success) {
          toast.success(state.message);
        } else {
          toast.error(state.message);
        }
      }
    });
  }

  return (
    <Select value={assignee?.id} onValueChange={handleAssigneeChange}>
      <SelectTrigger size="sm" className="w-full px-2">
        <SelectValue placeholder="Välj person">
          {isPending ? (
            <div className="flex justify-center">
              <LoaderCircle className="animate-spin" />
            </div>
          ) : (
            assignee && (
              <div className="flex min-w-0 items-center gap-2">
                <UserAvatar user={assignee} className="size-6" />
                <span className="truncate text-xs font-medium">
                  {assignee.name}
                </span>
              </div>
            )
          )}
        </SelectValue>
      </SelectTrigger>

      <SelectContent>
        {members.map((member) => (
          <SelectItem key={member.user.id} value={member.user.id}>
            <div className="flex items-center gap-2">
              <UserAvatar user={member.user} className="size-8" />
              <div className="grid text-left text-sm leading-tight">
                <span className="truncate font-medium">{member.user.name}</span>
                <span className="truncate text-xs">{member.user.email}</span>
              </div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
