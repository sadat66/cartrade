"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function DashboardHome() {
  const router = useRouter();
  useEffect(() => {
    toast.success("Email confirmed. You're all set!");
    router.refresh();
    router.replace("/dashboard/profile");
  }, [router]);
  return (
    <div className="flex items-center justify-center py-12">
      <p className="text-muted-foreground text-sm">Redirecting…</p>
    </div>
  );
}
