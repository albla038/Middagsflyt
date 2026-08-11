"use client";

import { Button } from "@/components/ui/button";
import { LucideLink } from "lucide-react";
import { ComponentProps } from "react";
import { toast } from "sonner";

type CopyLinkButtonProps = ComponentProps<typeof Button> & {
  slug: string;
};

export default function CopyLinkButton({
  size,
  slug,
  className,
  ...props
}: CopyLinkButtonProps) {
  const isIconOnly = size?.includes("icon") ?? false;

  return (
    <Button
      {...props}
      size={size}
      className={className}
      onClick={() => {
        navigator.clipboard.writeText(`/recipe/${slug}`);
        toast.success(`Länk kopierad till urklipp`, {
          position: "top-center",
          description: `/recipe/${slug}`, // TODO Add domain to URL
        });
      }}
    >
      <LucideLink />

      {!isIconOnly && "Kopiera länk"}
    </Button>
  );
}
