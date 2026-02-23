"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import type { ComponentProps } from "react";

type SubmitButtonProps = ComponentProps<typeof Button> & {
  /** Shown when form is submitting. Default "Saving…" */
  loadingText?: string;
};

/**
 * Submit button that disables and shows loading state while the form is submitting.
 * Must be used inside a <form> (uses useFormStatus).
 */
export function SubmitButton({
  children,
  loadingText = "Saving…",
  disabled,
  ...props
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={disabled ?? pending} {...props}>
      {pending ? loadingText : children}
    </Button>
  );
}
