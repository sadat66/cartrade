"use client";

import { useActionState, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { createListing } from "@/app/actions/listing";

const MAX_PHOTOS = 3;
const MAX_TOTAL_BYTES = 10 * 1024 * 1024; // 10MB
const MAX_SINGLE_BYTES = Math.floor(3.3 * 1024 * 1024); // ~3.3MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const STEPS = [
  { id: 1, title: "Vehicle" },
  { id: 2, title: "Specs" },
  { id: 3, title: "Price" },
  { id: 4, title: "Location" },
  { id: 5, title: "Review" },
];

export function useNewListingForm({ 
  onSuccess,
  action,
  initialData 
}: { 
  onSuccess?: (id: string) => void,
  action?: (fd: FormData) => Promise<{ error?: string, listingId?: string, vehicleId?: string }>,
  initialData?: Partial<{ dealershipId: string }>
} = {}) {
  const router = useRouter();
  const t = useTranslations("common.toast");
  
  const [currentStep, setCurrentStep] = useState(1);
  
  const [formData, setFormData] = useState({
    title: "",
    make: "",
    model: "",
    year: "",
    mileage: "",
    price: "",
    description: "",
    bodyType: "",
    transmission: "",
    drivetrain: "",
    color: "",
    condition: "used",
    ...initialData
  });
  
  const updateField = useCallback((field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const [previewUrls, setPreviewUrls] = useState<(string | null)[]>([null, null, null]);
  const [clearPhotoKeys, setClearPhotoKeys] = useState([0, 0, 0]);
  const [photoSizes, setPhotoSizes] = useState<number[]>([0, 0, 0]);

  const removePhoto = useCallback((index: number) => {
    setPreviewUrls((prev) => {
      const next = [...prev];
      if (next[index]) URL.revokeObjectURL(next[index]!);
      next[index] = null;
      return next;
    });
    setPhotoSizes((prev) => {
      const next = [...prev];
      next[index] = 0;
      return next;
    });
    setClearPhotoKeys((prev) => {
      const next = [...prev];
      next[index] += 1;
      return next;
    });
  }, []);

  const onPhotoChange = useCallback(
    (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] ?? null;
      if (!file) {
        removePhoto(index);
        return;
      }
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast.error("Only JPEG, PNG and WebP are allowed");
        e.target.value = "";
        return;
      }
      if (file.size > MAX_SINGLE_BYTES) {
        toast.error("Each photo must be 3.3MB or less");
        e.target.value = "";
        return;
      }
      setPreviewUrls((prev) => {
        const next = [...prev];
        if (next[index]) URL.revokeObjectURL(next[index]!);
        next[index] = URL.createObjectURL(file);
        return next;
      });
      setPhotoSizes((prev) => {
        const next = [...prev];
        next[index] = file.size;
        return next;
      });
    },
    [removePhoto]
  );

  const totalPhotoBytes = photoSizes.reduce((a, b) => a + b, 0);
  const totalPhotoOk = totalPhotoBytes <= MAX_TOTAL_BYTES;

  const listingStrength = useMemo(() => {
     let score = 0;
     if (formData.title) score += 10;
     if (formData.make && formData.model && formData.year) score += 20;
     if (formData.price) score += 20;
     if (formData.description.length > 50) score += 20;
     if (previewUrls.filter(v => v !== null).length === 3) score += 20;
     if (formData.bodyType && formData.transmission) score += 10;
     return score;
  }, [formData, previewUrls]);

  const [state, formAction] = useActionState(
    async (_prev: { error?: string }, fd: FormData) => {
      const result = action ? await action(fd) : await createListing(fd);
      if (result.error) {
        toast.error(result.error);
        return { error: result.error };
      }
      const res = result as any;
      const successId = res.listingId || res.vehicleId;
      if (successId) {
        toast.success(t("listingCreated"));
        if (onSuccess) {
          onSuccess(successId);
        } else {
          router.push("/cars/" + successId);
        }
      }
      return {};
    },
    {}
  );

  const handleNext = useCallback(() => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentStep]);

  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentStep]);

  return {
    currentStep,
    formData,
    updateField,
    previewUrls,
    clearPhotoKeys,
    totalPhotoBytes,
    totalPhotoOk,
    listingStrength,
    state,
    formAction,
    handleNext,
    handleBack,
    onPhotoChange,
    removePhoto,
    STEPS,
    setCurrentStep,
  };
}
