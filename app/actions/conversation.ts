"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function getOrCreateConversation(listingId: string) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not signed in" };

  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    select: { userId: true },
  });
  if (!listing) return { error: "Listing not found" }
  if (listing.userId === user.id) return { error: "Cannot message your own listing" };

  const existing = await prisma.conversation.findUnique({
    where: {
      listingId_buyerId: { listingId, buyerId: user.id },
    },
    include: {
      messages: { orderBy: { createdAt: "asc" } },
      listing: { select: { title: true, imageUrls: true } },
      seller: { select: { id: true, name: true, image: true } },
    },
  });

  if (existing) {
    return { conversationId: existing.id, conversation: existing };
  }

  const created = await prisma.conversation.create({
    data: {
      listingId,
      buyerId: user.id,
      sellerId: listing.userId,
    },
    include: {
      messages: true,
      listing: { select: { title: true, imageUrls: true } },
      seller: { select: { id: true, name: true, image: true } },
    },
  });

  revalidatePath("/dashboard/messages");
  return { conversationId: created.id, conversation: created };
}

export async function sendMessage(conversationId: string, content: string) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not signed in" };

  const conv = await prisma.conversation.findFirst({
    where: { id: conversationId },
    select: { buyerId: true, sellerId: true },
  });
  if (!conv) return { error: "Conversation not found" };
  if (conv.buyerId !== user.id && conv.sellerId !== user.id) {
    return { error: "Not in this conversation" };
  }

  const trimmed = content.trim();
  if (!trimmed) return { error: "Message is empty" };

  await prisma.message.create({
    data: {
      conversationId,
      senderId: user.id,
      content: trimmed,
    },
  });

  revalidatePath("/dashboard/messages");
  revalidatePath(`/dashboard/messages/${conversationId}`);
  return { success: true };
}

export async function getConversationsForUser() {
  const user = await getCurrentUser();
  if (!user) return [];

  const conversations = await prisma.conversation.findMany({
    where: {
      OR: [{ buyerId: user.id }, { sellerId: user.id }],
    },
    include: {
      listing: { select: { id: true, title: true, imageUrls: true } },
      buyer: { select: { id: true, name: true, image: true } },
      seller: { select: { id: true, name: true, image: true } },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return conversations;
}

export async function getConversationWithMessages(conversationId: string) {
  const user = await getCurrentUser();
  if (!user) return null;

  const conv = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      OR: [{ buyerId: user.id }, { sellerId: user.id }],
    },
    include: {
      listing: { select: { id: true, title: true, imageUrls: true } },
      buyer: { select: { id: true, name: true, image: true, email: true } },
      seller: { select: { id: true, name: true, image: true, email: true } },
      messages: { orderBy: { createdAt: "asc" } },
    },
  });

  return conv;
}
