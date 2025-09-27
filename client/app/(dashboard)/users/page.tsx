import React from "react";

import { Metadata } from "next";
import { UsersList } from "@/components/users/users-list";
export const metadata: Metadata = {
  title: "Users Lists - user management system",
  description: "manage all users in the system",
};

export default function Page() {
  return (
    <div className="space-y-6 w-full mx-auto px-4 md:px-8">
      <UsersList />
    </div>
  );
}
