"use client";

import { useEffect, useState, useRef } from "react";
import { useActionState } from "react";
import { toast } from "sonner";
import { updateProfile } from "@/app/actions/user";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { useTranslations } from "next-intl";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";

export function ProfileForm({
  user,
}: {
  user: {
    name: string | null;
    email: string;
    phone: string | null;
    location: string | null;
    bio: string | null;
    image: string | null;
  };
}) {
  const [state, formAction] = useActionState(
    async (_prev: { success?: boolean; error?: string }, formData: FormData) => {
      const result = await updateProfile(formData);
      return result.error ? { error: result.error } : { success: true };
    },
    { success: false }
  );

  const t = useTranslations("dashboard.profile");
  const tCommon = useTranslations("common.toast");

  const [previewUrl, setPreviewUrl] = useState<string | null>(user.image);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state?.success) toast.success(tCommon("profileUpdated"));
  }, [state?.success, tCommon]);

  useEffect(() => {
    if (state?.error) toast.error(state.error || tCommon("error"));
  }, [state?.error, tCommon]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  return (
    <form action={formAction} className="space-y-8">
      {/* Profile Header within Form */}
      <div className="flex flex-col items-center gap-6 border-b pb-6 sm:flex-row">
        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
          <div className="h-24 w-24 overflow-hidden rounded-full ring-4 ring-muted ring-offset-2 transition-all group-hover:ring-primary/50">
            <Avatar className="h-full w-full">
              <AvatarImage
                src={previewUrl ?? undefined}
                className="object-cover"
              />
              <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
                {(user.name || user.email || "U").charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 rounded-full">
              <Camera className="h-8 w-8 text-white" />
            </div>
          </div>
          <input
            type="file"
            name="image"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />
        </div>

        <div className="flex-1 space-y-1 text-center sm:text-left">
          <h2 className="text-xl font-semibold">{user.name || t("noNameSet")}</h2>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <div className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="h-8"
            >
              {t("changePicture")}
            </Button>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            {t("name")}
          </label>
          <Input
            id="name"
            name="name"
            defaultValue={user.name ?? ""}
            placeholder={t("namePlaceholder")}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium">
            {t("phone")}
          </label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            defaultValue={user.phone ?? ""}
            placeholder={t("phonePlaceholder")}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="location" className="text-sm font-medium">
            {t("location")}
          </label>
          <Input
            id="location"
            name="location"
            defaultValue={user.location ?? ""}
            placeholder={t("locationPlaceholder")}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <label htmlFor="bio" className="text-sm font-medium">
            {t("bio")}
          </label>
          <textarea
            id="bio"
            name="bio"
            defaultValue={user.bio ?? ""}
            placeholder={t("bioPlaceholder")}
            rows={4}
            className="border-input w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm outline-none transition-all focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </div>

      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}

      <div className="flex justify-end pt-4">
        <SubmitButton className="w-full sm:w-auto px-8" loadingText={tCommon("saving")}>
          {t("saveChanges")}
        </SubmitButton>
      </div>
    </form>
  );
}
