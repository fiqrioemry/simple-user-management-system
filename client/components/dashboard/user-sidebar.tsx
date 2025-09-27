"use client";

import {
  Sidebar,
  SidebarRail,
  SidebarFooter,
  SidebarHeader,
  SidebarContent,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import * as React from "react";

import {
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { NavMain } from "./nav-main";
import { usePathname } from "next/navigation";
import { useSession } from "@/hooks/use-auth";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { SignOutButton } from "@/components/auth/signout-button";
import { Home, ChartArea, CreditCard, User2 } from "lucide-react";
import { UserSidebarSkeleton } from "./sidebar-loading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function UserSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { data: session, isLoading } = useSession();

  if (isLoading) return <UserSidebarSkeleton />;

  const user = session?.data;

  const navItems = [
    {
      title: "Dashboard",
      url: "/",
      icon: ChartArea,
      isActive: pathname === "/",
    },
    {
      title: "Users",
      url: "/users",
      icon: Home,
      isActive: pathname.startsWith("/users"),
    },
    {
      title: "Audit Logs",
      url: "/audit-logs",
      icon: CreditCard,
      isActive: pathname.startsWith("/audit-logs"),
    },
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex gap-2 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-primary/10 rounded">
              <User2 className="w-8 h-8 text-primary" />
            </div>
            <div className="grid flex-1 text-left text-md py-4 font-mono leading-tight">
              <span className="truncate font-medium">User Management</span>
            </div>
          </div>
        </div>

        <div>
          <ThemeToggle /> <span>Theme</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 focus:outline-none">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={user?.profile.photoUrl || undefined}
                    alt={user?.profile.name}
                  />
                  <AvatarFallback className="rounded-lg">
                    {user?.profile.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {pathname.startsWith("/") && (
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {user?.profile.name}
                    </span>
                    <span className="truncate text-xs">{user?.email}</span>
                  </div>
                )}
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src={user?.profile.photoUrl || undefined}
                      alt={user?.profile.name}
                    />
                    <AvatarFallback className="rounded-lg">
                      {user?.profile.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {user?.profile.name}
                    </span>
                    <span className="truncate text-xs">{user?.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <SignOutButton />
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
