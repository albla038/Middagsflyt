import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ShoppingListWithCount } from "@/lib/schemas/shopping-list";

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
  return (
    <RadioGroup
      value={selectedListId}
      onValueChange={(value) => onSelectList(value)}
      className="mb-4"
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
      {/* // TODO: Implement add new shopping list button  */}
    </RadioGroup>
  );
}
