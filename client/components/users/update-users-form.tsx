"use client";

import React from "react";
import { z } from "zod";
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormProvider } from "react-hook-form";
import { useUpdateUser } from "@/hooks/use-users";
import { useFormSchema } from "@/hooks/use-form-schema";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { DateField } from "@/components/form-fields/date-field";
import { SelectField } from "@/components/form-fields/select-field";
import { LongTextField } from "@/components/form-fields/long-text-field";
import { ShortTextField } from "@/components/form-fields/short-text-field";
import { SwitchField } from "../form-fields/switch-field";

const UpdateUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.enum(["ADMIN", "EMPLOYEE"]).optional(),
  position: z.string().min(1, "Position is required"),
  department: z.string().min(1, "Department is required"),
  phone: z
    .string()
    .regex(/^[+]?[\d\s\-\(\)]+$/, { message: "Invalid phone number" })
    .max(20, "Phone number too long")
    .optional(),
  hireDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid hire date" })
    .optional(),
  gender: z.enum(["MALE", "FEMALE"]).optional(),
  birthday: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid birthday" })
    .optional(),
  address: z.string().max(500).optional(),
  isActive: z.boolean().optional(),
});

export type UpdateUserForm = z.infer<typeof UpdateUserSchema>;

export const EditUserForm = ({ user }: { user: any }) => {
  const [open, setOpen] = React.useState(false);
  const { mutateAsync: updateUser } = useUpdateUser(user.id);

  const form = useFormSchema({
    schema: UpdateUserSchema,
    action: handleUpdateUser,
    state: {
      name: user?.profile?.fullName ?? "",
      role: user?.role ?? "EMPLOYEE",
      position: user?.profile?.position ?? "",
      department: user?.profile?.department ?? "",
      phone: user?.profile?.phone ?? "",
      hireDate: user?.profile?.hireDate
        ? new Date(user.profile.hireDate).toISOString().split("T")[0]
        : "",
      gender: user?.profile?.gender,
      birthday: user?.profile?.birthday
        ? new Date(user.profile.birthday).toISOString().split("T")[0]
        : "",
      address: user?.profile?.address ?? "",
      isActive: user?.isActive ?? true,
    },
    mode: "onChange",
  });

  async function handleUpdateUser(data: UpdateUserForm) {
    await updateUser(data);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <Pencil className="w-4 h-4 mr-2" />
          Edit
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>Update the user details below.</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[600px] p-2">
          <FormProvider {...form.methods}>
            <form onSubmit={form.handleSubmit} className="space-y-4">
              <ShortTextField
                name="name"
                label="Full Name"
                placeholder="John Doe"
                reset
              />

              <SelectField
                name="role"
                label="Role"
                options={[
                  { label: "Admin", value: "ADMIN" },
                  { label: "Employee", value: "EMPLOYEE" },
                ]}
                placeholder="Select Role"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ShortTextField
                  name="position"
                  label="Position"
                  placeholder="Software Engineer"
                  reset
                />
                <ShortTextField
                  name="department"
                  label="Department"
                  placeholder="IT"
                  reset
                />
              </div>

              <ShortTextField
                name="phone"
                label="Phone"
                placeholder="+62 812 3456 7890"
                reset
              />

              <SwitchField name="isActive" label="Active" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DateField name="hireDate" label="Hire Date" />
                <DateField name="birthday" label="Birthday" />
              </div>

              <SelectField
                name="gender"
                label="Gender"
                options={[
                  { label: "Male", value: "MALE" },
                  { label: "Female", value: "FEMALE" },
                ]}
                placeholder="Select Gender"
              />

              <LongTextField
                name="address"
                label="Address"
                placeholder="Street, City"
                reset
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <Button
                  type="button"
                  onClick={() => setOpen(false)}
                  disabled={form.isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={form.isSubmitting}>
                  {form.isSubmitting ? "Updating..." : "Update User"}
                </Button>
              </div>
            </form>
          </FormProvider>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
