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
    <section className="relative min-h-[500px] w-full bg-slate-900 md:min-h-[600px] flex flex-col items-center justify-center overflow-visible">
      {/* Full-bleed background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 hover:scale-105"
        style={{ backgroundImage: "url(/background/backgroundHero.png)" }}
      />
      {/* Dynamic Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-background" />

      {/* Hero Content */}
      <div className="container mx-auto relative z-10 px-4 pt-20 pb-12 text-center text-white">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 drop-shadow-lg">
          {t("title")}
        </h1>
        <p className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto mb-10 drop-shadow-md">
          {t("subtitle")}
        </p>
      </div>

      {/* Floating search card – overlaps hero bottom */}
      <div className="container mx-auto relative z-20 px-4 md:px-6">
        <div className="w-full max-w-5xl mx-auto -mb-32 md:-mb-40">
          <HeroSearchForm
            selectedBodyType={selectedBodyType}
            onBodyTypeChange={setSelectedBodyType}
          />
        </div>
      </div>
    </section>
  );
}
