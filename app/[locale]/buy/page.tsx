import { redirect } from "@/i18n/navigation";

/**
 * Buy page: redirects to the cars listing so "Buy" in the nav
 * and /buy always show the same car search experience.
 */
export default async function BuyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect({ href: "/cars", locale });
}
