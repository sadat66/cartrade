"use client";

import { useTranslations } from "next-intl";
import { Info } from "lucide-react";
import { VerticalStepper } from "@/components/shared/stepper";
import { ListingStrengthMeter } from "@/components/sell-car/form-steps";

interface FormSidebarProps {
  currentStep: number;
  steps: { id: number; title: string }[];
  listingStrength: number;
}

export function FormSidebar({ currentStep, steps, listingStrength }: FormSidebarProps) {
  const tDashboard = useTranslations("dashboard");

  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
          {tDashboard("addListing.title")}
        </h1>
        <p className="text-slate-400 font-bold text-sm leading-relaxed uppercase tracking-widest">
          {tDashboard("addListing.subtitle")}
        </p>
      </div>

      <VerticalStepper steps={steps} currentStep={currentStep} className="pl-2" />

      <div className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100/50 animate-in fade-in-0 duration-700">
        <div className="flex items-center gap-2 mb-2 text-[#3D0066]">
          <Info className="size-4" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Expert Tip</span>
        </div>
        <div className="text-xs font-medium text-slate-500 leading-relaxed">
          {currentStep === 1 && "Accuracy matters. Check your registration docs for the exact manufacturing year."}
          {currentStep === 2 && "Detailed mileage builds 40% more trust with potential buyers."}
          {currentStep === 3 && "High-quality photos in daylight can help your car sell up to 2x faster."}
          {currentStep === 4 && "Pinning an accurate location helps filter for serious, local inquiries."}
          {currentStep === 5 && "Double check everything! A professional listing attracts professional buyers."}
        </div>
      </div>

      <ListingStrengthMeter percentage={listingStrength} />
    </div>
  );
}
