"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getEmployeeProfile, updateEmployeeProfile } from "@/lib/api/employees";
import { UpdateUserForm } from "@/components/users/update-users-form";

export function useEmployeeProfile() {
  return useQuery({
    queryKey: ["employeeProfile"],
    queryFn: getEmployeeProfile,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}

export function useUpdateEmployeeProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserForm) => updateEmployeeProfile(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["employeeProfile"] });
      toast.success(res.message || "Profile updated successfully");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update profile");
    },
  });
}
