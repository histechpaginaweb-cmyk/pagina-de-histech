"use client";

// Entrada del portal: envía a cada usuario a su zona según el rol.
import * as React from "react";
import { useRouter } from "next/navigation";
import { usePortalAuth } from "@/components/portal/auth-context";
import { Spinner } from "@/components/portal/ui";

export default function PortalIndexPage() {
  const router = useRouter();
  const { user, loading } = usePortalAuth();

  React.useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/portal/login");
    } else if (user.role === "ADMIN_HISTECH") {
      router.replace("/portal/admin");
    } else {
      router.replace("/portal/dashboard");
    }
  }, [loading, user, router]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Spinner className="size-8 text-brand-purple" />
    </div>
  );
}
