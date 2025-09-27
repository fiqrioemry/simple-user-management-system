"use client";

import {
  Sidebar,
  SidebarRail,
  SidebarFooter,
  SidebarHeader,
  SidebarContent,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

export function UserSidebarSkeleton() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex gap-2 items-center">
          <Skeleton className="h-8 w-8 rounded bg-muted" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-32 bg-muted" />
            <Skeleton className="h-3 w-20 bg-muted" />
          </div>
        </div>
        <div className="flex items-center gap-2 pt-4">
          <Skeleton className="h-6 w-6 rounded-full bg-muted" />
          <Skeleton className="h-4 w-16 bg-muted" />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <div className="space-y-3 py-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-2">
              <Skeleton className="h-5 w-5 rounded bg-muted" />
              <Skeleton className="h-4 w-24 bg-muted" />
            </div>
          ))}
        </div>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenuItem>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-lg bg-muted" />
            <div className="flex flex-col">
              <Skeleton className="h-4 w-28 bg-muted" />
              <Skeleton className="h-3 w-20 bg-muted" />
            </div>
          </div>
        </SidebarMenuItem>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
