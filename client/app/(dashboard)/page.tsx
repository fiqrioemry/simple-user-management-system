export const dynamic = "force-dynamic";

import React from "react";
import { Metadata } from "next";
import { DashboardView } from "@/components/dashboard/dashboard-view";

export const metadata: Metadata = {
  title: "User management system - Dashboard",
  description: "Overview of user management system",
};

export default function Page() {
  return (
    <div className="space-y-6 w-full mx-auto px-4 md:px-8">
      <DashboardView />
    </div>
  );
}
