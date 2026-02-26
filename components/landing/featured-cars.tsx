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

  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true
  });

  const onSelect = useCallback((emblaApi: any) => {
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, []);

  React.useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const viewAllLabel = `View all ${currentBodyType.toUpperCase()}s`;

  return (
    <section className="bg-white pb-20">
      <div className="container mx-auto px-4 md:px-6 relative group">
        <div className="relative">
          {/* Embla Viewport */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentBodyType}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="overflow-hidden"
              ref={emblaRef}
            >
              <div className="flex gap-4 py-6 min-h-[400px]">
                {listings.length > 0 ? (
                  listings.map((car, index) => (
                    <div key={car.id} className="flex-[0_0_85%] sm:flex-[0_0_45%] lg:flex-[0_0_23.5%] min-w-0">
                      <ListingCard
                        listing={{
                          ...car,
                          price: Number(car.price),
                          isDepositTaken: car.title.length % 7 === 0,
                          weeklyEstimate: Math.round(Number(car.price) / 200),
                          interestRate: 10.02
                        }}
                      />
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center w-full py-12 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                    <div className="size-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">No {currentBodyType}s found</h3>
                    <p className="text-slate-500 mt-2 max-w-sm">We don't have any cars in this category right now. Please check back later or try a different size.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Right Gradient/Fade Overlay as seen in image */}
          {canScrollNext && (
            <div className="absolute top-0 right-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent pointer-events-none z-10 hidden lg:block" />
          )}

          {/* Navigation Buttons */}
          <button
            onClick={scrollPrev}
            className={cn(
              "absolute -left-5 top-1/2 -translate-y-1/2 z-30 size-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-800 shadow-xl hover:bg-slate-50 transition-all opacity-0 group-hover:opacity-100 hidden md:flex",
              !canScrollPrev && "md:hidden"
            )}
          >
            <ChevronLeft className="size-6" />
          </button>
          <button
            onClick={scrollNext}
            className={cn(
              "absolute -right-5 top-1/2 -translate-y-1/2 z-30 size-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-800 shadow-xl hover:bg-slate-50 transition-all md:flex",
              !canScrollNext && "md:hidden"
            )}
          >
            <ChevronRight className="size-6" />
          </button>
        </div>

        {/* View All Button - Deep Purple Style */}
        <div className="mt-16 flex justify-center">
          <Button asChild className="bg-[#3D0066] hover:bg-[#2A0045] text-white rounded-xl px-10 py-7 text-[15px] font-bold transition-all shadow-lg active:scale-95">
            <Link href={`/cars?bodyType=${currentBodyType}`} className="flex items-center gap-2">
              {viewAllLabel}
              <ChevronRight className="size-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
