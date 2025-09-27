export type AuditLog = {
  id: string;
  userId: string;
  action: string;
  entity: string;
  entityId: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
  createdAt: string;
};

import qs from "qs";

export type AuditLogsParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export async function getAuditLogs(params?: AuditLogsParams) {
  const query = qs.stringify(params, { skipNulls: true });

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/audit${query ? `?${query}` : ""}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch audit logs");
  }

  return res.json();
}
