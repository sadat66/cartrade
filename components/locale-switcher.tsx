"use client";

import { useLocale } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { locales, localeNames, type Locale } from "@/i18n/config";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LocaleSwitcher({ className }: { className?: string }) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const otherLocale = locales.find((loc) => loc !== locale) ?? locale;

  const handleToggle = () => {
    const newLocale = otherLocale;
    if (newLocale === locale) return;
    const newPath = `/${newLocale}${pathname === "/" ? "" : pathname}`;
    window.location.href = newPath;
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={handleToggle}
      className={cn(
        "h-7 min-w-0 gap-1 px-2 text-xs font-medium text-white/90 hover:bg-white/10 hover:text-white",
        className
      )}
      aria-label={`Switch to ${localeNames[otherLocale]}`}
    >
      <span className={locale === "en" ? "text-white" : "text-white/60"}>
        EN
      </span>
      <span className="text-white/50" aria-hidden>
        |
      </span>
      <span className={locale === "bn" ? "text-white" : "text-white/60"}>
        BN
      </span>
    </Button>
  );
}
