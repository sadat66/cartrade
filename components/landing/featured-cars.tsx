"use client";

import React, { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ListingCard } from "@/components/listing/listing-card";
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
};

export function FeaturedCars({
  listings,
  locale,
}: {
  listings: Listing[];
  locale: string;
}) {
  const searchParams = useSearchParams();
  const currentBodyType = searchParams.get("bodyType") || "SUV";
  
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

  if (listings.length === 0) return null;

  // Filter listings based on selected body type if needed, 
  // but usually this would be handled by server-side re-fetching
  // For now we'll just show the cars passed down.

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
              <div className="flex gap-4 py-6">
                {listings.map((car, index) => (
                  <div key={car.id} className="flex-[0_0_85%] sm:flex-[0_0_45%] lg:flex-[0_0_23.5%] min-w-0">
                    <ListingCard 
                      listing={{
                        ...car,
                        price: Number(car.price),
                        isDepositTaken: car.title.length % 7 === 0, // Deterministic check
                        transmission: "Automatic",
                        weeklyEstimate: Math.round(Number(car.price) / 200),
                        interestRate: 10.02
                      }} 
                    />
                  </div>
                ))}
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
