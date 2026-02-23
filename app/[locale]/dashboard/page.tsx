import { redirect } from "@/i18n/navigation";
import { DashboardHome } from "./dashboard-home";
import { getLocale } from "next-intl/server";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ confirmed?: string }>;
}) {
  const { confirmed } = await searchParams;
  if (!confirmed) redirect({ href: "/dashboard/profile", locale: await getLocale() });
  return <DashboardHome />;
}
