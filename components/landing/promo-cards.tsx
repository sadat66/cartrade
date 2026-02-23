import { Link } from "@/i18n/navigation";
import { Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getTranslations } from "next-intl/server";

export async function PromoCards() {
  const t = await getTranslations();
  return (
    <section className="container mx-auto px-4 py-12 md:px-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle className="text-xl">{t("promo.instantCashTitle")}</CardTitle>
              <CardDescription className="mt-1.5">
                {t("promo.instantCashDesc")}
              </CardDescription>
            </div>
            <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-muted">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url(https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=224&q=80)",
                }}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder={t("promo.enterRego")}
                className="max-w-[140px]"
                aria-label={t("common.rego")}
              />
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                {t("promo.getOffer")}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <Building2 className="size-5 text-blue-600" />
                {t("promo.browseDealerships")}
              </CardTitle>
              <CardDescription className="mt-1.5">
                {t("promo.browseDealershipsDesc")}
              </CardDescription>
            </div>
          </CardHeader>
          <CardFooter>
            <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
              <Link href="/dealerships">{t("promo.findDealerships")}</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
