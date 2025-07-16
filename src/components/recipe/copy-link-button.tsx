"use client";

import { Button } from "@/components/ui/button";
import { LucideLink } from "lucide-react";
import { ComponentPropsWithRef } from "react";
import { toast } from "sonner";

type CopyLinkButtonProps = ComponentPropsWithRef<"button"> & {
  variant?: "secondary" | "icon-lg";
  slug: string;
};

export default function CopyLinkButton({
  variant = "secondary",
  slug,
  className,
  ...rest
}: CopyLinkButtonProps) {
  return (
    <Button
      {...rest}
      variant={variant === "secondary" ? "secondary" : "ghost"}
      size={variant === "secondary" ? "default" : "icon-lg"}
      className={className}
      onClick={() => {
        navigator.clipboard.writeText(`/recipe/${slug}`);
        toast.success(`Länk kopierad till urklipp`, {
          position: "top-center",
          description: `/recipe/${slug}`, // TODO Add domain to URL
        });
      }}
    >
      {variant === "secondary" ? (
        <>
          <LucideLink />
          <span>Kopiera länk</span>
        </>
      ) : (
        <LucideLink className="size-6" />
      )}
    </Button>
  );
}
