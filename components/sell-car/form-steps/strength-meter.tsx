"use client";

import { cn } from "@/lib/utils";

export function ListingStrengthMeter({ percentage }: { percentage: number }) {
    const isStrong = percentage > 70;
    const isMedium = percentage > 40;
    return (
        <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] scale-[0.98] origin-left">
            <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Market Power</span>
                <span className={cn(
                    "text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest", 
                    isStrong ? "bg-green-500 text-white" : isMedium ? "bg-amber-500 text-white" : "bg-red-500 text-white"
                )}>
                    {isStrong ? "Elite" : isMedium ? "Standard" : "Low"}
                </span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-4 p-0.5">
                <div 
                    className={cn(
                        "h-full rounded-full transition-all duration-1000 shadow-sm", 
                        isStrong ? "bg-green-400" : isMedium ? "bg-amber-400" : "bg-red-400"
                    )} 
                    style={{ width: `${percentage}%` }} 
                />
            </div>
            <p className="text-[11px] font-bold text-slate-400 leading-relaxed uppercase tracking-tighter">
                {isStrong ? "Optimized for maximum conversion." : isMedium ? "Enhance specs to reach Elite status." : "Listing requires immediate calibration."}
            </p>
        </div>
    );
}
