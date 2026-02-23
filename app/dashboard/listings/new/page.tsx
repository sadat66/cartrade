import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { NewListingForm } from "./new-listing-form";

export default async function NewListingPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/dashboard/listings/new");

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Add listing</h1>
        <p className="text-muted-foreground">
          List your car for sale. You can add photos later.
        </p>
      </div>
      <NewListingForm />
    </div>
  );
}
