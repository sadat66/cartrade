"use client";

import React, { useCallback } from "react";
import { useTranslations } from "next-intl";
import { Star, Quote, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Testimonials() {
  const t = useTranslations();
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: "start",
    loop: true,
    skipSnaps: false
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const reviews = [
    { id: "user1", avatar: "SJ", color: "text-blue-600 bg-blue-50" },
    { id: "user2", avatar: "DC", color: "text-emerald-600 bg-emerald-50" },
    { id: "user3", avatar: "MR", color: "text-purple-600 bg-purple-50" },
    { id: "user4", avatar: "ET", color: "text-orange-600 bg-orange-50" },
    { id: "user5", avatar: "RW", color: "text-indigo-600 bg-indigo-50" },
    { id: "user6", avatar: "LW", color: "text-rose-600 bg-rose-50" },
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Title & Controls */}
          <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 mb-6">
              <CheckCircle2 className="size-3.5 text-[#ff385c]" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Verified Reviews</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl xl:text-6xl font-black text-slate-900 tracking-tight leading-none mb-6">
              {t("reviews.title")}
            </h2>
            
            <p className="text-slate-500 text-lg font-medium mb-10 max-w-sm">
              {t("reviews.subtitle")}
            </p>

            {/* Navigation Buttons - Hidden on Mobile, shown on Desktop */}
            <div className="hidden lg:flex items-center gap-3">
              <Button 
                onClick={scrollPrev}
                variant="outline"
                size="icon"
                className="size-12 rounded-2xl border-2 border-slate-100 hover:border-[#ff385c] hover:bg-[#ff385c] hover:text-white transition-all duration-300 group"
              >
                <ChevronLeft className="size-6" />
              </Button>
              <Button 
                onClick={scrollNext}
                variant="outline"
                size="icon"
                className="size-12 rounded-2xl border-2 border-slate-100 hover:border-[#ff385c] hover:bg-[#ff385c] hover:text-white transition-all duration-300 group"
              >
                <ChevronRight className="size-6" />
              </Button>
            </div>
          </div>

          {/* Right Column: Carousel */}
          <div className="lg:col-span-8">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex">
                {reviews.map((review) => (
                  <div 
                    key={review.id} 
                    className="flex-[0_0_100%] sm:flex-[0_0_50%] pl-4 first:pl-0"
                  >
                    <div className="bg-slate-50/50 p-8 md:p-10 rounded-[2.5rem] border border-slate-100 h-full flex flex-col group transition-all duration-500 hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50">
                      <div className="flex justify-between items-start mb-8">
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="size-3.5 fill-[#ff385c] text-[#ff385c]" />
                          ))}
                        </div>
                        <Quote className="size-10 text-slate-200 group-hover:text-[#ff385c]/10 transition-colors" />
                      </div>

                      <div className="flex-1">
                        <p className="text-slate-700 text-[16px] md:text-[17px] leading-relaxed font-semibold italic mb-8">
                          "{t(`reviews.${review.id}.content`)}"
                        </p>
                      </div>

                      <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
                        <div className={cn(
                          "size-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-sm transition-transform group-hover:scale-110",
                          review.color
                        )}>
                          {review.avatar}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-900 leading-none mb-1.5 truncate">
                            {t(`reviews.${review.id}.name`)}
                          </h4>
                          <p className="text-slate-400 text-[11px] font-black tracking-widest uppercase truncate border-b border-transparent group-hover:border-[#ff385c]/30 transition-all">
                            {t(`reviews.${review.id}.role`)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Simple indicators for mobile */}
            <div className="flex lg:hidden justify-center items-center gap-3 mt-8">
              <Button 
                onClick={scrollPrev}
                variant="outline"
                size="icon"
                className="size-10 rounded-xl border-slate-100"
              >
                <ChevronLeft className="size-5" />
              </Button>
              <Button 
                onClick={scrollNext}
                variant="outline"
                size="icon"
                className="size-10 rounded-xl border-slate-100"
              >
                <ChevronRight className="size-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
