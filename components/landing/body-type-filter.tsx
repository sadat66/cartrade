"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BODY_TYPES = [
  { key: "suv", label: "SUV", image: "/herocar/Suv.png" },
  { key: "ute", label: "Ute", image: "/herocar/Ute.png" },
  { key: "hatch", label: "Hatch", image: "/herocar/Hatch.png" },
  { key: "offroad", label: "Off road", image: "/herocar/Offroad.png" },
  { key: "electric", label: "Electric", image: "/herocar/Electric.png" },
  { key: "performance", label: "Performance", image: "/herocar/Performance.png" },
  { key: "unique", label: "Unique", image: "/herocar/Unique.png" },
] as const;

export function BodyTypeFilter({
  activeBodyType: controlledType,
  onBodyTypeChange: controlledOnChange
}: {
  activeBodyType?: string;
  onBodyTypeChange?: (type: string) => void;
} = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale();

  const activeBodyType = controlledType ?? (searchParams.get("bodyType") || "suv");

  const onBodyTypeChange = (type: string) => {
    if (controlledOnChange) {
      controlledOnChange(type);
    } else {
      const params = new URLSearchParams(searchParams.toString());
      params.set("bodyType", type);
      router.push(`/${locale}/cars?${params.toString()}`, { scroll: false });
    }
  };
  const [indicatorProps, setIndicatorProps] = useState({ left: 0, width: 0, opacity: 0 });
  const [scrollState, setScrollState] = useState({ canScrollLeft: false, canScrollRight: true, progress: 0 });
  const tabsRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);

  const updateIndicator = useCallback(() => {
    if (activeTabRef.current && tabsRef.current) {
      const activeRect = activeTabRef.current.getBoundingClientRect();
      
      setIndicatorProps({
        left: activeTabRef.current.offsetLeft,
        width: activeRect.width,
        opacity: 1
      });
    }
  }, []);

  const handleScroll = useCallback(() => {
    if (tabsRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsRef.current;
      setScrollState({
        canScrollLeft: scrollLeft > 10,
        canScrollRight: scrollLeft < scrollWidth - clientWidth - 10,
        progress: (scrollLeft / (scrollWidth - clientWidth)) * 100
      });
    }
  }, []);

  const scrollBy = (direction: 'left' | 'right') => {
    if (tabsRef.current) {
      const scrollAmount = tabsRef.current.clientWidth * 0.6;
      tabsRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Center selected item when activeBodyType changes
  useEffect(() => {
    if (activeTabRef.current && tabsRef.current) {
      const tab = activeTabRef.current;
      const container = tabsRef.current;
      
      const scrollLeft = tab.offsetLeft - (container.clientWidth / 2) + (tab.clientWidth / 2);
      container.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });
      
      // Update indicator after positioning
      const timer = setTimeout(updateIndicator, 300);
      return () => clearTimeout(timer);
    }
  }, [activeBodyType, updateIndicator]);

  useEffect(() => {
    const timer = setTimeout(() => {
        updateIndicator();
        handleScroll();
    }, 150);
    window.addEventListener('resize', () => {
        updateIndicator();
        handleScroll();
    });
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateIndicator);
    };
  }, [updateIndicator, handleScroll]);

  return (
    <section className="bg-white/50 backdrop-blur-3xl border-t border-slate-100/50 rounded-t-[2.5rem] md:rounded-t-none shadow-[0_-20px_40px_-20px_rgba(0,0,0,0.05)] relative z-10 mt-0 md:mt-0 pt-8 pb-2 md:py-16 overflow-hidden">
      {/* Mobile Drawer Handle */}
      <div className="flex justify-center mb-6 md:hidden">
        <div className="w-10 h-1 rounded-full bg-slate-200/80 shadow-inner" />
      </div>

      <div className="container mx-auto px-6 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-2">
           <div>
              <h2 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">
                Looking for a specific size?
              </h2>
           </div>

           {/* Desktop Navigation */}
           <div className="hidden md:flex items-center gap-3 pb-1">
              <button 
                onClick={() => scrollBy('left')}
                className={cn(
                    "size-10 rounded-full border-2 border-slate-100 flex items-center justify-center transition-all bg-white shadow-sm",
                    scrollState.canScrollLeft ? "opacity-100 hover:border-[#3D0066] hover:text-[#3D0066]" : "opacity-20 cursor-not-allowed"
                )}
              >
                <motion.svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" whileHover={{ x: -2 }}><path d="M12.5 15L7.5 10L12.5 5"/></motion.svg>
              </button>
              <button 
                onClick={() => scrollBy('right')}
                className={cn(
                    "size-10 rounded-full border-2 border-slate-100 flex items-center justify-center transition-all bg-white shadow-sm",
                    scrollState.canScrollRight ? "opacity-100 hover:border-[#3D0066] hover:text-[#3D0066]" : "opacity-20 cursor-not-allowed"
                )}
              >
                <motion.svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" whileHover={{ x: 2 }}><path d="M7.5 5L12.5 10L7.5 15"/></motion.svg>
              </button>
           </div>
        </div>

        {/* Pro Horizontal Scroll Container */}
        <div className="relative group/tabs">
          <div 
            ref={tabsRef} 
            onScroll={handleScroll}
            className={cn(
                "flex items-end gap-10 md:gap-16 pb-3 overflow-x-auto overflow-y-hidden relative",
                "snap-x snap-mandatory scroll-smooth custom-scrollbar-hide",
                "px-4 md:px-0" // Centering affordance
            )}
            style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
          >
            {BODY_TYPES.map((type) => {
              const isSelected = activeBodyType === type.key;
              return (
                <button
                  key={type.key}
                  ref={isSelected ? activeTabRef : null}
                  type="button"
                  onClick={() => onBodyTypeChange(type.key)}
                  className={cn(
                    "flex flex-col items-center shrink-0 snap-center group relative transition-all duration-700 ease-out",
                    isSelected ? "opacity-100 scale-110 md:scale-105" : "opacity-30 grayscale hover:opacity-100 hover:grayscale-0"
                  )}
                >
                  <div className="relative h-14 w-24 md:h-18 md:w-32 mb-1">
                    <Image
                      src={type.image}
                      alt={type.label}
                      fill
                      sizes="(min-width: 768px) 128px, 96px"
                      className={cn(
                        "object-contain object-bottom transition-all duration-700",
                        isSelected ? "scale-110 -translate-y-1" : "group-hover:scale-105 group-hover:-translate-y-0.5"
                      )}
                    />
                  </div>
                  <span className={cn(
                    "text-[10px] md:text-[11px] font-black whitespace-nowrap uppercase tracking-[0.2em] transition-all duration-500",
                    isSelected ? "text-[#3D0066]" : "text-slate-900"
                  )}>
                    {type.label}
                  </span>
                </button>
              );
            })}

            {/* Full Length Base Line */}
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
      </div>
    </section>
  );
}
