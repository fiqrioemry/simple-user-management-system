"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  login,
  logout,
  getSession,
  resetPassword,
  changePassword,
  ResetPasswordData,
  ChangePasswordData,
} from "@/lib/api/auth";
import { useRouter } from "next/navigation";

export function useSession() {
  return useQuery({
    queryKey: ["session"],
    queryFn: () => getSession(),
    retry: false,
  });
}

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["session"] });
      toast.success(res.message || "Login success");
      router.push("/");
    },
    onError: (err: any) => {
      toast.error(err.message || "Login failed");
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => logout(),
    onSuccess: (res) => {
      queryClient.removeQueries({ queryKey: ["session"] });
      toast.success(res.message || "Logout success");
    },
    onError: (err: any) => {
      toast.error(err.message || "Logout failed");
    },
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: async (data: ResetPasswordData) => {
      const res = await resetPassword(data);
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Reset password failed");
      }
      return res.json();
    },
    onSuccess: (res) => {
      toast.success(res.message || "Reset password link sent");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to reset password");
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordData) => changePassword(data),
    onSuccess: (res) => {
      toast.success(res.message || "Password changed successfully");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to change password");
    },
  });
}
