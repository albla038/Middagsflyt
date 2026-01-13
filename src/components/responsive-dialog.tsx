"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { ReactNode } from "react";

type ResponsiveDialogProps = {
  children: ReactNode;
  title: string;
  description: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  showCloseButtonInDialog?: boolean;
  dialogAction?: ReactNode;
};

export default function ResponsiveDialog({
  children,
  title,
  description,
  open,
  onOpenChange,
  showCloseButtonInDialog = true,
  dialogAction,
}: ResponsiveDialogProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          {dialogAction ? (
            // Render dialogAction in flex-row layout if provided
            <div className="flex items-start justify-between p-4 pb-0">
              <div className="grid gap-0.5">
                <DrawerTitle>{title}</DrawerTitle>
                <DrawerDescription>{description}</DrawerDescription>
              </div>

              {dialogAction}
            </div>
          ) : (
            <DrawerHeader>
              <DrawerTitle>{title}</DrawerTitle>
              <DrawerDescription>{description}</DrawerDescription>
            </DrawerHeader>
          )}

          <div className="p-4">{children}</div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={showCloseButtonInDialog}>
        {dialogAction ? (
          // Render dialogAction in flex-row layout if provided
          <div className="flex items-start justify-between">
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </DialogHeader>

            {dialogAction}
          </div>
        ) : (
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
        )}

        {children}
      </DialogContent>
    </Dialog>
  );
}
