"use client";

import { useLocale } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { locales, localeNames, type Locale } from "@/i18n/config";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LocaleSwitcher({ className }: { className?: string }) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();

  const switchLocale = (newLocale: Locale) => {
    if (newLocale === locale) return;
    const newPath = `/${newLocale}${pathname === "/" ? "" : pathname}`;
    window.location.href = newPath;
  };

  return (
    <div
      className={cn(
        "flex h-8 items-center gap-0.5 rounded-lg bg-white/10 p-1 border border-white/5",
        className
      )}
    >
      {locales.map((loc) => (
        <button
          key={loc}
          onClick={() => switchLocale(loc)}
          className={cn(
            "flex h-full items-center px-2 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all duration-200",
            locale === loc
              ? "bg-blue-600 text-white shadow-lg"
              : "text-white/50 hover:text-white/80 hover:bg-white/5"
          )}
        >
          {loc}
        </button>
      ))}
    </div>
  );
}
