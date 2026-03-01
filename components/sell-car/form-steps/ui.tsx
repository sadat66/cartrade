"use client";

import { FormField } from "@/components/shared/form-field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export function StepHeader({ icon: Icon, title, description, colorClass = "bg-purple-50 text-[#3D0066]" }: {
  icon: any;
  title: string;
  description: string;
  colorClass?: string;
}) {
  return (
    <div className="flex items-center gap-4 mb-2 pb-6 border-b border-slate-50">
      <div className={cn("size-12 rounded-2xl flex items-center justify-center", colorClass)}>
        <Icon className="size-6" />
      </div>
      <div>
        <h3 className="text-xl font-black text-slate-900 leading-tight">{title}</h3>
        <p className="text-sm font-medium text-slate-400">{description}</p>
      </div>
    </div>
  );
}

export function FormSelect({ label, description, options, value, onValueChange, placeholder, name, required }: {
  label: string;
  description?: string;
  options: readonly string[];
  value: string;
  onValueChange: (v: string) => void;
  placeholder: string;
  name: string;
  required?: boolean;
}) {
  return (
    <FormField id={name} label={label} description={description} required={required}>
      <Select value={value || "none"} onValueChange={(v) => onValueChange(v === "none" ? "" : v)}>
        <SelectTrigger className={cn("h-13 rounded-2xl border-slate-200 bg-white px-5 text-base font-medium transition-all focus:ring-4 focus:ring-purple-500/5 focus:border-[#3D0066]", !value && "text-muted-foreground")}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="rounded-2xl border-slate-200 shadow-2xl">
          <SelectItem value="none" className="font-medium text-slate-400">{placeholder}</SelectItem>
          {options.map((opt) => (
            <SelectItem key={opt} value={opt} className="font-medium text-slate-700 py-3 capitalize">
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <input type="hidden" name={name} value={value} />
    </FormField>
  );
}

export function StepContainer({ children }: { children: React.ReactNode }) {
    return (
        <div className="space-y-8 animate-in fade-in-0 slide-in-from-right-4 duration-500">
            {children}
        </div>
    );
}
