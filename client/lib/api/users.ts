import { UpdateUserForm } from "@/components/users/update-users-form";
import qs from "qs";
import { buildFormData } from "../utils";
import { CreateUserForm } from "@/components/users/new-users-form";

export type UsersParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export async function getUsers(params?: UsersParams) {
  const query = qs.stringify(params, { skipNulls: true });

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/users${query ? `?${query}` : ""}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to fetch users");
  }

  return res.json();
}

export async function createUser(data: CreateUserForm) {
  const form = { ...data, photoUrl: data.photoUrl?.file };
  const formData = buildFormData(form);

  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/users`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to create user");
  }

  return res.json();
}

export async function updateUser(id: string, data: UpdateUserForm) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });

  if (!res.ok) {
    const err = await res.json();
    console.log(err);
    throw new Error(err.message || "Failed to update user");
  }

  return res.json();
}

export async function deleteUser(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to delete user");
  }

  return res.json();
}

export type ResetLinkData = {
  email: string;
};
