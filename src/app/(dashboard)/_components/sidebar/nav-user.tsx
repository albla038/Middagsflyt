"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import UserAvatar from "@/components/user-avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import { authClient } from "@/lib/auth-client";
import { EllipsisVertical, Loader2, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

export default function NavUser() {
  const { data: session, isPending } = authClient.useSession();
  const [logOutPending, startLogOutTransition] = useTransition();
  const router = useRouter();
  const isMobile = useIsMobile();

  function logOut() {
    startLogOutTransition(async () => {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/login");
          },
          onError: () => {
            toast.error("Utloggningen misslyckades", {
              action: {
                label: "Försök igen",
                onClick: logOut,
              },
            });
          },
        },
      });
    });
  }

  const user = session?.user;

  if (isPending || !user) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg">
            <Skeleton className="size-8 rounded-full" />
            <div className="grid gap-0.5">
              <Skeleton className="h-3.5 w-32" />
              <Skeleton className="h-3 w-40" />
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <UserAvatar user={user} />
              <div className="grid text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <EllipsisVertical className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-full"
            align={isMobile ? "start" : "end"}
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="flex items-center gap-2 font-normal">
              <UserAvatar user={user} />
              <div className="grid text-sm leading-tight">
                <span className="font-medium">{user.name}</span>
                <span className="text-xs">{user.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logOut}>
              {logOutPending ? (
                <>
                  <Loader2 className="animate-spin" />
                  <span>Loggar ut...</span>
                </>
              ) : (
                <>
                  <LogOut />
                  <span>Logga ut</span>
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
