"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { locales, type Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export function LocaleSwitcher({ className }: { className?: string }) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const switchLocale = (newLocale: Locale) => {
    if (newLocale === locale) {
      setOpen(false);
      return;
    }
    const newPath = `/${newLocale}${pathname === "/" ? "" : pathname}`;
    window.location.href = newPath;
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex h-8 min-w-[4.5rem] items-center justify-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 text-xs font-semibold uppercase tracking-wide text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:border-slate-300",
          open && "border-slate-300 bg-slate-50"
        )}
      >
        {locale}
        <ChevronDown className={cn("size-3.5 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 w-full min-w-[4.5rem] rounded-md border border-slate-200 bg-white py-1 shadow-lg">
          {locales.map((loc) => (
            <button
              key={loc}
              type="button"
              onClick={() => switchLocale(loc)}
              className={cn(
                "flex w-full items-center justify-center px-2.5 py-1.5 text-xs font-medium uppercase tracking-wide transition-colors",
                locale === loc
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              {loc}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
