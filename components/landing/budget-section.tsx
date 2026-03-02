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
};

type BudgetRange = (typeof BUDGET_RANGES)[number];

export function BudgetSection({ listings }: { listings: Listing[] }) {
  const [activeBudget, setActiveBudget] = useState<BudgetRange>(BUDGET_RANGES[0]);
  const [indicatorProps, setIndicatorProps] = useState({ left: 0, width: 0, opacity: 0 });
  const tabsRef = useRef<HTMLDivElement>(null);
  const activeTabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  const updateIndicator = useCallback(() => {
    const activeTab = activeTabRefs.current[activeBudget.key];
    if (activeTab && tabsRef.current) {
      setIndicatorProps({
        left: activeTab.offsetLeft,
        width: activeTab.clientWidth,
        opacity: 1
      });
    }
  }, [activeBudget]);

  // Center selected item when activeBudget changes
  useEffect(() => {
    const activeTab = activeTabRefs.current[activeBudget.key];
    if (activeTab && tabsRef.current) {
      const container = tabsRef.current;
      
      const scrollLeft = activeTab.offsetLeft - (container.clientWidth / 2) + (activeTab.clientWidth / 2);
      container.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });
      
      const timer = setTimeout(updateIndicator, 300);
      return () => clearTimeout(timer);
    }
  }, [activeBudget, updateIndicator]);

  useEffect(() => {
    const timer = setTimeout(updateIndicator, 150);
    window.addEventListener('resize', updateIndicator);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateIndicator);
    };
  }, [updateIndicator]);

  const filteredListings = listings.filter(l => {
    const p = Number(l.price);
    return p >= activeBudget.min && p < activeBudget.max;
  });

  const handleScroll = useCallback(() => {
    // No-op for now
  }, []);

  return (
    <section className="bg-white/60 backdrop-blur-3xl border-t border-slate-100/50 rounded-[2.5rem] shadow-[0_20px_40px_-20px_rgba(0,0,0,0.03)] relative z-10 py-12 md:py-20 overflow-hidden mt-12">
      <div className="container mx-auto px-6 md:px-8">
        <div className="mb-8 md:mb-12">
           <h2 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">
             Looking for a perfect match for your budget?
           </h2>
        </div>

        {/* Tabs with Traveling Indicator */}
        <div className="relative mb-10 group/tabs px-4 md:px-0">
          <div 
             ref={tabsRef} 
             onScroll={handleScroll}
             className="flex items-end gap-8 md:gap-12 pb-3 overflow-x-auto overflow-y-hidden relative custom-scrollbar-hide scroll-smooth"
             style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
          >
            {BUDGET_RANGES.map((range) => {
              const isSelected = activeBudget.key === range.key;
              return (
                <button
                  key={range.key}
                  ref={(el) => { activeTabRefs.current[range.key] = el; }}
                  type="button"
                  onClick={() => setActiveBudget(range)}
                  className={cn(
                    "relative pb-1 text-[11px] md:text-xs font-black uppercase tracking-[0.2em] transition-all duration-500 shrink-0",
                    isSelected ? "text-[#3D0066]" : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  {range.label}
                </button>
              );
            })}

            {/* Static Base Line */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-100/80 rounded-full" />

            {/* Traveling Highlight Indicator */}
            <motion.div
              className="absolute bottom-0 h-0.5 bg-[#3D0066] rounded-full z-10"
              initial={false}
              animate={{
                left: indicatorProps.left,
                width: indicatorProps.width,
                opacity: indicatorProps.opacity
              }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 30,
                mass: 0.8
              }}
            />
          </div>
        </div>

        {/* Carousel Content */}
        {filteredListings.length > 0 ? (
          <CardCarousel>
            {filteredListings.map((car) => (
              <ListingCard 
                key={car.id}
                listing={{
                  ...car,
                  price: Number(car.price),
                  isDepositTaken: car.title.length % 7 === 0,
                  transmission: "Automatic",
                  weeklyEstimate: Math.round(Number(car.price) / 200),
                  interestRate: 10.02
                }} 
              />
            ))}
          </CardCarousel>
        ) : (
          <div className="flex flex-col items-center justify-center w-full py-20 text-center bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200 mx-2">
            <div className="size-16 bg-slate-100/50 rounded-full flex items-center justify-center mb-6 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
            </div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight">Focusing the collection...</h3>
            <p className="text-slate-500 text-sm mt-3 max-w-sm font-medium">We couldn't find any premium matches in the {activeBudget.label.toLowerCase()} range at this moment.</p>
          </div>
        )}

        {/* Action Link */}
        <div className="mt-12 flex justify-center">
          <Link 
            href={`/cars?maxPrice=${activeBudget.key === 'over-80' ? '' : activeBudget.max}&minPrice=${activeBudget.min}`} 
            className="group flex items-center gap-3 bg-[#3D0066] text-white rounded-full px-8 py-4 text-xs font-black uppercase tracking-[0.2em] transition-all hover:bg-[#2A0045] shadow-xl hover:shadow-2xl active:scale-95"
          >
            Explore all {activeBudget.label.toLowerCase()}
            <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
