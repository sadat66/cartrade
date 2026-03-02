"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

// ── Internal helper (called from other server actions) ──────────────────

export async function createNotification({
    userId,
    type,
    title,
    body,
    linkUrl,
}: {
    userId: string;
    type: "NEW_MESSAGE" | "LISTING_SAVED";
    title: string;
    body: string;
    linkUrl?: string;
}) {
    try {
        await prisma.notification.create({
            data: { userId, type, title, body, linkUrl },
        });
    } catch (error) {
        console.error("Failed to create notification:", error);
    }
}

// ── Public actions (called from the client) ─────────────────────────────

export async function getNotifications() {
    const user = await getCurrentUser();
    if (!user) return [];

    return prisma.notification.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 50,
    });
}

export async function getUnreadNotificationCount() {
    const user = await getCurrentUser();
    if (!user) return 0;

    return prisma.notification.count({
        where: { userId: user.id, read: false },
    });
}

export async function markNotificationAsRead(notificationId: string) {
    const user = await getCurrentUser();
    if (!user) return { error: "Not signed in" };

    await prisma.notification.updateMany({
        where: { id: notificationId, userId: user.id },
        data: { read: true },
    });

    revalidatePath("/notifications");
    return { success: true };
}

export async function markAllNotificationsAsRead() {
    const user = await getCurrentUser();
    if (!user) return { error: "Not signed in" };

    await prisma.notification.updateMany({
        where: { userId: user.id, read: false },
        data: { read: true },
    });

    revalidatePath("/notifications");
    return { success: true };
}

export async function deleteNotification(notificationId: string) {
    const user = await getCurrentUser();
    if (!user) return { error: "Not signed in" };

    await prisma.notification.deleteMany({
        where: { id: notificationId, userId: user.id },
    });

    revalidatePath("/notifications");
    return { success: true };
}
