"use client";

import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { z } from "zod";
import React from "react";
import { useLogin } from "@/hooks/use-auth";
import { FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useFormSchema } from "@/hooks/use-form-schema";
import { EmailField } from "@/components/form-fields/email-field";
import { PasswordField } from "@/components/form-fields/password-field";

const SignInSchema = z.object({
  email: z.string().email().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

type SignInForm = z.infer<typeof SignInSchema>;

export default function SignInForm() {
  const { mutateAsync: signIn } = useLogin();
  //   initialize react hook form
  const form = useFormSchema({
    action: handleSignIn,
    schema: SignInSchema,
    mode: "onChange",
  });

  //  handle signin function
  async function handleSignIn(data: SignInForm) {
    await signIn(data);
  }

  return (
    <Card className="max-w-md w-full shadow bg-card backdrop-blur-lg border border-white/20">
      <CardHeader className="space-y-2 mb-4">
        <CardTitle className="text-2xl font-bold text-center">
          User Management System
        </CardTitle>
        <CardDescription className="text-center text-muted-foreground">
          Please enter your credentials to sign in
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormProvider {...form.methods}>
          <form onSubmit={form.handleSubmit} className="space-y-2">
            <EmailField name="email" placeholder="enter your email" reset />
            <PasswordField
              name="password"
              placeholder="enter your password"
              reset
            />
            <div className="mt-6">
              <Button
                type="submit"
                className="w-full"
                disabled={!form.isValid || form.isSubmitting || !form.isDirty}
              >
                {form.isSubmitting ? "Signing In..." : "Sign In"}
              </Button>
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}
