"use client";

import { useState } from "react";
import { HeroSearchForm } from "./hero-search-form";

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

  return (
    <section className="relative min-h-[400px] w-full bg-slate-800 md:min-h-[450px] flex flex-col">
      {/* Full-bleed background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat overflow-hidden rounded-none"
        style={{ backgroundImage: "url(/background/backgroundHero.png)" }}
      />
      {/* Subtle overlay so content stands out */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />

      {/* Floating search card – overlaps hero bottom AND the section below */}
      <div className="container mx-auto relative z-20 px-4 mt-auto pb-0 md:px-6">
        <div className="w-full max-w-7xl mx-auto -mb-24 md:-mb-28">
          <HeroSearchForm
            selectedBodyType={selectedBodyType}
            onBodyTypeChange={setSelectedBodyType}
          />
        </div>
      </div>
    </section>
  );
}
