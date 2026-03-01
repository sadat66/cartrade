"use client";

import { useRef } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Stepper, VerticalStepper } from "@/components/shared/stepper";
import { 
  StepVehicleBasics, 
  StepTechnicalSpecs, 
  StepPhotosPricing, 
  StepLocation,
  StepSummary,
  ListingStrengthMeter
} from "@/components/sell-car/form-steps";

import { useNewListingForm } from "./shared/use-listing-form";
import { FormSidebar } from "./shared/form-sidebar";
import { FormFooter } from "./shared/form-footer";

function FormLoadingOverlay() {
  const { pending } = useFormStatus();
  if (!pending) return null;
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center rounded-[2.5rem] bg-white/60 backdrop-blur-md animate-in fade-in-0 duration-300">
      <div className="flex flex-col items-center gap-4 bg-white p-10 rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(61,0,102,0.1)] border border-slate-50">
        <Loader2 className="size-12 animate-spin text-[#3D0066]" />
        <div className="text-center">
          <p className="text-xl font-black text-slate-900 tracking-tight">Securing Your Listing</p>
          <p className="text-sm font-medium text-slate-500 mt-1">Preparing your vehicle for the global market...</p>
        </div>
      </div>
    </div>
  );
}

interface ListingFormProps {
  mode?: "page" | "modal";
  onSuccess?: (id: string) => void;
  action?: (fd: FormData) => Promise<{ error?: string, listingId?: string, vehicleId?: string }>;
  initialData?: Partial<{ dealershipId: string }>;
}

export function ListingForm({ mode = "page", onSuccess, action, initialData }: ListingFormProps) {
  const {
    currentStep,
    setCurrentStep,
    formData,
    updateField,
    previewUrls,
    clearPhotoKeys,
    totalPhotoBytes,
    totalPhotoOk,
    listingStrength,
    state,
    formAction,
    onPhotoChange,
    removePhoto,
    STEPS,
  } = useNewListingForm({ onSuccess, action, initialData });

  const formRef = useRef<HTMLFormElement>(null);

  const handleNext = () => {
    // Client-side validation for the CURRENT step before moving forward
    if (formRef.current) {
      const currentStepContainer = formRef.current.querySelector(`[data-step="${currentStep}"]`);
      if (currentStepContainer) {
        const inputs = currentStepContainer.querySelectorAll("input, select, textarea");
        let stepIsValid = true;
        
        inputs.forEach((input: any) => {
          if (!input.checkValidity()) {
            input.reportValidity();
            stepIsValid = false;
          }
        });

        if (!stepIsValid) return;
      }
    }

    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
      if (mode === "page") window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      if (mode === "page") window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const stepsToRender = formData.dealershipId 
    ? STEPS.filter(s => s.id !== 4) // Skip Location for Dealerships
    : STEPS;

  const totalSteps = stepsToRender.length;

  if (mode === "modal") {
    return (
      <form 
        ref={formRef}
        action={formAction}
        className="flex-1 flex flex-col h-full overflow-hidden w-full max-w-4xl mx-auto"
        onSubmit={(e) => {
          if (currentStep < totalSteps) {
            e.preventDefault();
            handleNext();
            return;
          }
          if (!totalPhotoOk && totalPhotoBytes > 0) {
            e.preventDefault();
            toast.error("Total photo size must be 10MB or less");
          }
        }}
      >
        <div className="sr-only" aria-hidden="true">
          {Object.entries(formData).map(([key, value]) => (
            <input key={key} type="hidden" name={key} value={value as string} />
          ))}
        </div>

        {/* Fixed Top: Stepper */}
        <div className="flex-shrink-0 bg-white/80 backdrop-blur-md px-6 py-2 border-b border-slate-100/50 z-20">
          <Stepper steps={stepsToRender} currentStep={currentStep} className="scale-90 origin-center mb-2" />
        </div>

        {/* Scrollable Center: Inputs */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pt-0 pb-6">
          <div className="space-y-4 animate-in fade-in-0 duration-1000">
            <Card className="w-full border border-slate-100/50 bg-white shadow-xl shadow-slate-200/50 rounded-[1.5rem] overflow-hidden">
              <CardContent className="p-4 md:p-6 relative">
                <FormLoadingOverlay />
                <div className="min-h-[250px]" data-step={currentStep}>
                  {(() => {
                    const stepMeta = stepsToRender[currentStep - 1];
                    if (!stepMeta) return null;
                    
                    switch (stepMeta.id) {
                      case 1: return <StepVehicleBasics data={formData} onChange={updateField} />;
                      case 2: return <StepTechnicalSpecs data={formData} onChange={updateField} />;
                      case 3: return (
                        <StepPhotosPricing 
                          data={formData}
                          onChange={updateField}
                          previewUrls={previewUrls}
                          onPhotoChange={onPhotoChange}
                          removePhoto={removePhoto}
                          clearPhotoKeys={clearPhotoKeys}
                          totalPhotoBytes={totalPhotoBytes}
                          totalPhotoOk={totalPhotoOk}
                        />
                      );
                      case 4: return <StepLocation />;
                      case 5: return <StepSummary data={formData} />;
                      default: return null;
                    }
                  })()}
                </div>

                {state?.error && (
                  <p className="text-destructive font-bold text-sm bg-red-50 p-4 rounded-2xl border border-red-100 animate-shake flex items-center gap-3 mt-6">
                    <span className="size-2 rounded-full bg-red-500 animate-pulse" />
                    {state.error}
                  </p>
                )}
              </CardContent>
            </Card>

            <p className="text-center text-slate-400 text-[10px] font-black uppercase tracking-widest py-1">
                Secure Protocol • Encrypted Channel
            </p>
          </div>
        </div>

        {/* Fixed Bottom: Footer - Lifted with bottom clearance */}
        <div className="flex-shrink-0 bg-white border-t border-slate-100 px-6 pt-1 pb-4 md:px-8 md:pt-2 md:pb-6 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] z-20">
          <FormFooter 
            currentStep={currentStep}
            totalSteps={totalSteps}
            handleBack={handleBack}
            handleNext={handleNext}
            isPenultimateStep={currentStep === totalSteps - 1}
          />
        </div>
      </form>
    );
  }

  const formContent = (
      <div className="space-y-4 md:space-y-6 animate-in fade-in-0 duration-1000">
        <Card className={cn(
          "w-full border-none overflow-hidden bg-white shadow-xl shadow-slate-200/50",
          "rounded-none md:rounded-[1.5rem]"
        )}>
          <CardContent className="p-4 md:p-14 relative">
            <form
              ref={formRef}
              action={formAction}
              className="space-y-4 md:space-y-8"
              onSubmit={(e) => {
                if (currentStep < totalSteps) {
                  e.preventDefault();
                  handleNext();
                  return;
                }
                if (!totalPhotoOk && totalPhotoBytes > 0) {
                  e.preventDefault();
                  toast.error("Total photo size must be 10MB or less");
                }
              }}
            >
              <div className="sr-only" aria-hidden="true">
                {Object.entries(formData).map(([key, value]) => (
                  <input key={key} type="hidden" name={key} value={value as string} />
                ))}
              </div>

              <FormLoadingOverlay />
              
              <div className={cn("min-h-[300px] md:min-h-[400px]")} data-step={currentStep}>
                {(() => {
                  const stepMeta = stepsToRender[currentStep - 1];
                  if (!stepMeta) return null;
                  
                  switch (stepMeta.id) {
                    case 1: return <StepVehicleBasics data={formData} onChange={updateField} />;
                    case 2: return <StepTechnicalSpecs data={formData} onChange={updateField} />;
                    case 3: return (
                      <StepPhotosPricing 
                        data={formData}
                        onChange={updateField}
                        previewUrls={previewUrls}
                        onPhotoChange={onPhotoChange}
                        removePhoto={removePhoto}
                        clearPhotoKeys={clearPhotoKeys}
                        totalPhotoBytes={totalPhotoBytes}
                        totalPhotoOk={totalPhotoOk}
                      />
                    );
                    case 4: return <StepLocation />;
                    case 5: return <StepSummary data={formData} />;
                    default: return null;
                  }
                })()}
              </div>

              {state?.error && (
                <p className="text-destructive font-bold text-sm bg-red-50 p-5 rounded-2xl border border-red-100 animate-shake flex items-center gap-3">
                  <span className="size-2 rounded-full bg-red-500 animate-pulse" />
                  {state.error}
                </p>
              )}

              <FormFooter 
                currentStep={currentStep}
                totalSteps={totalSteps}
                handleBack={handleBack}
                handleNext={handleNext}
                isPenultimateStep={currentStep === totalSteps - 1}
              />
            </form>
          </CardContent>
        </Card>
      </div>
    );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 items-start gap-8 lg:gap-12 pb-10">
      {/* Sidebar - Desktop Only */}
      <div className="hidden lg:flex flex-col lg:col-span-4 sticky top-24 transition-all duration-500">
        <FormSidebar 
            currentStep={currentStep} 
            steps={stepsToRender} 
            listingStrength={listingStrength} 
        />
      </div>

      {/* Main Channel */}
      <div className="lg:col-span-8 space-y-8">
        <div className="lg:hidden space-y-6">
            <Stepper steps={stepsToRender} currentStep={currentStep} />
        </div>
        
        {formContent}

        <p className="text-center text-slate-400 text-[10px] font-black uppercase tracking-widest py-8">
            Secure Submission Protocol • Active Marketplace Encryption
        </p>
      </div>
    </div>
  );
}
