"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export function DashboardHome() {
  const router = useRouter();
  const t = useTranslations();
  useEffect(() => {
    toast.success(t("dashboard.emailConfirmed"));
    router.refresh();
    router.replace("/dashboard/profile");
  }, [router, t]);
  return (
    <div className="flex items-center justify-center py-12">
      <p className="text-muted-foreground text-sm">{t("common.redirecting")}</p>
    </div>
  );
}
