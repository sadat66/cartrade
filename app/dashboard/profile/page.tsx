import { redirect } from "next/navigation";
import Image from "next/image";
import { getCurrentUser } from "@/lib/auth";
import { updateProfile } from "@/app/actions/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileForm } from "./profile-form";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/dashboard/profile");

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-muted-foreground">Manage your account and visibility.</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <div className="relative h-20 w-20 overflow-hidden rounded-full bg-muted">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name ?? "Avatar"}
                fill
                className="object-cover"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-2xl font-medium text-muted-foreground">
                {(user.name ?? user.email).charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <CardTitle>{user.name ?? "No name set"}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <ProfileForm
            defaultValues={{
              name: user.name ?? "",
              phone: user.phone ?? "",
              location: user.location ?? "",
              bio: user.bio ?? "",
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
