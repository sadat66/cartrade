import { defineRouting } from "next-intl/routing";
import { locales, defaultLocale } from "./config";

export const routing = defineRouting({
  locales: [...locales],
  defaultLocale,
  localePrefix: "always",
  // Persist locale in cookie so it survives navigation and stays session-based
  localeDetection: true,
  localeCookie: {
    name: "NEXT_LOCALE",
    maxAge: 365 * 24 * 60 * 60, // 1 year
  },
});
