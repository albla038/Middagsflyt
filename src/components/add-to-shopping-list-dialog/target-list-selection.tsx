import SaveShoppingListForm from "@/app/(dashboard)/_components/sidebar/shopping-list/save-form";
import ResponsiveDialog from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ShoppingListWithCount } from "@/lib/schemas/shopping-list";
import { Plus } from "lucide-react";
import { useState } from "react";

type TargetListSelectionProps = {
  shoppingLists: ShoppingListWithCount[];
  selectedListId: string | null;
  onSelectList: (listId: string) => void;
};

export default function TargetListSelection({
  shoppingLists,
  selectedListId,
  onSelectList,
}: TargetListSelectionProps) {
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-3">
        <RadioGroup
          value={selectedListId}
          onValueChange={(value) => onSelectList(value)}
        >
          {shoppingLists.map((list) => (
            <FieldLabel key={list.id} htmlFor={`radio-${list.id}`}>
              <Field orientation="horizontal">
                <RadioGroupItem id={`radio-${list.id}`} value={list.id} />
                <FieldContent>
                  <FieldTitle>{list.name}</FieldTitle>
                  <FieldDescription>{list.itemCount} varor</FieldDescription>
                </FieldContent>
              </Field>
            </FieldLabel>
          ))}
        </RadioGroup>
        <Button variant="ghost" onClick={() => setCreateDialogOpen(true)}>
          <Plus /> Ny inköpslista
        </Button>
      </div>

      {/* Create new list dialog */}
      <ResponsiveDialog
        open={isCreateDialogOpen}
        onOpenChange={setCreateDialogOpen}
        title="Skapa ny inköpslista"
        description="Listan delas automatisk med alla medlemmar i ditt hushåll"
      >
        <SaveShoppingListForm onClose={() => setCreateDialogOpen(false)} />
      </ResponsiveDialog>
    </>
  );
}
