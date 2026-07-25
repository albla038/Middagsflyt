import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";

export default function TargetListSkeleton() {
  return (
    <RadioGroup>
      {Array.from({ length: 4 }).map((_, idx) => (
        <FieldLabel key={idx}>
          <Field orientation="horizontal">
            <RadioGroupItem value={idx.toString()} disabled />
            <FieldContent>
              <Skeleton className="my-[2.625px] h-[14px] w-48" />
              <Skeleton className="my-[3.5px] h-[14px] w-28" />
            </FieldContent>
          </Field>
        </FieldLabel>
      ))}
    </RadioGroup>
  );
}
