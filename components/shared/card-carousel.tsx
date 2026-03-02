"use client";

import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface CardCarouselProps {
  children: React.ReactNode[];
  className?: string;
  slideClassName?: string;
  showArrows?: boolean;
  showDots?: boolean;
}

export function CardCarousel({
  children,
  className,
  slideClassName,
  showArrows = true,
  showDots = true,
}: CardCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onSelect = useCallback((emblaApi: any) => {
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  const onInit = useCallback((emblaApi: any) => {
    setScrollSnaps(emblaApi.scrollSnapList());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onInit(emblaApi);
    onSelect(emblaApi);
    emblaApi.on("reInit", onInit);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("select", onSelect);
  }, [emblaApi, onInit, onSelect]);

  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);
  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  return (
    <div className={cn("relative group w-full", className)}>
      {/* Viewport */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4 py-4">
          {children.map((child, index) => (
            <div 
              key={index} 
              className={cn(
                "flex-[0_0_85%] sm:flex-[0_0_45%] lg:flex-[0_0_23.5%] min-w-0 transition-opacity duration-300",
                slideClassName
              )}
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows (Visible on Tablets, Laptops, Desktops) */}
      {showArrows && (
        <>
          <button
            onClick={scrollPrev}
            className={cn(
              "absolute -left-5 top-1/2 -translate-y-1/2 z-30 size-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-800 shadow-xl hover:bg-slate-50 hover:text-[#3D0066] transition-all hidden sm:flex active:scale-90",
              !canScrollPrev && "sm:hidden"
            )}
            aria-label="Previous slide"
          >
            <ChevronLeft className="size-6" />
          </button>
          <button
            onClick={scrollNext}
            className={cn(
              "absolute -right-5 top-1/2 -translate-y-1/2 z-30 size-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-800 shadow-xl hover:bg-slate-50 hover:text-[#3D0066] transition-all hidden sm:flex active:scale-90",
              !canScrollNext && "sm:hidden"
            )}
            aria-label="Next slide"
          >
            <ChevronRight className="size-6" />
          </button>
        </>
      )}

      {/* Dots / Bullet Indicators (Visible on Mobile ONLY) */}
      {showDots && scrollSnaps.length > 1 && (
        <div className="flex justify-center gap-2 mt-6 sm:hidden">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                index === selectedIndex ? "w-8 bg-[#3D0066]" : "w-2 bg-slate-200"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
