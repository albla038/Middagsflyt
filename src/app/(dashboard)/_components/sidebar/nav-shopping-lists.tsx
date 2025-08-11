import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { List, ListOrdered, Plus } from "lucide-react";

export default function NavShoppingLists() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Inköpslisor</SidebarGroupLabel>

      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <SidebarGroupAction>
            <Plus />
          </SidebarGroupAction>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Ny inköpslista</p>
        </TooltipContent>
      </Tooltip>

      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton disabled>
              <List /> <span>Min inköpslista</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton disabled>
              <List /> <span>Att handla 7 aug.</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton disabled>
              <ListOrdered /> <span>Mina favoritvaror</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
