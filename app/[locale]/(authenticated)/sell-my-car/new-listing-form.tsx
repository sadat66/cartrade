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
  StepSummary
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

export function NewListingForm() {
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
  } = useNewListingForm();

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
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start pb-20">
      {/* Sidebar Section */}
      <FormSidebar 
        currentStep={currentStep} 
        steps={STEPS} 
        listingStrength={listingStrength} 
      />

      {/* Main Content Area */}
      <div className="lg:col-span-8 space-y-8">
        <Stepper steps={STEPS} currentStep={currentStep} className="lg:hidden" />
        
        <Card className="w-full border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)] rounded-[3rem] overflow-hidden bg-white">
          <CardContent className="p-8 md:p-14 relative">
            <form
              ref={formRef}
              action={formAction}
              className="space-y-12"
              onSubmit={(e) => {
                if (currentStep < STEPS.length) {
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
              {/* Canonical Hidden Inputs for Data Integrity */}
              <div className="sr-only" aria-hidden="true">
                {Object.entries(formData).map(([key, value]) => (
                  <input key={key} type="hidden" name={key} value={value} />
                ))}
              </div>

              <FormLoadingOverlay />
              
              <div className="min-h-[440px]">
                <div data-step="1" className={cn(currentStep !== 1 && "hidden")}>
                    <StepVehicleBasics data={formData} onChange={updateField} />
                </div>
                
                <div data-step="2" className={cn(currentStep !== 2 && "hidden")}>
                    <StepTechnicalSpecs data={formData} onChange={updateField} />
                </div>

                <div data-step="3" className={cn(currentStep !== 3 && "hidden")}>
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
                </div>

                <div data-step="4" className={cn(currentStep !== 4 && "hidden")}>
                    <StepLocation />
                </div>

                <div data-step="5" className={cn(currentStep !== 5 && "hidden")}>
                    <StepSummary data={formData} />
                </div>
              </div>

              {state?.error && (
                <p className="text-destructive font-bold text-sm bg-red-50 p-5 rounded-2xl border border-red-100 animate-shake flex items-center gap-3">
                  <span className="size-2 rounded-full bg-red-500 animate-pulse" />
                  {state.error}
                </p>
              )}

              <FormFooter 
                currentStep={currentStep}
                totalSteps={STEPS.length}
                handleBack={handleBack}
                handleNext={handleNext}
                isPenultimateStep={currentStep === 4}
              />
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-slate-400 text-xs font-medium">
          Secure encrypted submission • Data protected by Cartrade Cloud
        </p>
      </div>
    </div>
  );
}
