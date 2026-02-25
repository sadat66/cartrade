"use client";

import React from "react";
import { motion } from "framer-motion";

export const PageLoader = () => {
  return (
    <div className="flex min-h-[calc(100vh-80px)] w-full items-center justify-center bg-[#F8FAFC]">
      <div className="flex items-center gap-2">
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
          className="h-2 w-2 rounded-full bg-[#3D0066] shadow-sm shadow-[#3D0066]/20"
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
          className="h-4 w-4 rounded-full bg-[#3D0066] shadow-md shadow-[#3D0066]/30"
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
          className="h-3 w-3 rounded-full bg-[#3D0066] shadow-sm shadow-[#3D0066]/20"
        />
      </div>
    </div>
  );
};
