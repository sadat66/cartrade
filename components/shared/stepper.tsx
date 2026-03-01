import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface Step {
  id: number;
  title: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <div className={cn("isolate relative flex justify-between w-full max-w-4xl mx-auto mb-10 px-4", className)}>
      {/* Progress Line Base */}
      <div className="absolute top-5 left-9 right-9 h-0.5 bg-slate-100 z-0" />
      
      {/* Active Progress Line */}
      <div className="absolute top-5 left-9 right-9 h-0.5 overflow-hidden z-0">
        <div 
          className="h-full bg-[#3D0066] transition-all duration-500" 
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />
      </div>

      {steps.map((step) => {
        const isCompleted = currentStep > step.id;
        const isActive = currentStep === step.id;

        return (
          <div key={step.id} className="flex flex-col items-center gap-2">
            <div
              className={cn(
                "relative z-10 size-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                isCompleted 
                  ? "bg-[#3D0066] border-[#3D0066] text-white" 
                  : isActive 
                    ? "bg-white border-[#3D0066] text-[#3D0066] ring-4 ring-purple-50 shadow-lg" 
                    : "bg-white border-slate-200 text-slate-400"
              )}
            >
              {isCompleted ? (
                <Check className="size-5 stroke-[3px]" />
              ) : (
                <span className="text-sm font-black">{step.id}</span>
              )}
            </div>
            <span 
              className={cn(
                "text-[10px] md:text-[11px] font-black uppercase tracking-widest transition-colors duration-300",
                isActive ? "text-[#3D0066]" : "text-slate-400"
              )}
            >
              {step.title}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function VerticalStepper({ steps, currentStep, className }: StepperProps) {
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {steps.map((step, index) => {
        const isCompleted = currentStep > step.id;
        const isActive = currentStep === step.id;

        return (
          <div key={step.id} className="relative flex items-start gap-4">
            {/* Line connector */}
            {index !== steps.length - 1 && (
                <div 
                    className={cn(
                        "absolute left-5 top-10 w-0.5 h-10 z-0 transition-colors duration-500",
                        isCompleted ? "bg-[#3D0066]" : "bg-slate-100"
                    )}
                />
            )}

            <div
              className={cn(
                "relative z-10 size-10 shrink-0 rounded-2xl flex items-center justify-center border-2 transition-all duration-500",
                isCompleted 
                  ? "bg-[#3D0066] border-[#3D0066] text-white shadow-lg shadow-purple-900/10" 
                  : isActive 
                    ? "bg-white border-[#3D0066] text-[#3D0066] ring-4 ring-purple-50 shadow-md" 
                    : "bg-white border-slate-100 text-slate-300"
              )}
            >
              {isCompleted ? (
                <Check className="size-5 stroke-[4px]" />
              ) : (
                <span className="text-sm font-black tracking-tighter">{step.id.toString().padStart(2, '0')}</span>
              )}
            </div>

            <div className="flex flex-col pt-1">
              <span 
                className={cn(
                  "text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-500",
                  isActive ? "text-[#3D0066] translate-x-1" : isCompleted ? "text-slate-900" : "text-slate-300"
                )}
              >
                {step.title}
              </span>
              {isActive && (
                <span className="text-xs font-bold text-slate-400 mt-0.5 animate-in fade-in-0 slide-in-from-left-2 duration-700">
                    Currently Editing
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
