"use client";

import React from "react";

import Link from "next/link";
import { Users } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useSession } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { DashboardLoading } from "./dashboard-loading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const DashboardView = () => {
  const { data: data, isLoading } = useSession();

  if (isLoading) return <DashboardLoading />;

  const user = data?.data;

  return (
    <div className="space-y-6 w-full mx-auto px-4 md:px-8 py-6">
      {/* Welcome Card */}
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-14 w-14">
            {user.profile?.photoUrl ? (
              <AvatarImage
                src={user.profile.photoUrl}
                alt={user.profile.name}
              />
            ) : (
              <AvatarFallback>
                {user.profile?.name?.charAt(0) ?? "U"}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex flex-col">
            <CardTitle className="text-xl">
              Welcome back, {user.profile?.name ?? "User"}
            </CardTitle>
            <span className="text-sm text-muted-foreground">{user.email}</span>
          </div>
          <div className="ml-auto">
            <Badge variant="secondary">{user.role}</Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Stats & Quick Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Account Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Name</span>
              <span className="font-medium">{user.profile?.name ?? "-"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Role</span>
              <span className="font-medium">{user.role}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Joined</span>
              <span className="font-medium">
                {formatDateTime(user.createdAt)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-3">
            <Link href="/users">
              <Button className="gap-2" variant="default">
                <Users className="h-4 w-4" />
                Manage Users
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
