"use client";

import { useLocale } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { locales, type Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function LocaleSwitcher({ className }: { className?: string }) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();

  const switchLocale = (newLocale: Locale) => {
    if (newLocale === locale) return;
    const newPath = `/${newLocale}${pathname === "/" ? "" : pathname}`;
    window.location.href = newPath;
  };

  return (
    <div className={cn("inline-flex items-center bg-slate-100/90 p-1 rounded-full border border-slate-200 shadow-sm", className)}>
      <div className="flex items-center relative gap-1">
        {locales.map((loc) => {
          const isActive = locale === loc;
          return (
            <button
              key={loc}
              type="button"
              onClick={() => switchLocale(loc)}
              className={cn(
                "relative z-10 flex h-6 min-w-[2.2rem] items-center justify-center text-[9px] font-black uppercase tracking-widest transition-colors duration-300",
                isActive ? "text-[#ff385c]" : "text-slate-400 hover:text-slate-600"
              )}
            >
              {loc}
              {isActive && (
                <motion.div
                  layoutId="active-locale"
                  className="absolute inset-0 z-[-1] rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-slate-200/50"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
