"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "@/i18n/navigation";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ListingCard, ListingCardSkeleton } from "@/components/listing/listing-card";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";

const BUDGET_RANGES = [
  { key: "under-25", label: "Under $25k", min: 0, max: 25000 },
  { key: "25-40", label: "$25-40k", min: 25000, max: 40000 },
  { key: "40-60", label: "$40-60k", min: 40000, max: 60000 },
  { key: "60-80", label: "$60-80k", min: 60000, max: 80000 },
  { key: "over-80", label: "Over $80k", min: 80000, max: 1000000 },
] as const;

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

type BudgetRange = (typeof BUDGET_RANGES)[number];

export function BudgetSection({ listings }: { listings: Listing[] }) {
  const [activeBudget, setActiveBudget] = useState<BudgetRange>(BUDGET_RANGES[0]);
  const [indicatorProps, setIndicatorProps] = useState({ left: 0, width: 0, opacity: 0 });
  const tabsRef = useRef<HTMLDivElement>(null);
  const activeTabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: "start", 
    containScroll: "trimSnaps",
    dragFree: true
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback((emblaApi: any) => {
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  const updateIndicator = useCallback(() => {
    const activeTab = activeTabRefs.current[activeBudget.key];
    if (activeTab && tabsRef.current) {
      const activeRect = activeTab.getBoundingClientRect();
      const parentRect = tabsRef.current.getBoundingClientRect();
      setIndicatorProps({
        left: activeRect.left - parentRect.left,
        width: activeRect.width,
        opacity: 1
      });
    }
  }, [activeBudget]);

  useEffect(() => {
    const timer = setTimeout(updateIndicator, 100);
    window.addEventListener('resize', updateIndicator);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateIndicator);
    };
  }, [activeBudget, updateIndicator]);

  const filteredListings = listings.filter(l => {
    const p = Number(l.price);
    return p >= activeBudget.min && p < activeBudget.max;
  });

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-2xl font-extrabold text-[#1a1a1a] mb-10 tracking-tight">
          Looking for a perfect match for your budget?
        </h2>

        {/* Tabs */}
        <div className="relative border-b border-slate-100 mb-8">
          <div ref={tabsRef} className="flex flex-wrap items-end gap-x-6 md:gap-x-10 relative pb-4">
            {BUDGET_RANGES.map((range) => {
              const isSelected = activeBudget.key === range.key;
              return (
                <button
                  key={range.key}
                  ref={(el) => { activeTabRefs.current[range.key] = el; }}
                  type="button"
                  onClick={() => setActiveBudget(range)}
                  className={cn(
                    "relative pb-2 text-sm font-bold transition-all duration-300",
                    isSelected ? "text-[#4B0082]" : "text-slate-500 hover:text-slate-800"
                  )}
                >
                  {range.label}
                </button>
              );
            })}

            {/* Sliding Indicator */}
            <motion.div
              className="absolute bottom-0 h-[4px] bg-[#4B0082] rounded-t-full z-10 shadow-[0_-2px_8px_rgba(75,0,130,0.3)]"
              initial={false}
              animate={{
                left: indicatorProps.left,
                width: indicatorProps.width,
                opacity: indicatorProps.opacity
              }}
              transition={{
                type: "spring",
                stiffness: 350,
                damping: 30,
              }}
            />
          </div>
        </div>

        {/* Carousel */}
        <div className="relative group">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeBudget.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
              ref={emblaRef}
            >
              <div className="flex gap-4 py-6 min-h-[400px]">
                {filteredListings.length > 0 ? (
                  filteredListings.map((car) => (
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
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">No cars found for this budget</h3>
                    <p className="text-slate-500 mt-2 max-w-sm">We couldn't find any matches in the {activeBudget.label.toLowerCase()} range. Try adjusting your range or explore all available options.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {canScrollNext && (
            <div className="absolute top-0 right-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent pointer-events-none z-10 hidden lg:block" />
          )}

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

        {/* Bottom Button */}
        <div className="mt-12 flex justify-center">
          <Button asChild className="bg-[#3D0066] hover:bg-[#2A0045] text-white rounded-xl px-10 py-7 text-[15px] font-bold transition-all shadow-lg active:scale-95">
            <Link href={`/cars?maxPrice=${activeBudget.key === 'over-80' ? '' : activeBudget.max}&minPrice=${activeBudget.min}`} className="flex items-center gap-2">
              Browse all cars {activeBudget.label.toLowerCase()}
              <ChevronRight className="size-5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
