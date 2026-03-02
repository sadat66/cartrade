"use client";

import React, { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ListingCard } from "@/components/listing/listing-card";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

import { CardCarousel } from "@/components/shared/card-carousel";

type Listing = {
  id: string;
  title: string;
  make: string;
  model: string;
  year: number;
  mileage: number | null;
  price: any;
  imageUrls: string[];
  transmission?: string | null;
  drivetrain?: string | null;
};

export function NewCarsSection({ listings }: { listings: Listing[] }) {
  const t = useTranslations("newCars");

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-2xl font-extrabold text-[#1a1a1a] mb-10 tracking-tight">{t("title")}</h2>

        {listings.length > 0 ? (
          <CardCarousel>
            {listings.map((car) => (
              <ListingCard
                key={car.id}
                listing={{
                  ...car,
                  price: Number(car.price),
                  isDepositTaken: car.title.length % 7 === 0,
                  weeklyEstimate: Math.round(Number(car.price) / 200),
                  interestRate: 10.02
                }}
              />
            ))}
          </CardCarousel>
        ) : (
          <div className="flex flex-col items-center justify-center w-full py-12 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            <div className="size-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800">{t("noListings")}</h3>
            <p className="text-slate-500 mt-2 max-w-sm">{t("checkBack")}</p>
          </div>
        )}

        {/* View All Button - Business Class Style */}
        <div className="mt-12 flex justify-center">
          <Link 
            href="/cars" 
            className="group flex items-center gap-3 bg-[#3D0066] text-white rounded-full px-8 py-4 text-xs font-black uppercase tracking-[0.2em] transition-all hover:bg-[#2A0045] shadow-xl hover:shadow-2xl active:scale-95"
          >
            {t("browseAll")}
            <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
