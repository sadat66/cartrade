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
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 md:pt-4 border-t border-slate-50">
      <Button
        type="button"
        variant="ghost"
        onClick={handleBack}
        disabled={currentStep === 1}
        className={cn(
          "w-full sm:w-auto rounded-xl h-12 px-8 font-bold text-slate-400 transition-all text-xs uppercase tracking-widest",
          currentStep === 1 ? "opacity-0 pointer-events-none" : "hover:bg-slate-50 hover:text-slate-900"
        )}
      >
        <ArrowLeft className="mr-2 size-4" />
        Back
      </Button>

      <div className="flex items-center gap-4 w-full sm:w-auto">
        {currentStep < totalSteps ? (
          <Button
            type="button"
            onClick={handleNext}
            className="w-full sm:w-auto bg-[#3D0066] hover:bg-[#2d004d] text-white rounded-xl h-12 px-10 font-black uppercase tracking-widest text-xs shadow-xl shadow-purple-900/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {isPenultimateStep ? "Review" : "Next Step"}
            <ArrowRight className="ml-2 size-4" />
          </Button>
        ) : (
          <Button
            type="submit"
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white rounded-xl h-12 px-10 font-black uppercase tracking-widest text-xs shadow-xl shadow-green-900/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Publish
            <CheckCircle2 className="ml-2 size-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
