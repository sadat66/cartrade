import { redirect } from "@/i18n/navigation";
import Image from "next/image";
import { getCurrentUser } from "@/lib/auth";
import { updateProfile } from "@/app/actions/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileForm } from "./profile-form";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/i18n/config";

type Props = { params: Promise<{ locale: string }> };

export default async function ProfilePage({ params }: Props) {
  const { locale } = await params;
  const validLocale: Locale =
    locale && routing.locales.includes(locale as Locale)
      ? (locale as Locale)
      : routing.defaultLocale;
  const user = await getCurrentUser();
  if (!user) redirect({ href: "/login?next=/dashboard/profile", locale: validLocale });
  const t = await getTranslations({ locale: validLocale });
  const currentUser = user!;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("dashboard.profile.title")}</h1>
        <p className="text-muted-foreground">{t("dashboard.profile.subtitle")}</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <ProfileForm
            user={{
              name: currentUser.name,
              email: currentUser.email,
              phone: currentUser.phone,
              location: currentUser.location,
              bio: currentUser.bio,
              image: currentUser.image,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
