import { UpdateUserForm } from "@/components/users/update-users-form";

export async function getEmployeeProfile() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/employees/profile`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch employee profile");
  }

  return res.json();
}

export async function updateEmployeeProfile(data: UpdateUserForm) {
  const formData = new FormData();

  if (data.name) formData.append("name", data.name);
  if (data.position) formData.append("position", data.position);
  if (data.department) formData.append("department", data.department);
  if (data.phone) formData.append("phone", data.phone);
  if (data.gender) formData.append("gender", data.gender);
  if (data.birthday) formData.append("birthday", data.birthday);
  if (data.address) formData.append("address", data.address);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/employees/profile`,
    {
      method: "PUT",
      body: formData,
      credentials: "include",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to update employee profile");
  }

  return res.json();
}
