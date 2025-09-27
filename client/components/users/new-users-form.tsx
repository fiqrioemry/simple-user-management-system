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
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormProvider } from "react-hook-form";
import { useCreateUser } from "@/hooks/use-users";
import { useFormSchema } from "@/hooks/use-form-schema";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DateField } from "@/components/form-fields/date-field";
import { SelectField } from "@/components/form-fields/select-field";
import { ShortTextField } from "@/components/form-fields/short-text-field";
import { FileUploadField } from "../form-fields/file-upload-field";

// --- Zod Schema (frontend validation)
export const UserSchema = z.object({
  email: z.email("Invalid email format"),
  name: z.string().min(1, "Name is required"),
  role: z.enum(["ADMIN", "EMPLOYEE"]).refine((val) => !!val, {
    message: "Role is required",
  }),
  position: z.string().min(1, "Position is required"),
  department: z.string().min(1, "Department is required"),
  phone: z
    .string()
    .regex(/^[+]?[\d\s\-\(\)]+$/, { message: "Invalid phone number" })
    .max(20, "Phone number too long")
    .optional(),
  hireDate: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE"]).optional(),
  birthday: z.string().optional(),
  photoUrl: z.object({
    file: z.instanceof(File),
    preview: z.url().optional(),
  }),
});

export type CreateUserForm = z.infer<typeof UserSchema>;

export const NewUsersForm = () => {
  const [open, setOpen] = React.useState(false);
  const { mutateAsync: createUser } = useCreateUser();
  const [confirmDialog, setConfirmDialog] = React.useState(false);

  // initialize react-hook-form with zod schema
  const form = useFormSchema({
    schema: UserSchema,
    action: handleAddUser,
    state: {
      email: "",
      name: "",
      role: "EMPLOYEE",
      position: "",
      department: "",
      phone: "",
      hireDate: "",
      gender: "MALE",
      birthday: "",
      photoUrl: "",
    },
    mode: "onChange",
  });

  // submit handler
  async function handleAddUser(data: CreateUserForm) {
    await createUser(data);
    setOpen(false);
    form.reset();
  }

  // handle close dialog with unsaved changes
  const handleClose = () => {
    if (form.isDirty) {
      setConfirmDialog(true);
    } else {
      setOpen(!open);
      form.reset();
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={() => handleClose()}>
        <DialogTrigger asChild>
          <Button className="gap-2">
            <PlusCircle className="w-4 h-4" />
            Add User
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Fill in the details below to create a new user.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[600px] p-2">
            <FormProvider {...form.methods}>
              <form onSubmit={form.handleSubmit} className="space-y-4">
                <div className="flex justify-center">
                  <FileUploadField name="photoUrl" label="Photo" />
                </div>
                {/* Basic Fields */}
                <ShortTextField
                  name="email"
                  label="Email"
                  placeholder="user@example.com"
                  reset
                />
                <ShortTextField
                  name="name"
                  label="Full Name"
                  placeholder="John Doe"
                  reset
                />

                {/* Role */}
                <SelectField
                  name="role"
                  label="Role"
                  options={[
                    { label: "Admin", value: "ADMIN" },
                    { label: "Employee", value: "EMPLOYEE" },
                  ]}
                  placeholder="Select Role"
                />

                {/* Employee Info */}
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

                {/* Optional Info */}
                <ShortTextField
                  name="phone"
                  label="Phone Number"
                  placeholder="+62 812 3456 7890"
                  reset
                />

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

                {/* Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <Button
                    type="button"
                    disabled={form.isSubmitting}
                    onClick={() => handleClose()}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      !form.isValid || !form.isDirty || form.isSubmitting
                    }
                  >
                    {form.isSubmitting ? "Creating..." : "Create User"}
                  </Button>
                </div>
              </form>
            </FormProvider>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Confirm Close Dialog */}
      <Dialog open={confirmDialog} onOpenChange={() => setConfirmDialog(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unsaved Changes</DialogTitle>
            <DialogDescription>
              You have unsaved changes. Are you sure you want to close?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setConfirmDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setConfirmDialog(false);
                setOpen(false);
                form.reset();
              }}
            >
              Yes, Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
