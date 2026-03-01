import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface FormFieldProps {
  label: string;
  description?: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
  id?: string;
  required?: boolean;
}

export function FormField({ 
  label, 
  description,
  error, 
  className, 
  children, 
  id,
  required 
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2.5", className)}>
      <div className="flex flex-col gap-1">
        <label htmlFor={id} className="text-[13px] font-black uppercase tracking-wider text-slate-500">
          {label} {required && <span className="text-[#ff385c]">*</span>}
        </label>
        {description && (
          <p className="text-xs font-medium text-slate-400">
            {description}
          </p>
        )}
      </div>
      {children}
      {error && (
        <p className="text-xs font-medium text-destructive animate-in fade-in-0 slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
}

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  description?: string;
  error?: string;
  containerClassName?: string;
}

export function FormInput({ 
  label, 
  description,
  error, 
  containerClassName, 
  id, 
  required,
  ...props 
}: FormInputProps) {
  return (
    <FormField label={label} description={description} error={error} className={containerClassName} id={id} required={required}>
      <Input
        id={id}
        required={required}
        className={cn(
          "h-13 rounded-2xl border-slate-200 bg-white px-5 text-base font-medium text-slate-900 transition-all duration-300",
          "focus:border-[#3D0066] focus:ring-4 focus:ring-purple-500/5 focus:shadow-[0_0_0_1px_#3D0066]",
          "placeholder:text-slate-300",
          error && "border-destructive focus:border-destructive focus:ring-destructive/10"
        )}
        {...props}
      />
    </FormField>
  );
}
