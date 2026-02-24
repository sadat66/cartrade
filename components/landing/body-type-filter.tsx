"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";

const BODY_TYPE_KEYS = [
  "suv",
  "ute",
  "hatch",
  "offroad",
  "electric",
  "performance",
  "unique",
] as const;

const BODY_TYPE_IMAGES: Record<(typeof BODY_TYPE_KEYS)[number], string> = {
  suv: "/herocar/Suv.png",
  ute: "/herocar/Ute.png",
  hatch: "/herocar/Hatch.png",
  offroad: "/herocar/Offroad.png",
  electric: "/herocar/Electric.png",
  performance: "/herocar/Performance.png",
  unique: "/herocar/Unique.png",
};

const BODY_TYPE_LABELS: Record<(typeof BODY_TYPE_KEYS)[number], string> = {
  suv: "SUV",
  ute: "Ute",
  hatch: "Hatch",
  offroad: "Off road",
  electric: "Electric",
  performance: "Performance",
  unique: "Unique",
};

export function BodyTypeFilter() {
  const t = useTranslations("hero");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentBodyType = searchParams.get("bodyType") ?? null;
  const isOnCarsPage = pathname.includes("/cars") && !pathname.match(/\/cars\/[^/]+/);

  const handleSelect = (key: string) => {
    const nextBody = currentBodyType === key ? null : key;
    const params = new URLSearchParams(searchParams.toString());
    if (nextBody) {
      params.set("bodyType", nextBody);
    } else {
      params.delete("bodyType");
    }
    const query = params.toString();
    const url = query ? `/${locale}/cars?${query}` : `/${locale}/cars`;

    if (isOnCarsPage) {
      router.push(url, { scroll: false });
    } else {
      router.push(url);
    }
  };

  return (
    <div className="border-b border-border bg-background">
      <div className="container mx-auto px-4 py-6 md:px-6">
        <p className="mb-4 text-sm font-semibold tracking-tight text-foreground md:text-base">
          {t("bodyTypeHeading")}
        </p>
        <div className="flex flex-wrap items-end justify-start gap-6 md:gap-8">
          {BODY_TYPE_KEYS.map((key) => {
            const isSelected = currentBodyType === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => handleSelect(key)}
                className={cn(
                  "flex flex-col items-center gap-0 transition-opacity duration-150",
                  !isSelected && "hover:opacity-80"
                )}
                aria-label={BODY_TYPE_LABELS[key]}
              >
                <div className="relative size-20 md:size-24">
                  <Image
                    src={BODY_TYPE_IMAGES[key]}
                    alt=""
                    fill
                    className="object-contain object-bottom"
                    sizes="96px"
                  />
                </div>
                <span className="mt-1 text-[10px] font-medium text-muted-foreground tracking-tight">
                  {BODY_TYPE_LABELS[key]}
                </span>
                {isSelected && (
                  <div className="mt-1.5 h-1 w-full min-w-[40px] bg-foreground" aria-hidden />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
