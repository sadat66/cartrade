"use client";

import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription,
  DialogClose
} from "@/components/ui/dialog";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ListingForm } from "./listing-form";
import { useRouter } from "next/navigation";

interface NewListingModalProps {
  trigger?: React.ReactNode;
  title: string;
  subtitle: string;
  action?: (fd: FormData) => Promise<{ error?: string, listingId?: string, vehicleId?: string }>;
  initialData?: Partial<{ dealershipId: string }>;
  onSuccess?: (id: string) => void;
}

export function NewListingModal({ trigger, title, subtitle, action, initialData, onSuccess }: NewListingModalProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleSuccess = (id: string) => {
    setOpen(false);
    if (onSuccess) {
      onSuccess(id);
    } else {
      router.push(`/cars/${id}`);
      router.refresh();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-[#3D0066] hover:bg-[#2A0045] text-white rounded-xl px-6 font-bold shadow-lg shadow-purple-900/10 transition-all active:scale-95">
            <Plus className="size-5 mr-2" />
            {title}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent 
        showCloseButton={false} 
        className="max-w-[85rem] w-full md:w-[95vw] lg:w-full h-full md:h-[80vh] max-h-[800px] overflow-hidden rounded-none md:rounded-[2rem] p-0 border-none bg-slate-50 shadow-2xl"
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Business Class Header */}
          <div className="flex-shrink-0 sticky top-0 z-50 bg-white/95 backdrop-blur-xl px-6 py-4 md:px-12 md:py-5 border-b border-slate-100/80 flex items-center justify-between shadow-sm">
             <div className="flex items-center gap-4 md:gap-5">
                <div className="size-10 md:size-11 rounded-xl bg-[#3D0066] flex items-center justify-center shadow-lg shadow-purple-900/10">
                   <Plus className="size-5 md:size-5 text-white" />
                </div>
                <div>
                   <DialogTitle className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">
                    {title}
                   </DialogTitle>
                   <DialogDescription className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-[0.15em] leading-tight">
                    {subtitle}
                   </DialogDescription>
                </div>
             </div>
             
             <div className="flex items-center gap-6">
                <div className="hidden sm:flex flex-col items-end opacity-40 -mr-4">
                    <span className="text-[8px] md:text-[10px] font-black text-slate-900 uppercase tracking-widest">Cartrade Enterprise</span>
                    <span className="text-[8px] md:text-[9px] font-bold text-slate-400 leading-none">Management Gateway</span>
                </div>
             </div>

             <DialogClose className="absolute top-4 right-4 md:top-4 md:right-5 z-[60] size-8 md:size-10 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-all active:scale-95 cursor-pointer">
                <X className="size-4 md:size-5" />
             </DialogClose>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/50">
                <ListingForm 
                  mode="modal" 
                  onSuccess={handleSuccess} 
                  action={action}
                  initialData={initialData}
                />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
