"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export function EmailConfirmedToast() {
  const t = useTranslations();
  useEffect(() => {
    toast.success(t("dashboard.emailConfirmed"));
  }, [t]);
  return null;
}
