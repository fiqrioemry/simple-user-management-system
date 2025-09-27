import React from "react";

import { Metadata } from "next";
import { AuditLogLists } from "@/components/audits/audit-log-lists";
export const metadata: Metadata = {
  title: "Audit Logs - user management system",
  description: "See all audit logs history in system",
};

export default function Page() {
  return (
    <div className="space-y-6 w-full mx-auto px-4 md:px-8">
      <AuditLogLists />
    </div>
  );
}
