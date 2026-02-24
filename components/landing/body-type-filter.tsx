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

export function BodyTypeFilter() {
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentBodyType = searchParams.get("bodyType") || "suv";
  
  const [indicatorProps, setIndicatorProps] = useState({ left: 0, width: 0, opacity: 0 });
  const tabsRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);

  const updateIndicator = useCallback(() => {
    if (activeTabRef.current && tabsRef.current) {
      const activeRect = activeTabRef.current.getBoundingClientRect();
      const parentRect = tabsRef.current.getBoundingClientRect();
      setIndicatorProps({
        left: activeRect.left - parentRect.left,
        width: activeRect.width,
        opacity: 1
      });
    }
  }, []);

  useEffect(() => {
    // Small delay to ensure browser has painted and refs are populated
    const timer = setTimeout(updateIndicator, 50);
    window.addEventListener('resize', updateIndicator);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateIndicator);
    };
  }, [currentBodyType, updateIndicator]);

  const handleSelect = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("bodyType", key);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="bg-white pt-12 pb-2">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-2xl font-extrabold text-[#1a1a1a] mb-10 tracking-tight">Looking for a specific size?</h2>
        
        <div className="relative border-b border-slate-100 mb-8">
          <div ref={tabsRef} className="flex flex-wrap items-end gap-x-8 md:gap-x-12 relative pb-4">
            {BODY_TYPES.map((type) => {
              const isSelected = currentBodyType === type.key;
              return (
                <button
                  key={type.key}
                  ref={isSelected ? activeTabRef : null}
                  type="button"
                  onClick={() => handleSelect(type.key)}
                  className={cn(
                    "flex flex-col items-center group relative min-w-[50px] transition-all duration-500 ease-out",
                    isSelected ? "opacity-100 scale-105" : "opacity-35 hover:opacity-100 grayscale"
                  )}
                >
                  <div className="relative h-14 w-24 md:h-16 md:w-28 mb-3">
                    <Image
                      src={type.image}
                      alt={type.label}
                      fill
                      className={cn(
                        "object-contain object-bottom transition-transform duration-500",
                        isSelected ? "scale-110" : "group-hover:scale-105"
                      )}
                    />
                  </div>
                  <span className={cn(
                    "text-[10px] md:text-[11px] font-black whitespace-nowrap uppercase tracking-widest transition-colors duration-500",
                    isSelected ? "text-[#4B0082]" : "text-slate-900"
                  )}>
                    {type.label}
                  </span>
                </button>
              );
            })}

            {/* Sliding Animated Indicator - The underline traversing the line */}
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
                mass: 1
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
