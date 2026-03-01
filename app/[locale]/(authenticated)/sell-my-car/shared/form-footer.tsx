"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormFooterProps {
  currentStep: number;
  totalSteps: number;
  handleBack: () => void;
  handleNext: () => void;
  isPenultimateStep: boolean;
}

export function FormFooter({ 
  currentStep, 
  totalSteps, 
  handleBack, 
  handleNext,
  isPenultimateStep 
}: FormFooterProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-10 border-t border-slate-50">
      <Button
        type="button"
        variant="ghost"
        onClick={handleBack}
        disabled={currentStep === 1}
        className={cn(
          "w-full sm:w-auto rounded-2xl h-14 px-10 font-bold text-slate-400 transition-all",
          currentStep === 1 ? "opacity-0 pointer-events-none" : "hover:bg-slate-50 hover:text-slate-900"
        )}
      >
        <ArrowLeft className="mr-3 size-5" />
        Previous Step
      </Button>

      <div className="flex items-center gap-6 w-full sm:w-auto">
        <div className="hidden md:flex flex-col items-end">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Progress</span>
          <span className="text-sm font-bold text-[#3D0066]">
            {Math.round(((currentStep - 1) / (totalSteps - 1)) * 100)}% Complete
          </span>
        </div>
        
        {currentStep < totalSteps ? (
          <Button
            type="button"
            onClick={handleNext}
            className="w-full sm:w-auto bg-[#3D0066] hover:bg-[#2d004d] text-white rounded-[1.25rem] h-14 px-12 font-black shadow-2xl shadow-purple-900/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {isPenultimateStep ? "Review Listing" : "Next Step"}
            <ArrowRight className="ml-3 size-5" />
          </Button>
        ) : (
          <Button
            type="submit"
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white rounded-[1.25rem] h-14 px-12 font-black shadow-2xl shadow-green-900/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Publish Listing
            <CheckCircle2 className="ml-3 size-5" />
          </Button>
        )}
      </div>
    </div>
  );
}
