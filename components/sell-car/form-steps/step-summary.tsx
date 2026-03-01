"use client";

import { ShieldCheck, FileText } from "lucide-react";
import { StepContainer, StepHeader } from "./ui";

export function StepSummary({ data }: { data: any }) {
  return (
    <StepContainer>
      <StepHeader 
        icon={ShieldCheck}
        title="Final Review"
        colorClass="bg-indigo-50 text-indigo-600"
        description="Review your details before publishing."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "Identity", value: `${data.year} ${data.make} ${data.model}` },
            { label: "Price", value: data.price ? `$${data.price}` : "Not set" },
            { label: "Type", value: data.bodyType || "Not set" },
            { label: "Mileage", value: data.mileage ? `${data.mileage} km` : "Not set" },
            { label: "Transmission", value: data.transmission || "Not set" },
            { label: "Color", value: data.color || "Not set" },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100/50">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{item.label}</p>
              <p className="text-sm font-bold text-slate-700">{item.value || "Not specified"}</p>
            </div>
          ))}
      </div>

      <div className="p-6 rounded-3xl bg-purple-50/50 border border-purple-100 flex items-start gap-4">
          <div className="size-10 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0">
             <FileText className="size-5 text-purple-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-purple-900 mb-1">Professional Verification</p>
            <p className="text-xs font-medium text-purple-700/70 leading-relaxed">
              Your listing will be visible to thousands of buyers instantly after publishing.
            </p>
          </div>
      </div>
    </StepContainer>
  );
}
