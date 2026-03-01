"use client";

import { FormInput, FormField } from "@/components/shared/form-field";
import { Button } from "@/components/ui/button";
import { DollarSign, ImagePlus, X } from "lucide-react";
import { StepContainer, StepHeader } from "./ui";
import { MAX_TOTAL_BYTES } from "./constants";
import { cn } from "@/lib/utils";

export function StepPhotosPricing({
  data,
  onChange,
  previewUrls,
  onPhotoChange,
  removePhoto,
  clearPhotoKeys,
  totalPhotoBytes,
  totalPhotoOk,
}: {
  data: any;
  onChange: (field: string, value: any) => void;
  previewUrls: (string | null)[];
  onPhotoChange: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void;
  removePhoto: (index: number) => void;
  clearPhotoKeys: number[];
  totalPhotoBytes: number;
  totalPhotoOk: boolean;
}) {
  return (
    <StepContainer>
      <StepHeader 
        icon={DollarSign}
        title="Price & Showcase"
        colorClass="bg-green-50 text-green-600"
        description="Set your price and upload stunning photos."
      />

      <FormInput
        id="price"
        name="price"
        type="number"
        min={0}
        step={0.01}
        label="Asking Price"
        value={data.price}
        onChange={(e) => onChange("price", e.target.value)}
        description="Price you'd like to receive ($)."
        placeholder="e.g. 25000"
        required
      />

      <FormField label="Full Description" id="description" description="Highlight status and service history.">
        <textarea
          id="description"
          name="description"
          rows={5}
          value={data.description}
          onChange={(e) => onChange("description", e.target.value)}
          placeholder="e.g. Pristine condition, one owner..."
          className="w-full min-h-[160px] rounded-2xl border-slate-200 bg-white px-5 py-4 text-base font-medium text-slate-900 transition-all duration-300 focus:border-[#3D0066] focus:outline-none focus:ring-4 focus:ring-purple-500/5 focus:shadow-[0_0_0_1px_#3D0066] placeholder:text-slate-300"
        />
      </FormField>

      <div className="space-y-4">
        <p className="text-[13px] font-black uppercase tracking-wider text-slate-500">Vehicle Gallery (Max 3)</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[0, 1, 2].map((i) => (
            <div key={i} className="group relative aspect-square rounded-[2rem] border-2 border-dashed border-slate-200 bg-slate-50 overflow-hidden transition-all hover:border-[#3D0066] hover:bg-white">
              <label htmlFor={`photo${i + 1}`} className="flex flex-col items-center justify-center p-6 h-full w-full cursor-pointer">
                {previewUrls[i] ? (
                  <img src={previewUrls[i]!} alt={`Preview ${i + 1}`} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                ) : (
                  <>
                    <div className="size-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-300 group-hover:text-[#3D0066] transition-colors mb-3">
                      <ImagePlus className="size-6" />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-600 transition-colors">
                      {i === 0 ? "Cover Photo" : "Add More"}
                    </span>
                  </>
                )}
              </label>
              <input id={`photo${i+1}`} key={`ph-${i}-${clearPhotoKeys[i]}`} name={`photo${i+1}`} type="file" accept="image/*" className="sr-only" onChange={(e) => onPhotoChange(i, e)} />
              {previewUrls[i] && (
                <Button type="button" size="icon" className="absolute -right-2 -top-2 size-9 rounded-2xl bg-white shadow-xl border border-slate-100 hover:text-red-500 transition-all z-10" onClick={() => removePhoto(i)}>
                  <X className="size-4.5" />
                </Button>
              )}
            </div>
          ))}
        </div>
        
        {totalPhotoBytes > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
               <div className={cn("h-full transition-all duration-500", totalPhotoOk ? "bg-green-500" : "bg-red-500")} style={{ width: `${Math.min((totalPhotoBytes / MAX_TOTAL_BYTES) * 100, 100)}%` }} />
            </div>
            <p className={cn("text-[10px] font-black", totalPhotoOk ? "text-slate-400" : "text-red-500")}>
              {(totalPhotoBytes / (1024 * 1024)).toFixed(1)}MB / 10MB
            </p>
          </div>
        )}
      </div>
    </StepContainer>
  );
}
