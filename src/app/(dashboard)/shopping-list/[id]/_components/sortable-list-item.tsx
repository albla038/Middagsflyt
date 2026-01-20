import ListItem from "@/app/(dashboard)/shopping-list/[id]/_components/list-item";
import { ShoppingListItemResponse } from "@/lib/schemas/shopping-list";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type SortableListItemProps = {
  listId: string;
  item: ShoppingListItemResponse;
  categories: { id: string; name: string }[];
  isDraggable?: boolean;
};

export default function SortableListItem({
  listId,
  item,
  categories,
  isDraggable = false,
}: SortableListItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={isDragging ? "opacity-0" : undefined}
    >
      <ListItem
        listId={listId}
        item={item}
        categories={categories}
        isDraggable={isDraggable}
        attributes={attributes}
        listeners={listeners}
      />
    </li>
  );
}
