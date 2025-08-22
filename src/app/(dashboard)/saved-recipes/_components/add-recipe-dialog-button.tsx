import ImportUrlForm from "@/app/(dashboard)/saved-recipes/_components/import-url-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { PencilLine, Plus } from "lucide-react";

export default function AddRecipeDialogButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          <span>Lägg till recept</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Lägg till nytt recept</DialogTitle>
          <DialogDescription>
            Välj hur du vill lägga till receptet
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6">
          <ImportUrlForm />
          <div
            className={cn(
              "relative text-center text-sm text-muted-foreground",
              "after:absolute after:inset-0 after:top-1/2 after:z-0 after:border-t after:border-border",
            )}
          >
            <span className="relative z-50 bg-background px-2">Eller</span>
          </div>
          <Button variant="secondary" disabled>
            <PencilLine />
            <span>Skapa manuellt (kommande funktion)</span>
          </Button>
        </div>
        <DialogFooter>
          <DialogTrigger asChild>
            <Button variant="outline">Stäng</Button>
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
