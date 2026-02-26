import { MessageSquare } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function MessagesIndexPage() {
  const t = await getTranslations();

  return (
    <div className="hidden md:flex flex-col items-center justify-center h-full w-full bg-slate-50/50 text-center p-8 animate-in fade-in-0 duration-500">
      <div className="h-28 w-28 rounded-full bg-white flex items-center justify-center mb-6 shadow-xl ring-8 ring-slate-100/50">
        <MessageSquare className="size-12 text-slate-300" />
      </div>
      <h3 className="text-2xl font-extrabold text-slate-800 mb-2">Your Messages</h3>
      <p className="text-slate-500 max-w-sm font-medium">
        Select a conversation from the sidebar to view your chat or continue messaging.
      </p>
    </div>
  );
}
