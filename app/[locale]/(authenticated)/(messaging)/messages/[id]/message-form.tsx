"use client";

import { useRef, useEffect } from "react";
import { toast } from "sonner";
import { sendMessage } from "@/app/actions/conversation";
import { useTranslations } from "next-intl";
import { SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MessageForm({ conversationId }: { conversationId: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const t = useTranslations("common.toast");
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto focus input on conversation load
  useEffect(() => {
    inputRef.current?.focus();
  }, [conversationId]);

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
    <form ref={formRef} action={handleSubmit} className="flex gap-3 items-end w-full relative group">
      <div className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 shadow-inner px-5 py-2.5 focus-within:ring-2 focus-within:ring-[#ff385c]/20 focus-within:border-[#ff385c] transition-all duration-300">
        <input
          ref={inputRef}
          name="content"
          type="text"
          placeholder="Type your message..."
          className="w-full bg-transparent outline-none h-9 text-slate-800 font-medium placeholder:text-slate-400 placeholder:font-normal text-[15px]"
          required
          autoComplete="off"
        />
      </div>
      <Button
        type="submit"
        size="icon"
        className="h-[58px] w-[58px] shrink-0 rounded-2xl bg-[#ff385c] hover:bg-[#e03150] active:scale-95 shadow-lg shadow-[#ff385c]/25 transition-all duration-300"
      >
        <SendHorizontal className="size-6 ml-1" />
      </Button>
    </form>
  );
}
