"use client";

import { useActionState } from "react";
import { updateProfile } from "@/app/actions/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
    {}
  );

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="name" className="text-sm font-medium">
          Name
        </label>
        <Input
          id="name"
          name="name"
          defaultValue={defaultValues.name}
          placeholder="Your name"
          className="mt-1"
        />
      </div>
      <div>
        <label htmlFor="phone" className="text-sm font-medium">
          Phone
        </label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          defaultValue={defaultValues.phone}
          placeholder="+61 ..."
          className="mt-1"
        />
      </div>
      <div>
        <label htmlFor="location" className="text-sm font-medium">
          Location
        </label>
        <Input
          id="location"
          name="location"
          defaultValue={defaultValues.location}
          placeholder="e.g. Sydney, NSW"
          className="mt-1"
        />
      </div>
      <div>
        <label htmlFor="bio" className="text-sm font-medium">
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          defaultValue={defaultValues.bio}
          placeholder="A short bio for buyers/sellers"
          rows={3}
          className="border-input mt-1 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
      {state?.error && (
        <p className="text-destructive text-sm">{state.error}</p>
      )}
      {state?.success && (
        <p className="text-muted-foreground text-sm">Profile updated.</p>
      )}
      <Button type="submit">Save changes</Button>
    </form>
  );
}
