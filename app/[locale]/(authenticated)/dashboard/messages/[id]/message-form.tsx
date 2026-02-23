"use client";

import { useRef } from "react";
import { sendMessage } from "@/app/actions/conversation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function MessageForm({ conversationId }: { conversationId: string }) {
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    const content = (formData.get("content") as string)?.trim();
    if (!content) return;
    const result = await sendMessage(conversationId, content);
    if (!result?.error) formRef.current?.reset();
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
      <Button type="submit">Send</Button>
    </form>
  );
}
