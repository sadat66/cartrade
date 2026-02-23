import { redirect } from "next/navigation";
import { DashboardHome } from "./dashboard-home";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ confirmed?: string }>;
}) {
  const { confirmed } = await searchParams;
  if (!confirmed) redirect("/dashboard/profile");
  return <DashboardHome />;
}
