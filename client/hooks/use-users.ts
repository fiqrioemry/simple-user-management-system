"use client";

import { toast } from "sonner";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  UsersParams,
} from "@/lib/api/users";
import { UpdateUserForm } from "@/components/users/update-users-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useUsers(params?: UsersParams) {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => getUsers(params),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(res.message || "User created successfully");
    },
    onError: (err: any) => {
      console.log(err);
      toast.error(err.message || "Failed to create user");
    },
  });
}

export function useUpdateUser(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserForm) => updateUser(id, data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(res.message || "User updated successfully");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update user");
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(res.message || "User deleted successfully");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to delete user");
    },
  });
}
