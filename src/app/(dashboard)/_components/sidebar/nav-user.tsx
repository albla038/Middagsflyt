"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  useSidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth-client";
import { nameToInitials } from "@/lib/utils";
import { EllipsisVertical, Loader2, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

export default function NavUser() {
  const { data: session, isPending } = authClient.useSession();
  const [logOutPending, startLogOutTransition] = useTransition();
  const router = useRouter();
  const { isMobile } = useSidebar();

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

  if (isPending) {
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

  const user = session?.user;
  if (!user) return null;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="size-8">
                <AvatarImage
                  src={user.image ?? `https://avatar.vercel.sh/${user.email}`}
                  alt={user.name}
                />

                <AvatarFallback>
                  {user.name && user.name.length > 0
                    ? nameToInitials(user.name)
                    : user.email.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
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
            <DropdownMenuLabel className="flex gap-2 font-normal">
              <Avatar className="size-8">
                <AvatarImage
                  src={user.image ?? `https://avatar.vercel.sh/${user.email}`}
                  alt={user.name}
                />

                <AvatarFallback>
                  {user.name && user.name.length > 0
                    ? nameToInitials(user.name)
                    : user.email.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
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
