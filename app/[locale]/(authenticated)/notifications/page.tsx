import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { NotificationsPageClient } from "./notifications-client";

export default async function NotificationsPage() {
    const user = await getCurrentUser();
    if (!user) redirect("/login");

    return <NotificationsPageClient />;
}
