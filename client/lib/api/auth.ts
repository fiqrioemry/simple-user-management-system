export type LoginData = {
  email: string;
  password: string;
};

export async function login(data: LoginData) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Login failed");
  }

  return res.json();
}

export async function logout() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Logout failed");
  }

  return res.json();
}

export async function getSession() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/get-session`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!res.ok) {
    throw new Error("Unauthorized");
  }

  return res.json();
}

export type ResetPasswordData = {
  email: string;
};

export async function resetPassword(data: ResetPasswordData) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/reset-password`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    }
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Reset password failed");
  }

  return res.json();
}

export type ChangePasswordData = {
  oldPassword: string;
  newPassword: string;
};

export async function changePassword(data: ChangePasswordData) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/change-password`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    }
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Change password failed");
  }

  return res.json();
}
