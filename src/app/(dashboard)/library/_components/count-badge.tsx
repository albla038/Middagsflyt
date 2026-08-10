"use client";

import { Badge } from "@/components/ui/badge";
import { use } from "react";

type CountBadgeProps = {
  countPromise: Promise<number>;
};

export default function CountBadge({ countPromise }: CountBadgeProps) {
  const count = use(countPromise);

  return (
    <Badge variant="outline">
      {count}
    </Badge>
  );
}
