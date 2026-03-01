import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { DealershipProfileClient } from "./profile-client";

type Props = {
    params: Promise<{ locale: string; slug: string }>;
};

export default async function DealershipProfilePage({ params }: Props) {
    const { slug } = await params;

    const dealership = await prisma.dealership.findUnique({
        where: { slug },
        include: {
            owner: {
                select: { id: true, name: true, image: true },
            },
            vehicles: {
                where: { status: "available" },
                orderBy: { createdAt: "desc" },
            },
            _count: { select: { vehicles: true } },
        },
    });

    if (!dealership) {
        notFound();
    }

    const serialized = {
        ...dealership,
        vehicles: dealership.vehicles.map((v: any) => ({
            ...v,
            price: Number(v.price),
            createdAt: v.createdAt.toISOString(),
            updatedAt: v.updatedAt.toISOString(),
        })),
        createdAt: dealership.createdAt.toISOString(),
        updatedAt: dealership.updatedAt.toISOString(),
    };

    return <DealershipProfileClient dealership={serialized} />;
}
