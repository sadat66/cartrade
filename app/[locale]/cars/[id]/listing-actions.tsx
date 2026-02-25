"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Link } from "@/i18n/navigation";
import { Heart } from "lucide-react";
import { saveListing, unsaveListing } from "@/app/actions/user";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

type Props = {
  listingId: string;
  isSaved: boolean;
  isOwner: boolean;
  isLoggedIn: boolean;
  sellerId: string;
};

export function ListingActions({
  listingId,
  isSaved,
  isOwner,
  isLoggedIn,
}: Props) {
  const [pending, startTransition] = useTransition();
  const t = useTranslations();
  const tToast = useTranslations("common.toast");

  const handleSave = () => {
    startTransition(async () => {
      const result = isSaved
        ? await unsaveListing(listingId)
        : await saveListing(listingId);
      if (result?.error) {
        toast.error(tToast("error"));
        return;
      }
      toast.success(
        isSaved ? tToast("listingRemoved") : tToast("listingSaved")
      );
    });
  };

  if (!isLoggedIn) {
    return (
      <div className="flex flex-wrap gap-2">
        <Button asChild variant="outline" size="sm">
          <Link href={`/login?next=/cars/${listingId}`}>
            <Heart className="size-4 mr-1.5" />
            {t("listing.save")}
          </Link>
        </Button>
        {!isOwner && (
          <Button asChild size="sm" className="bg-[#3D0066] hover:bg-[#2A0045] text-white rounded-lg px-6 font-bold shadow-md shadow-purple-900/10 transition-all active:scale-95">
            <Link href={`/login?next=/cars/${listingId}`}>{t("listing.contactSeller")}</Link>
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        type="button"
        variant={isSaved ? "default" : "outline"}
        size="sm"
        onClick={handleSave}
        disabled={pending}
        className={cn(
          "rounded-lg px-4 transition-all",
          isSaved && "bg-slate-900 text-white hover:bg-slate-800 border-transparent shadow-md"
        )}
      >
        <Heart
          className={cn("size-4 mr-1.5", isSaved && "fill-current")}
        />
        {isSaved ? t("common.saved") : t("listing.save")}
      </Button>
      {!isOwner && (
        <Button asChild size="sm" className="bg-[#3D0066] hover:bg-[#2A0045] text-white rounded-lg px-6 font-bold shadow-md shadow-purple-900/10 transition-all active:scale-95">
          <Link href={`/cars/${listingId}/contact`}>{t("listing.contactSeller")}</Link>
        </Button>
      )}
    </div>
  );
}
