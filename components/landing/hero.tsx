"use client";

import { useState } from "react";
import { HeroSearchForm } from "./hero-search-form";
import { useTranslations } from "next-intl";

export function Hero({ showSearch = true }: { showSearch?: boolean }) {
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

      {showSearch && (
        <div className="container relative z-20 mx-auto px-4 md:px-6">
          <div className="mx-auto w-full max-w-5xl -mb-40 md:-mb-52">
            <HeroSearchForm />
          </div>
        </div>
      )}
    </section>
  );
}
