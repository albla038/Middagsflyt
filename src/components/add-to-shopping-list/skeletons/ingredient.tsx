import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";

export default function IngredientSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="mb-2 space-y-2 p-1">
        <div className="flex w-full items-center gap-2">
          <Checkbox disabled />
          <div className="flex w-full cursor-pointer items-center justify-between">
            <Skeleton className="h-4 w-56"></Skeleton>
            <Skeleton className="size-4 rounded-sm" />
          </div>
        </div>
      </div>

      <div className="mb-2 space-y-2 p-1">
        <div className="flex w-full items-center gap-2">
          <Checkbox disabled />
          <div className="flex w-full cursor-pointer items-center justify-between">
            <Skeleton className="h-4 w-72"></Skeleton>
            <Skeleton className="size-4 rounded-sm" />
          </div>
        </div>
      </div>

      <div className="mb-2 space-y-2 p-1">
        <div className="flex w-full items-center gap-2">
          <Checkbox disabled />
          <div className="flex w-full cursor-pointer items-center justify-between">
            <Skeleton className="h-4 w-48"></Skeleton>
            <Skeleton className="size-4 rounded-sm" />
          </div>
        </div>
      </div>
    </div>
  );
}
