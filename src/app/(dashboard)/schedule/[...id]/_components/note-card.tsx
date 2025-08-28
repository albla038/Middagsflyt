"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScheduledNoteDisplayContent } from "@/lib/types";
import { Edit, MoreVertical, Trash2 } from "lucide-react";

type NoteCardProps = {
  note: ScheduledNoteDisplayContent;
  onEdit: (note: ScheduledNoteDisplayContent) => void;
  onDelete: (noteId: string) => void;
};

export default function NoteCard({ note, onEdit, onDelete }: NoteCardProps) {
  return (
    <article className="flex flex-col gap-2 rounded-md border border-border p-3">
      <div className="flex flex-col gap-1">
        <div className="flex items-start justify-between text-sm">
          <h3 className="truncate font-medium tracking-tight text-wrap break-all">
            {note.title}
          </h3>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-5">
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start" side="right" sideOffset={8}>
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onSelect={() => setTimeout(() => onEdit(note), 0)}
                >
                  <Edit />
                  Redigera
                </DropdownMenuItem>

                <DropdownMenuItem
                  onSelect={() => setTimeout(() => onDelete(note.id), 0)}
                >
                  <Trash2 className="text-destructive" />
                  Ta bort
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem disabled>
                  Skapad{" "}
                  {note.createdAt.toLocaleString("sv-SE", {
                    dateStyle: "medium",
                  })}
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="text-xs text-muted-foreground">{note.text}</p>
      </div>
    </article>
  );
}
