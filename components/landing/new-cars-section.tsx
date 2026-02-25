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

  const t = useTranslations("newCars");

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4 md:px-6 relative group">
        <h2 className="text-2xl font-extrabold text-[#1a1a1a] mb-10 tracking-tight">{t("title")}</h2>
        
        <div className="relative">
          {/* Embla Viewport */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4 py-6 min-h-[400px]">
              {listings.length > 0 ? (
                listings.map((car) => (
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
                ))
              ) : (
                <div className="flex flex-col items-center justify-center w-full py-12 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                  <div className="size-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">{t("noListings")}</h3>
                  <p className="text-slate-500 mt-2 max-w-sm">{t("checkBack")}</p>
                </div>
              )}
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
              {t("browseAll")}
              <ChevronRight className="size-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
