"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const PageLoader = ({ 
  transparent = false,
  className 
}: { 
  transparent?: boolean;
  className?: string;
}) => {
  return (
    <div className={cn(
      "flex w-full items-center justify-center transition-opacity duration-300",
      !transparent && "bg-white",
      !className?.includes('h-') && "min-h-[400px] flex-1",
      className
    )}>
      <div className="flex items-center gap-3">
        <motion.div
          animate={{
            y: ["0%", "-50%", "0%"],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="h-2 w-2 rounded-full bg-[#ff385c] shadow-sm shadow-[#ff385c]/20"
        />
        <motion.div
          animate={{
            y: ["0%", "-50%", "0%"],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.15,
          }}
          className="h-4 w-4 rounded-full bg-[#ff385c] shadow-md shadow-[#ff385c]/30"
        />
        <motion.div
          animate={{
            y: ["0%", "-50%", "0%"],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.3,
          }}
          className="h-3 w-3 rounded-full bg-[#ff385c] shadow-sm shadow-[#ff385c]/20"
        />
      </div>
    </div>
  );
};
