"use client";

import React from "react";
import Image from "next/image";
import { Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export const UserDetailDialog = ({ user }: { user: any }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <Eye className="w-4 h-4 mr-2" />
          View
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>
            Overview of <span className="font-semibold">{user.email}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Photo */}
          <div className="flex justify-center">
            {user.profile?.photoUrl ? (
              <img
                src={user.profile.photoUrl}
                alt={user.profile?.fullName || "avatar"}
                width={100}
                height={100}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center text-2xl">
                {user.profile?.fullName?.[0] ?? "?"}
              </div>
            )}
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <p className="font-medium">Email</p>
            <p>{user.email}</p>

            <p className="font-medium">Role</p>
            <p>{user.role}</p>

            <p className="font-medium">Status</p>
            <p>{user.isActive ? "Active ✅" : "Inactive ❌"}</p>

            <p className="font-medium">Full Name</p>
            <p>{user.profile?.fullName ?? "-"}</p>

            <p className="font-medium">Department</p>
            <p>{user.profile?.department ?? "-"}</p>

            <p className="font-medium">Position</p>
            <p>{user.profile?.position ?? "-"}</p>

            <p className="font-medium">Phone</p>
            <p>{user.profile?.phone ?? "-"}</p>

            <p className="font-medium">Gender</p>
            <p>{user.profile?.gender ?? "-"}</p>

            <p className="font-medium">Hire Date</p>
            <p>
              {user.profile?.hireDate
                ? new Date(user.profile.hireDate).toLocaleDateString()
                : "-"}
            </p>

            <p className="font-medium">Birthday</p>
            <p>
              {user.profile?.birthday
                ? new Date(user.profile.birthday).toLocaleDateString()
                : "-"}
            </p>

            <p className="font-medium">Address</p>
            <p>{user.profile?.address ?? "-"}</p>

            <p className="font-medium">Created</p>
            <p>{new Date(user.createdAt).toLocaleString()}</p>

            <p className="font-medium">Updated</p>
            <p>{new Date(user.updatedAt).toLocaleString()}</p>
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={() => setOpen(false)}>Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
