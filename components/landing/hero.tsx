"use client";

import { useState } from "react";
import { HeroSearchForm } from "./hero-search-form";
import { useTranslations } from "next-intl";

export function Hero({ showSearch = true }: { showSearch?: boolean }) {
  const t = useTranslations("hero");

  return (
    <section className="relative flex min-h-[420px] w-full flex-col items-center justify-center md:min-h-[500px] mb-8 md:mb-16">
      {/* Background - Crisp and clear */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/background/backgroundHero.png)" }}
      />
      
      {/* Subtle top/bottom gradients for readability */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/50 to-transparent" />
      
      {/* Content – high contrast text */}
      <div className="container relative z-10 mx-auto px-4 pt-8 pb-16 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-white drop-shadow-lg md:text-7xl">
          {t("title")}
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg font-medium text-white/90 drop-shadow-md md:text-2xl">
          {t("subtitle")}
        </p>
      </div>

      {showSearch && (
        <div className="absolute bottom-0 left-0 z-20 w-full translate-y-1/2">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto w-full max-w-5xl">
              <HeroSearchForm />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
