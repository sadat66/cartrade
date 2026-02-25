"use client";

import React, { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ListingCard } from "@/components/listing/listing-card";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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

export function NewCarsSection({ listings }: { listings: Listing[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: "start", 
    containScroll: "trimSnaps",
    dragFree: true
  });

  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

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

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4 md:px-6 relative group">
        <h2 className="text-2xl font-extrabold text-[#1a1a1a] mb-10 tracking-tight">New cars every day</h2>
        
        <div className="relative">
          {/* Embla Viewport */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4 py-6">
              {listings.map((car) => (
                <div key={car.id} className="flex-[0_0_85%] sm:flex-[0_0_45%] lg:flex-[0_0_23.5%] min-w-0">
                  <ListingCard 
                    listing={{
                      ...car,
                      price: Number(car.price),
                      isDepositTaken: car.title.length % 7 === 0,
                      transmission: "Automatic",
                      weeklyEstimate: Math.round(Number(car.price) / 200),
                      interestRate: 10.02
                    }} 
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Gradient */}
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

        {/* View All Button */}
        <div className="mt-12 flex justify-center">
          <Button asChild className="bg-[#3D0066] hover:bg-[#2A0045] text-white rounded-xl px-10 py-7 text-[15px] font-bold transition-all shadow-lg active:scale-95">
            <Link href="/cars" className="flex items-center gap-2">
              Browse all cars
              <ChevronRight className="size-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
