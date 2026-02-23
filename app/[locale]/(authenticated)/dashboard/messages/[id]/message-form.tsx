"use client";

import { useRef } from "react";
import { toast } from "sonner";
import { sendMessage } from "@/app/actions/conversation";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { useTranslations } from "next-intl";

export function MessageForm({ conversationId }: { conversationId: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const t = useTranslations("common.toast");

  async function handleSubmit(formData: FormData) {
    const content = (formData.get("content") as string)?.trim();
    if (!content) return;
    const result = await sendMessage(conversationId, content);
    if (result?.error) {
      toast.error(t("error"));
      return;
    }
    formRef.current?.reset();
    toast.success(t("messageSent"));
  }

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      className="flex gap-2 border-t pt-4"
    >
      <Input
        name="content"
        placeholder="Type a message..."
        className="flex-1"
        required
      />
      <SubmitButton loadingText={t("sending")}>Send</SubmitButton>
    </form>
  );
}
