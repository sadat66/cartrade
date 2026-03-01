"use client";

import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function BrowseBanner() {
  const t = useTranslations("browseBanner");

  return (
    <section className="pb-24 pt-4 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-[#FFAD7B] rounded-[1.5rem] overflow-hidden relative flex flex-col md:flex-row items-center p-8 md:p-10 min-h-[280px] border border-[#ff9c61]"
        >
          {/* Main Content Layout */}
          <div className="flex flex-col md:flex-row items-center justify-between w-full h-full gap-8">
            
            {/* Left Column: Image Area */}
            <div className="w-full md:w-5/12 flex items-center justify-center md:justify-start">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="relative w-full aspect-[16/9] md:h-[220px] lg:h-[260px]"
              >
                <Image
                  src="/banner-images/Browse_more_cars.png"
                  alt="Browse more cars"
                  fill
                  className="object-contain"
                  priority
                />
              </motion.div>
            </div>

            {/* Right Column: Text & CTA Area */}
            <div className="w-full md:w-7/12 flex flex-col items-center text-center z-10 px-2 lg:px-8">
              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-2xl lg:text-3xl xl:text-4xl font-black text-slate-900 leading-tight mb-4"
              >
                {t("title")}
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-slate-800 text-[15px] lg:text-lg xl:text-xl font-semibold mb-8 max-w-2xl leading-relaxed"
              >
                {t("subtitle")}
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <Button 
                    asChild
                    className="bg-[#3D0066] hover:bg-[#2d004d] text-white rounded-2xl px-12 py-7 text-lg lg:text-xl font-black shadow-2xl shadow-purple-900/30 transition-all hover:scale-105 active:scale-95"
                >
                  <Link href="/cars">
                    {t("button")}
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
