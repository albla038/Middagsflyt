"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ReactNode, useState } from "react";

type AuthActionGuardProps = {
  isAuthenticated: boolean;
  children: ReactNode;
  className?: string;
};

export default function AuthActionGuard({
  isAuthenticated,
  children,
  className,
}: AuthActionGuardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <>
      <div
        className={cn("contents", className)}
        onClickCapture={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDialogOpen(true);
        }}
      >
        {children}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Logga in för att fortsätta</DialogTitle>
            <DialogDescription>
              Middagsflyt gör det enklare att planera mat och handla smart.
              Logga in eller skapa ett konto för att få tillgång till hela
              upplevelsen.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Avbryt</Button>
            </DialogClose>

            <Button asChild>
              <Link href="/login">Logga in / Skapa konto</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
