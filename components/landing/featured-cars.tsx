"use client";

import React, { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ListingCard, ListingCardSkeleton } from "@/components/listing/listing-card";
import { Link } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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

export function FeaturedCars({
  listings,
  locale,
  activeBodyType,
}: {
  listings: Listing[];
  locale: string;
  activeBodyType: string;
}) {
  const currentBodyType = activeBodyType;
  const viewAllLabel = `View all ${currentBodyType.toUpperCase()}s`;

  return (
    <section className="bg-white pb-20">
      <div className="container mx-auto px-4 md:px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentBodyType}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
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
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800">No {currentBodyType}s found</h3>
                <p className="text-slate-500 mt-2 max-w-sm">We don't have any cars in this category right now. Please check back later or try a different size.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* View All Button - Business Class Style */}
        <div className="mt-16 flex justify-center">
          <Link 
            href={`/cars?bodyType=${currentBodyType}`} 
            className="group flex items-center gap-3 bg-[#3D0066] text-white rounded-full px-8 py-4 text-xs font-black uppercase tracking-[0.2em] transition-all hover:bg-[#2A0045] shadow-xl hover:shadow-2xl active:scale-95"
          >
            {viewAllLabel}
            <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
