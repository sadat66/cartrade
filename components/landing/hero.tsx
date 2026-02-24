"use client";

import { useState } from "react";
import { HeroSearchForm } from "./hero-search-form";
import { useTranslations } from "next-intl";

const BODY_TYPE_TO_HERO_INDEX: Record<string, number> = {
  sedan: 1,
  suv: 2,
  ute: 3,
  hatch: 4,
  coupe: 5,
  sports: 6,
  performance: 7,
  unique: 1,
};

function getHeroImageIndex(bodyType: string | null): number {
  if (!bodyType) return 1;
  return BODY_TYPE_TO_HERO_INDEX[bodyType.toLowerCase()] ?? 1;
}

export function Hero() {
  const [selectedBodyType, setSelectedBodyType] = useState<string | null>(null);
  const t = useTranslations("hero");

  return (
    <section className="relative flex min-h-[500px] w-full flex-col items-center justify-center md:min-h-[600px]">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/background/backgroundHero.png)" }}
      />
      {/* See-through transition: dark at top, fades to page background at bottom */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-background" />

      {/* Content – tight hierarchy, high contrast */}
      <div className="container relative z-10 mx-auto px-4 pt-16 pb-6 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-white md:text-5xl md:font-bold">
          {t("title")}
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-base text-neutral-300 md:text-lg">
          {t("subtitle")}
        </p>
      </div>

      {/* Search card – overlaps into next section so full filter (incl. body type) is visible */}
      <div className="container relative z-20 mx-auto px-4 md:px-6">
        <div className="mx-auto w-full max-w-5xl -mb-40 md:-mb-52">
          <HeroSearchForm
            selectedBodyType={selectedBodyType}
            onBodyTypeChange={setSelectedBodyType}
          />
        </div>
      </div>
    </section>
  );
}
