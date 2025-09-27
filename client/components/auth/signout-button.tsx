"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/use-auth";

export function SignOutButton() {
  const router = useRouter();
  const { mutateAsync: signOut } = useLogout();

  async function handleSignOut() {
    await signOut();
    router.push("/signin");
  }

  return (
    <Button
      className="flex justify-start w-full"
      variant="ghost"
      onClick={handleSignOut}
    >
      <LogOut className="mr-2 h-4 w-4" />
      Log out
    </Button>
  );
}
