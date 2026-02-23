"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { saveListing, unsaveListing } from "@/app/actions/user";
import { Button } from "@/components/ui/button";

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

  const handleSave = () => {
    startTransition(async () => {
      if (isSaved) await unsaveListing(listingId);
      else await saveListing(listingId);
    });
  };

  if (!isLoggedIn) {
    return (
      <div className="flex flex-wrap gap-2">
        <Button asChild variant="outline" size="sm">
          <Link href={`/login?next=/cars/${listingId}`}>
            <Heart className="size-4 mr-1.5" />
            Save
          </Link>
        </Button>
        {!isOwner && (
          <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Link href={`/login?next=/cars/${listingId}`}>Contact seller</Link>
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
      >
        <Heart
          className={`size-4 mr-1.5 ${isSaved ? "fill-current" : ""}`}
        />
        {isSaved ? "Saved" : "Save"}
      </Button>
      {!isOwner && (
        <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700">
          <Link href={`/cars/${listingId}/contact`}>Contact seller</Link>
        </Button>
      )}
    </div>
  );
}
