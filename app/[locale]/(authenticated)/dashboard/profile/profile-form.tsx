"use client";

import { useEffect } from "react";
import { useActionState } from "react";
import { toast } from "sonner";
import { updateProfile } from "@/app/actions/user";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { useTranslations } from "next-intl";

function formReducer(
  _state: { success?: boolean; error?: string },
  payload: { success?: boolean; error?: string } | null
) {
  return payload ?? {};
}

export function ProfileForm({
  defaultValues,
}: {
  defaultValues: { name: string; phone: string; location: string; bio: string };
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

  useEffect(() => {
    if (state?.success) toast.success(tCommon("profileUpdated"));
  }, [state?.success, tCommon]);
  useEffect(() => {
    if (state?.error) toast.error(tCommon("error"));
  }, [state?.error, tCommon]);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="name" className="text-sm font-medium">
          {t("name")}
        </label>
        <Input
          id="name"
          name="name"
          defaultValue={defaultValues.name}
          placeholder={t("namePlaceholder")}
          className="mt-1"
        />
      </div>
      <div>
        <label htmlFor="phone" className="text-sm font-medium">
          {t("phone")}
        </label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          defaultValue={defaultValues.phone}
          placeholder={t("phonePlaceholder")}
          className="mt-1"
        />
      </div>
      <div>
        <label htmlFor="location" className="text-sm font-medium">
          {t("location")}
        </label>
        <Input
          id="location"
          name="location"
          defaultValue={defaultValues.location}
          placeholder={t("locationPlaceholder")}
          className="mt-1"
        />
      </div>
      <div>
        <label htmlFor="bio" className="text-sm font-medium">
          {t("bio")}
        </label>
        <textarea
          id="bio"
          name="bio"
          defaultValue={defaultValues.bio}
          placeholder={t("bioPlaceholder")}
          rows={3}
          className="border-input mt-1 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
      {state?.error && (
        <p className="text-destructive text-sm">{state.error}</p>
      )}
      <SubmitButton loadingText={tCommon("saving")}>{t("saveChanges")}</SubmitButton>
    </form>
  );
}
