"use client";

import { cn } from "@/lib/utils";

export function ListingStrengthMeter({ percentage }: { percentage: number }) {
    const isStrong = percentage > 70;
    const isMedium = percentage > 40;
    return (
        <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] scale-95 origin-left">
            <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-black uppercase tracking-widest text-slate-400">Strength</span>
                <span className={cn("text-[10px] font-black px-2.5 py-1 rounded-full", isStrong ? "bg-green-50 text-green-600" : isMedium ? "bg-orange-50 text-orange-600" : "bg-red-50 text-red-600")}>
                    {isStrong ? "Strong" : isMedium ? "Good" : "Weak"}
                </span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mb-4">
                <div className={cn("h-full transition-all duration-1000", isStrong ? "bg-green-500" : isMedium ? "bg-orange-500" : "bg-red-500")} style={{ width: `${percentage}%` }} />
            </div>
            <p className="text-[11px] font-medium text-slate-400 leading-relaxed">
                {isStrong ? "Excellent listing quality." : isMedium ? "Add more detail to boost trust." : "Weak listings get fewer views."}
            </p>
        </div>
    );
}
